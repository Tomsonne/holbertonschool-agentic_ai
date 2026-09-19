# Spécifications — Webhook de notifications de paiement

## Objectif

Mettre à disposition de la banque un point d'entrée HTTP capable de recevoir ses notifications de paiement au format JSON, de les enregistrer dans la console et d'en confirmer immédiatement la réception, puis de confier leur analyse par un LLM à un Worker asynchrone au moyen d'une file d'attente Redis.

## Périmètre

La fonctionnalité couvre uniquement :

- l'exposition de la route `POST /payments/webhook` ;
- la réception d'un corps de requête au format JSON ;
- la validation syntaxique du JSON reçu ;
- l'enregistrement dans la console de chaque notification valide ;
- l'envoi immédiat d'une réponse HTTP `200 OK` après réception d'une notification valide ;
- la remise des notifications valides à une file d'attente Redis ;
- la récupération asynchrone des notifications par un service Worker séparé ;
- l'analyse de la transaction par un LLM depuis le Worker ;
- le traçage de l'appel au LLM dans Langfuse au moyen de `observeOpenAI` ;
- la tolérance aux indisponibilités temporaires de Redis, notamment au démarrage.

## Règles métier et comportement attendu

1. Le système reçoit les notifications de paiement sur `POST /payments/webhook`.
2. Une notification est considérée comme valide lorsque le corps de la requête contient du JSON syntaxiquement valide.
3. Aucun champ métier n'est obligatoire et aucune validation métier du contenu ne doit être appliquée, le format précis de la banque n'étant pas fourni.
4. Chaque notification valide reçue est enregistrée dans la console.
5. Chaque notification valide donne lieu à une réponse immédiate avec le statut HTTP `200 OK`.
6. Chaque notification valide doit faire l'objet d'une tentative de remise à la file d'attente Redis afin d'être traitée de manière asynchrone.
7. La réponse HTTP ne doit attendre ni la récupération de la notification par le Worker, ni l'analyse par le LLM, ni le traçage Langfuse.
8. L'analyse par le LLM ne doit jamais être exécutée par le serveur Express dans le traitement de la requête HTTP.
9. Le Worker est seul responsable du traitement lourd : il écoute Redis, récupère les notifications disponibles et déclenche leur analyse par le LLM.
10. Chaque appel au LLM effectué par le Worker doit être instrumenté dans Langfuse avec `observeOpenAI`.
11. Une indisponibilité temporaire de Redis ne doit pas provoquer l'arrêt définitif de l'App Express ni du Worker.
12. Une erreur d'analyse par le LLM ne doit pas modifier la réponse HTTP déjà envoyée par le webhook ni arrêter définitivement le Worker.

## Parcours asynchrone

1. La banque envoie une notification JSON à `POST /payments/webhook`.
2. L'App Express valide uniquement que le corps contient du JSON syntaxiquement valide.
3. Pour une notification valide, l'App Express conserve l'enregistrement dans la console et répond rapidement avec `200 OK`.
4. L'App Express remet la notification à Redis afin qu'elle soit disponible dans la file d'attente. Cette remise ne déclenche aucune analyse LLM dans le contexte de la requête HTTP.
5. Le Worker séparé écoute la file Redis et récupère les notifications disponibles.
6. Pour chaque notification récupérée, le Worker demande au LLM d'analyser la transaction représentée par la notification.
7. L'appel au LLM est observé dans Langfuse au moyen de `observeOpenAI`, qu'il réussisse ou échoue.
8. Le résultat ou l'échec de l'analyse reste découplé de la réponse HTTP du webhook, qui a déjà été envoyée.

## Rôle des composants

### App Express

- Exposer et conserver la route `POST /payments/webhook`.
- Appliquer uniquement la validation JSON existante.
- Enregistrer dans la console toute notification valide.
- Répondre rapidement avec `200 OK` sans attendre le traitement asynchrone.
- Remettre les notifications valides à la file Redis lorsqu'elle est disponible.
- Ne jamais appeler directement le LLM depuis la requête HTTP.
- Rester opérationnelle ou tenter de retrouver un état opérationnel après une erreur temporaire de connexion à Redis.

### Redis

- Servir de file d'attente entre l'App Express et le Worker.
- Recevoir les notifications valides remises par l'App Express.
- Rendre les notifications disponibles au Worker sans coupler leur traitement à la réponse HTTP.
- Ne pas être utilisé comme une nouvelle source de validation métier de la notification.

### Worker

- S'exécuter comme un service distinct de l'App Express.
- Écouter Redis et récupérer les notifications de paiement disponibles.
- Déclencher l'analyse de chaque transaction par le LLM hors du cycle de la requête HTTP.
- Instrumenter l'appel au LLM dans Langfuse avec `observeOpenAI`.
- Isoler les erreurs de traitement afin qu'une notification en échec n'arrête pas définitivement le traitement des autres notifications.
- Rester actif ou retenter sa connexion après une indisponibilité temporaire de Redis.

## Analyse IA et traçage Langfuse

