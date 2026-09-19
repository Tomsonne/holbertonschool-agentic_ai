# ADR-001 — Stockages spécialisés par charge de travail

- **Statut :** Accepté
- **Date :** 2026-09-18

## Contexte

MegaShop-B2B doit servir 50 000 utilisateurs simultanés. Le panier exige une latence p95 inférieure à 50 ms et doit rester disponible pendant une indisponibilité temporaire de la base principale. Les données métier transactionnelles nécessitent relations et intégrité ACID. Enfin, toutes les actions acceptées doivent alimenter un historique complet, inaltérable et conservable à des fins légales.

Une base unique créerait un point de panne commun et obligerait à optimiser des charges incompatibles : transactions relationnelles, accès clé-valeur à très faible latence et archivage append-only de longue durée.

## Décision

Nous retenons une stratégie polyglotte, chaque stockage ayant une responsabilité explicite :

1. **PostgreSQL managé Multi-AZ** est la source de vérité des commandes, clients, catalogues et états de paiement. Ses contraintes, transactions ACID, sauvegardes à un instant donné et réplicas de lecture conviennent au cœur métier relationnel.
2. **DynamoDB multi-AZ** est la source de vérité opérationnelle des paniers, partitionnée par locataire et identifiant de panier, avec capacité à la demande et TTL pour les paniers expirés. Une opération conditionnelle protège les mises à jour concurrentes. Le service panier ne dépend pas de PostgreSQL.
3. **Stockage objet avec Object Lock en mode Compliance** reçoit l'audit en écriture seule, avec versioning, chiffrement, rétention et contrôle d'accès séparé. Il est alimenté par Kafka depuis les journaux d'accès, les Streams DynamoDB et l'outbox transactionnelle PostgreSQL. Kafka est le transport rejouable ; le stockage WORM est l'archive légale.

L'outbox est écrite dans la même transaction que la mutation PostgreSQL. Pour le panier, le flux de changements natif capture chaque mutation durable. Les événements portent un identifiant global, un ordre par agrégat, un horodatage, l'acteur et une empreinte ; les données bancaires sensibles sont exclues ou masquées. Des contrôles de séquence et de rapprochement alertent sur toute lacune d'archivage.

## Conséquences

### Avantages

- Le panier conserve sa faible latence et sa disponibilité même si PostgreSQL est indisponible.
- Chaque technologie est alignée sur son profil de données et peut évoluer indépendamment.
- Les transactions relationnelles restent fortes dans leur périmètre.
- L'audit WORM répond à l'exigence d'inaltérabilité et reste vérifiable dans le temps.
- Les flux CDC/Streams sont rejouables et découplent la production de l'archivage.

### Inconvénients et risques

- Trois familles de stockage augmentent le coût, l'observabilité et les compétences d'exploitation nécessaires.
- Il n'existe pas de transaction distribuée entre panier et cœur métier : la convergence est asynchrone et doit être conçue avec idempotence, versionnement et compensation.
- DynamoDB impose de connaître les chemins d'accès, de surveiller les partitions chaudes et de borner la taille d'un panier.
- L'audit n'est légalement probant que si la rétention, les rôles privilégiés, les clés de chiffrement et les contrôles de complétude sont gouvernés et testés.
- Le verrouillage Compliance empêche aussi une suppression administrative anticipée ; les durées doivent donc être validées par le juridique, notamment vis-à-vis des règles de protection des données.

## Alternatives écartées

### PostgreSQL unique pour toutes les données

Écarté car son indisponibilité rendrait le panier indisponible et les pics de panier concurrenceraient les transactions métier. Des réplicas améliorent les lectures, mais ne résolvent pas la disponibilité des écritures pendant une panne du primaire.

### Redis comme seule base du panier

Écarté comme source de vérité : malgré son excellente latence, la durabilité et la reprise après sinistre demanderaient davantage de précautions, et une perte de données reste possible selon la réplication et la persistance choisies. Redis pourra être ajouté ultérieurement comme cache mesuré, sans devenir une dépendance nécessaire.

### Cassandra pour le panier et l'audit

Écarté à ce stade : il satisfait l'échelle et la disponibilité, mais son exploitation est plus lourde qu'un service clé-valeur managé et ses données restent modifiables ; il ne remplace donc pas une archive WORM légale.

### Journal d'audit uniquement dans Kafka

Écarté car la rétention Kafka est finie et les opérateurs peuvent supprimer ou réécrire des sujets. Kafka reste adapté au transport et au rejeu, pas à la conservation légale inaltérable.

### Stockage objet standard sans verrouillage

Écarté car le versioning seul ne protège pas contre un acteur privilégié capable de supprimer les versions. Le mode WORM Compliance garantit l'absence de modification ou suppression avant l'échéance de rétention.
