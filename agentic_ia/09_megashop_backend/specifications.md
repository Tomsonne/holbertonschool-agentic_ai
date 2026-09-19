# Spécifications — Webhook de notifications de paiement

## Objectif

Mettre à disposition de la banque un point d'entrée HTTP capable de recevoir ses notifications de paiement au format JSON, de les enregistrer dans la console et d'en confirmer immédiatement la réception.

## Périmètre

La fonctionnalité couvre uniquement :

- l'exposition de la route `POST /payments/webhook` ;
- la réception d'un corps de requête au format JSON ;
- la validation syntaxique du JSON reçu ;
- l'enregistrement dans la console de chaque notification valide ;
- l'envoi immédiat d'une réponse HTTP `200 OK` après réception d'une notification valide.

## Règles métier et comportement attendu

1. Le système reçoit les notifications de paiement sur `POST /payments/webhook`.
2. Une notification est considérée comme valide lorsque le corps de la requête contient du JSON syntaxiquement valide.
3. Aucun champ métier n'est obligatoire et aucune validation métier du contenu ne doit être appliquée, le format précis de la banque n'étant pas fourni.
4. Chaque notification valide reçue est enregistrée dans la console.
5. Chaque notification valide donne lieu à une réponse immédiate avec le statut HTTP `200 OK`.
6. La réponse ne doit pas attendre l'exécution d'un traitement métier lourd.
7. Aucun traitement métier lourd n'est déclenché dans le périmètre de cette fonctionnalité.

## Format général de l'entrée

- Méthode HTTP : `POST`.
- Route : `/payments/webhook`.
- Format du corps : JSON syntaxiquement valide.
- Structure métier : non définie par le besoin.
- Champs obligatoires : aucun.
- Valeurs, types et règles propres aux données bancaires : non spécifiés.

Le système ne doit donc pas supposer la présence d'un identifiant de paiement, d'un montant, d'une devise, d'un statut ou de tout autre champ métier.

## Réponses HTTP

### Notification valide

- Statut : `200 OK`.
- Délai fonctionnel : réponse envoyée immédiatement, sans attente d'un traitement métier lourd.
- Corps de la réponse : aucun contenu particulier n'est imposé par le besoin.

### JSON invalide ou corps ne contenant pas de JSON exploitable

- La notification n'est pas considérée comme valide.
- Elle ne doit pas être enregistrée dans la console en tant que notification valide.
- Le statut attendu est `400 Bad Request`.
- Aucun format particulier de corps de réponse d'erreur n'est imposé.

## Cas d'erreur et cas limites

- **JSON mal formé** : retourner `400 Bad Request` et ne pas traiter la requête comme une notification valide.
- **Corps absent ou vide** : retourner `400 Bad Request`, puisqu'aucune notification JSON exploitable n'a été fournie.
- **JSON valide sans champ métier** : accepter la notification, l'enregistrer dans la console et retourner `200 OK` ; aucun champ métier n'est obligatoire.
- **Champs inconnus ou structure métier inattendue** : accepter la notification si le JSON est syntaxiquement valide, faute de contrat métier fourni par la banque.
- **Notifications identiques ou répétées** : traiter chaque réception comme une notification valide indépendante ; aucune déduplication n'est demandée.
- **Requêtes simultanées** : chacune doit recevoir le comportement prévu indépendamment des autres.
- **Autre méthode ou autre route** : hors du périmètre de ce point d'entrée ; aucun comportement spécifique supplémentaire n'est imposé.

## Critères d'acceptation

1. **Réception d'une notification JSON valide**
   - Étant donné que l'API est démarrée,
   - quand une requête `POST` contenant du JSON valide est envoyée sur `/payments/webhook`,
   - alors la notification est enregistrée dans la console,
   - et la réponse possède le statut `200 OK`.

2. **Absence de validation métier imposée**
   - Étant donné que le schéma de la banque n'est pas fourni,
   - quand la route reçoit un corps JSON valide sans champ métier particulier ou contenant des champs inconnus,
   - alors la requête est acceptée,
   - et elle produit l'enregistrement dans la console et la réponse `200 OK` attendus.

3. **Réponse immédiate**
   - Étant donné une notification valide,
   - quand elle est reçue,
   - alors la réponse `200 OK` est envoyée sans attendre l'exécution d'un traitement métier lourd.

4. **Rejet d'un JSON invalide**
   - Étant donné un corps JSON mal formé,
   - quand il est envoyé sur la route du webhook,
   - alors la réponse possède le statut `400 Bad Request`,
   - et le contenu n'est pas enregistré comme une notification valide.

5. **Rejet d'un corps absent ou vide**
   - Étant donné une requête sans notification JSON exploitable,
   - quand elle est envoyée sur la route du webhook,
   - alors la réponse possède le statut `400 Bad Request`,
   - et aucune notification valide n'est enregistrée dans la console.

## Tests attendus

- Vérifier qu'un `POST /payments/webhook` avec un corps JSON valide produit une trace dans la console et retourne `200 OK`.
- Vérifier qu'un JSON valide ne contenant aucun champ métier prédéfini est accepté avec `200 OK`.
- Vérifier qu'un JSON valide contenant des champs inconnus est accepté avec `200 OK`.
- Vérifier qu'un JSON mal formé retourne `400 Bad Request` et n'est pas enregistré comme une notification valide.
- Vérifier qu'un corps absent ou vide retourne `400 Bad Request` et n'est pas enregistré comme une notification valide.
- Vérifier que deux notifications identiques sont reçues et enregistrées séparément, chacune avec une réponse `200 OK`.
- Vérifier que plusieurs notifications simultanées obtiennent chacune une réponse conforme.
- Vérifier que la réponse à une notification valide ne dépend d'aucun traitement métier lourd.

## Contraintes techniques imposées

- L'API doit être développée avec Node.js et Express.
- Le point d'entrée retenu par hypothèse est `POST /payments/webhook`.
- Le projet doit contenir un `Dockerfile` minimaliste.
- Dans Docker, le processus Node.js devra s'exécuter avec un utilisateur non-root.
- Aucun champ métier obligatoire ne doit être défini tant que le format précis de la banque n'est pas fourni.

## Éléments hors périmètre

- Le traitement métier des paiements après réception.
- L'attente synchrone d'un traitement métier lourd avant la réponse.
- La définition ou la validation d'un schéma métier bancaire.
- L'authentification de la banque, la vérification de signature ou tout autre mécanisme de sécurité non demandé.
- La persistance des notifications dans une base de données ou un fichier.
- La déduplication et la gestion de l'idempotence.
- Les mécanismes de file d'attente, de reprise ou de nouvelle tentative.
- Toute autre route ou fonctionnalité d'API.