- L'entrée de l'analyse est la notification JSON récupérée depuis Redis.
- L'analyse doit porter sur la transaction décrite par la notification, sans ajouter de validation métier au webhook.
- Aucun modèle LLM précis n'est imposé par le besoin.
- Aucun format de résultat, aucune décision métier automatisée et aucune persistance du résultat ne sont imposés.
- Tout appel au LLM doit provenir du Worker et être enveloppé par `observeOpenAI` afin de produire une observation dans Langfuse.
- Le traçage doit permettre de distinguer un appel réussi d'un appel en erreur.
- L'absence ou l'indisponibilité de Langfuse ne doit pas déplacer l'analyse dans l'App Express ni retarder la réponse HTTP du webhook.

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
- Délai fonctionnel : réponse envoyée rapidement, sans attente de la consommation Redis, de l'analyse LLM ou du traçage Langfuse.
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
- **Redis indisponible au démarrage** : l'App Express et le Worker ne doivent pas rester définitivement arrêtés à cause d'une erreur temporaire. Le démarrage doit être protégé par au moins l'un des mécanismes imposés dans les contraintes Docker Compose.
- **Redis indisponible pendant le fonctionnement** : l'erreur doit être gérée sans arrêt définitif de l'App Express ou du Worker. L'App doit continuer à préserver le comportement HTTP validé du webhook ; l'échec de remise en file doit être signalé dans les journaux. Après le rétablissement de Redis, les processus doivent pouvoir reprendre leurs échanges avec la file sans intervention manuelle sur chaque notification future.
- **Notification reçue pendant l'indisponibilité de Redis** : elle reste une notification JSON valide, doit être enregistrée dans la console et doit recevoir rapidement `200 OK`. La persistance locale, le rejeu ultérieur et la garantie de livraison de cette notification ne sont pas imposés.
- **Erreur du LLM** : l'échec doit être contenu dans le Worker, être traçable comme une erreur dans Langfuse lorsque le service de traçage est disponible, ne pas modifier la réponse HTTP déjà envoyée et ne pas arrêter définitivement le Worker.
- **Langfuse indisponible ou mal configuré** : l'erreur d'observabilité doit être gérée dans le Worker sans incidence sur la disponibilité du webhook. Aucune garantie de conservation locale ou de rejeu des traces n'est imposée.
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

6. **Mise en file d'une notification valide**
   - Étant donné que Redis est disponible,
   - quand l'App Express reçoit une notification JSON valide,
   - alors cette notification est remise à la file Redis,
   - et la réponse HTTP n'attend pas son analyse.

7. **Traitement exclusivement asynchrone**
   - Étant donné une notification disponible dans Redis,
   - quand le Worker la récupère,
   - alors l'analyse LLM est déclenchée par le Worker,
   - et aucun appel LLM n'est exécuté dans le traitement de la requête HTTP.

8. **Traçage de l'appel LLM**
   - Étant donné qu'une notification est analysée par le Worker,
   - quand le Worker appelle le LLM,
   - alors l'appel est instrumenté avec `observeOpenAI`,
   - et une observation de succès ou d'erreur est envoyée à Langfuse lorsque celui-ci est disponible et correctement configuré.

9. **Redis indisponible au démarrage**
   - Étant donné que Redis n'est pas encore disponible au démarrage de la pile,
   - quand l'App Express et le Worker doivent démarrer,
   - alors le mécanisme de retry des deux processus ou le healthcheck Redis associé à `depends_on` avec `condition: service_healthy` empêche qu'une erreur temporaire les arrête définitivement.

10. **Redis temporairement indisponible après le démarrage**
    - Étant donné une perte temporaire de connexion à Redis,
    - quand l'App Express ou le Worker rencontre l'erreur,
    - alors le processus concerné ne s'arrête pas définitivement,
    - et il peut reprendre l'utilisation de la file après le retour de Redis.

11. **Préservation du webhook lorsque Redis est indisponible**
    - Étant donné que Redis est indisponible,
    - quand une notification JSON valide est reçue,
    - alors elle est enregistrée dans la console,
    - et le webhook répond rapidement avec `200 OK` sans exécuter l'analyse LLM dans la requête HTTP.

12. **Échec de l'analyse LLM**
    - Étant donné que le LLM échoue ou est indisponible pendant une analyse,
    - quand le Worker traite la notification,
    - alors l'erreur est isolée et signalée,
    - la réponse HTTP déjà envoyée reste inchangée,
    - et le Worker reste capable de traiter d'autres notifications.

## Tests attendus

- Vérifier qu'un `POST /payments/webhook` avec un corps JSON valide produit une trace dans la console et retourne `200 OK`.
- Vérifier qu'un JSON valide ne contenant aucun champ métier prédéfini est accepté avec `200 OK`.
- Vérifier qu'un JSON valide contenant des champs inconnus est accepté avec `200 OK`.
- Vérifier qu'un JSON mal formé retourne `400 Bad Request` et n'est pas enregistré comme une notification valide.
- Vérifier qu'un corps absent ou vide retourne `400 Bad Request` et n'est pas enregistré comme une notification valide.
- Vérifier que deux notifications identiques sont reçues et enregistrées séparément, chacune avec une réponse `200 OK`.
- Vérifier que plusieurs notifications simultanées obtiennent chacune une réponse conforme.
- Vérifier que la réponse à une notification valide ne dépend ni du Worker, ni du LLM, ni de Langfuse.
- Vérifier qu'une notification valide est placée dans Redis lorsque Redis est disponible.
- Vérifier que le Worker récupère une notification depuis Redis et déclenche son analyse par le LLM.
- Vérifier que l'App Express ne déclenche jamais directement l'appel au LLM pendant le traitement de la requête HTTP.
- Vérifier que chaque appel au LLM depuis le Worker est instrumenté avec `observeOpenAI` et produit une observation Langfuse de succès lorsque Langfuse est disponible.
- Vérifier qu'une erreur du LLM est observée comme telle lorsque Langfuse est disponible, n'affecte pas la réponse HTTP et n'arrête pas définitivement le Worker.
- Vérifier le comportement de l'App Express et du Worker lorsque Redis est indisponible au démarrage, conformément au mécanisme de disponibilité retenu.
- Vérifier qu'une interruption temporaire de Redis après le démarrage n'arrête définitivement ni l'App Express ni le Worker et que l'utilisation de la file peut reprendre après rétablissement.
- Vérifier que, pendant une indisponibilité de Redis, une notification JSON valide reste enregistrée dans la console et reçoit rapidement `200 OK`, sans appel LLM dans la requête HTTP.
- Vérifier qu'une indisponibilité de Langfuse ne dégrade pas le contrat HTTP du webhook et n'entraîne aucun appel LLM depuis l'App Express.
- Vérifier que la configuration Docker Compose déclare les services App, Worker et Redis et met en œuvre l'une des deux solutions admises pour la disponibilité de Redis au démarrage.

## Variables d'environnement nécessaires

- `REDIS_URL` : adresse de connexion à Redis, accessible à l'App Express et au Worker.
- `OPENAI_API_KEY` : clé d'authentification permettant au Worker d'effectuer l'appel LLM observé avec `observeOpenAI`.
- `LANGFUSE_PUBLIC_KEY` : clé publique du projet Langfuse utilisée par le Worker.
- `LANGFUSE_SECRET_KEY` : clé secrète du projet Langfuse utilisée par le Worker.
- `LANGFUSE_BASE_URL` : adresse de l'instance ou de la région Langfuse ciblée, requise uniquement si la valeur par défaut du client ne convient pas.

Aucune valeur sensible ne doit être inscrite en dur dans les fichiers versionnés. Le modèle LLM n'étant pas imposé, les spécifications ne fixent ni son nom ni une variable de configuration particulière pour le sélectionner.

## Contraintes techniques imposées

- L'API doit être développée avec Node.js et Express.
- Le point d'entrée retenu par hypothèse est `POST /payments/webhook`.
- Le projet doit contenir un `Dockerfile` minimaliste.
- Dans Docker, le processus Node.js devra s'exécuter avec un utilisateur non-root.
- Aucun champ métier obligatoire ne doit être défini tant que le format précis de la banque n'est pas fourni.
- Redis doit être utilisé comme file d'attente entre l'App Express et le Worker, sans imposer de bibliothèque de file particulière.
- Le Worker doit être un processus séparé de l'App Express.
- L'appel au LLM doit être réalisé uniquement depuis le Worker et tracé dans Langfuse avec `observeOpenAI`.
- Un fichier `docker-compose.yml` doit contenir les services correspondant aux rôles App, Worker et Redis. Les noms techniques exacts des services ne sont pas imposés.
- L'App et le Worker doivent pouvoir joindre le service Redis au sein de la pile Docker Compose et recevoir leur configuration par variables d'environnement.
- La disponibilité de Redis au démarrage doit être gérée au minimum par l'une des solutions suivantes :
  - un mécanisme de retry de connexion dans l'App Express et dans le Worker ;
  - ou un healthcheck du service Redis dans `docker-compose.yml`, associé pour l'App et le Worker à `depends_on` avec `condition: service_healthy`.
- Les erreurs temporaires de connexion à Redis ne doivent pas arrêter définitivement l'App Express ou le Worker.

## Éléments hors périmètre

- L'attente synchrone d'un traitement métier lourd avant la réponse.
- La définition ou la validation d'un schéma métier bancaire.
- L'authentification de la banque, la vérification de signature ou tout autre mécanisme de sécurité non demandé.
- La persistance des notifications dans une base de données ou un fichier.
- La déduplication et la gestion de l'idempotence.
- La garantie de livraison, le rejeu des notifications non mises en file, une file de quarantaine et une stratégie de nouvelle tentative des analyses LLM.
- La définition d'un format de résultat de l'analyse IA, son stockage ou l'exécution automatique d'une décision métier à partir de ce résultat.
- Le choix d'un modèle LLM précis.
- Le choix d'une bibliothèque ou d'une structure de données Redis particulière pour implémenter la file.
- La conservation locale et le rejeu des traces lorsque Langfuse est indisponible.
- Toute autre route ou fonctionnalité d'API.
