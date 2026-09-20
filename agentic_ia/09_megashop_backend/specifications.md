# Spécifications — Webhook de notifications de paiement

## Objectif

Mettre à disposition de la banque un point d'entrée HTTP capable de recevoir ses notifications de paiement au format JSON, de les enregistrer dans la console et d'en confirmer immédiatement la réception, puis de confier leur analyse par un LLM à un Worker asynchrone au moyen d'une file d'attente Redis. Prévoir, dans le traitement du Worker, une validation humaine explicite avant toute action de remboursement ultérieure.

## Périmètre

La fonctionnalité couvre uniquement :

- l'exposition de la route `POST /payments/webhook` ;
- la réception d'un corps de requête au format JSON ;
- la validation syntaxique du JSON reçu ;
- l'enregistrement dans la console de chaque notification valide ;
- l'envoi immédiat d'une réponse HTTP `200 OK` après réception d'une notification valide ;
- la remise des notifications valides à une file d'attente Redis ;
- la récupération asynchrone des notifications par un service Worker séparé ;
- l'analyse de la transaction par Google Gemini depuis le Worker, au moyen de son endpoint compatible avec le SDK OpenAI ;
- le traçage de l'appel au LLM dans Langfuse au moyen de `observeOpenAI` ;
- la validation humaine interactive des notifications de remboursement récupérées par le Worker et le score Langfuse de cette décision ;
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
9. Le Worker est seul responsable du traitement lourd : il écoute Redis, récupère les notifications disponibles et déclenche leur analyse par Google Gemini.
10. Chaque appel à Google Gemini effectué par le Worker doit utiliser l'endpoint compatible avec le SDK OpenAI `https://generativelanguage.googleapis.com/v1beta/openai/` et être instrumenté dans Langfuse avec `observeOpenAI`.
11. Une indisponibilité temporaire de Redis ne doit pas provoquer l'arrêt définitif de l'App Express ni du Worker.
12. Une erreur d'analyse par le LLM ne doit pas modifier la réponse HTTP déjà envoyée par le webhook ni arrêter définitivement le Worker.
13. Si la notification récupérée par le Worker possède `type` égal exactement à `refund`, une confirmation humaine explicite est obligatoire avant la poursuite de son traitement. Les autres notifications n'en demandent pas.

## Parcours asynchrone

1. La banque envoie une notification JSON à `POST /payments/webhook`.
2. L'App Express valide uniquement que le corps contient du JSON syntaxiquement valide.
3. Pour une notification valide, l'App Express conserve l'enregistrement dans la console et répond rapidement avec `200 OK`.
4. L'App Express remet la notification à Redis afin qu'elle soit disponible dans la file d'attente. Cette remise ne déclenche aucune analyse LLM dans le contexte de la requête HTTP.
5. Le Worker séparé écoute la file Redis et récupère les notifications disponibles.
6. Pour chaque notification récupérée, le Worker demande à Google Gemini d'analyser la transaction représentée par la notification au moyen de son endpoint compatible avec le SDK OpenAI.
7. L'appel à Google Gemini est observé dans Langfuse au moyen de `observeOpenAI`, qu'il réussisse ou échoue.
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
- Déclencher l'analyse de chaque transaction par Google Gemini hors du cycle de la requête HTTP.
- Appeler Google Gemini au moyen de l'endpoint compatible avec le SDK OpenAI `https://generativelanguage.googleapis.com/v1beta/openai/`.
- Conserver l'instrumentation du client compatible OpenAI avec `observeOpenAI` afin de tracer les appels dans Langfuse.
- Isoler les erreurs de traitement afin qu'une notification en échec n'arrête pas définitivement le traitement des autres notifications.
- Rester actif ou retenter sa connexion après une indisponibilité temporaire de Redis.
- Demander une confirmation interactive pour une notification de remboursement avant de poursuivre son traitement, puis enregistrer la décision dans la trace Langfuse correspondante.

## Validation humaine des remboursements

### Identification du remboursement

- Le champ optionnel `type` appartient à la notification JSON récupérée depuis Redis par le Worker. Si `notification.type` vaut exactement la chaîne `refund` (casse comprise), le traitement est considéré comme une demande de remboursement et déclenche le Pre-Hook de confirmation. Toute autre valeur ou l'absence du champ ne déclenche pas ce Pre-Hook.
- Le champ `type` reste optionnel et n'est pas validé par l'App Express : le webhook continue d'accepter tout objet JSON valide, qu'il comporte ou non ce champ.
- La décision de déclencher le Pre-Hook ne doit pas être déduite du texte libre produit par Gemini.

### Décision interactive

1. Si `notification.type` n'est pas exactement `refund`, le Worker poursuit son traitement sans demander de confirmation et sans produire de score de décision de remboursement.
2. Si `notification.type` vaut exactement `refund`, le Worker suspend son traitement et présente dans son terminal une demande de confirmation interactive `o/n`. Une seule confirmation interactive peut être active à la fois ; les notifications suivantes restent dans Redis jusqu'à la décision.
3. Seule la réponse exacte `o` autorise la poursuite de ce traitement. Elle ne constitue pas une preuve qu'un remboursement ou une mise à jour de commande a été exécuté.
4. La réponse exacte `n` annule l'action de remboursement pour ce traitement. Elle ne doit pas être exécutée plus tard sans une nouvelle décision explicite.
5. Toute réponse différente de `o` ou `n`, y compris une réponse vide ou avec des caractères supplémentaires, est refusée comme réponse invalide et la même question est redemandée. Cette réponse n'autorise jamais l'action. Si la saisie se termine avant une réponse valide, la règle suivante s'applique.
6. Si l'entrée interactive est fermée, indisponible ou interrompue avant une réponse valide, la confirmation est absente : le remboursement est refusé selon le principe *fail-closed*. Le Worker ne doit pas rester indéfiniment en attente d'une entrée déjà indisponible.
7. Un refus ou une absence de confirmation n'arrête pas définitivement le Worker et ne modifie pas la réponse HTTP déjà envoyée par le webhook.
8. Après autorisation ou refus, le Worker reprend normalement sa boucle et peut récupérer la notification suivante depuis Redis. Aucun traitement simultané des autres notifications n'est exigé pendant l'attente humaine.

### Traçage de la décision

- Chaque décision finale de remboursement doit être enregistrée dans Langfuse sous le nom stable `human_refund_approval`. Ce score, distinct du résultat de l'analyse LLM, vaut `1` pour `o` et `0` pour `n` ou une absence de confirmation. Une réponse invalide suivie d'une réponse valide ne produit que le score de la décision finale ; une notification qui n'est pas un remboursement ne produit aucun score `human_refund_approval`.
- Le score mesure l'issue de la **validation humaine**, et non la réussite d'un appel Gemini, d'un remboursement ou d'une mise à jour de commande.
- Le score doit être rattaché à l'identifiant de la trace Langfuse du traitement Worker de la notification concernée, jamais à la trace d'une autre notification ni à une trace globale du Worker.
- Si Langfuse est indisponible ou mal configuré, l'échec d'enregistrement est signalé et isolé dans le Worker, conformément à la tolérance aux erreurs d'observabilité déjà prévue. La conservation locale et le rejeu ultérieur du score ne sont pas imposés.

## Analyse IA et traçage Langfuse

- L'entrée de l'analyse est la notification JSON récupérée depuis Redis.
- L'analyse doit porter sur la transaction décrite par la notification, sans ajouter de validation métier au webhook.
- Le fournisseur LLM imposé est Google Gemini, mais aucun modèle Gemini précis n'est imposé.
- Aucun format de résultat, aucune décision métier automatisée et aucune persistance du résultat ne sont imposés.
- Tout appel à Google Gemini doit provenir du Worker, utiliser l'endpoint compatible avec le SDK OpenAI `https://generativelanguage.googleapis.com/v1beta/openai/` et être enveloppé par `observeOpenAI` afin de produire une observation dans Langfuse.
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
- **Réponse interactive invalide** : refuser cette réponse, redemander `o/n` pour la même action et ne produire aucun score final avant une réponse valide ou la fermeture de l'entrée.
- **Entrée interactive fermée, indisponible ou interrompue** : refuser le remboursement et produire le score d'échec si Langfuse est disponible ; le Worker reprend ensuite sa boucle de traitement.
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
   - quand le Worker appelle Google Gemini au moyen de l'endpoint compatible avec le SDK OpenAI `https://generativelanguage.googleapis.com/v1beta/openai/`,
   - alors le client reste instrumenté avec `observeOpenAI`,
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

13. **Notification autre qu'un remboursement**
    - Étant donné une notification dont `type` n'est pas exactement `refund`, y compris lorsque le champ est absent,
    - quand le Worker la récupère,
    - alors il ne déclenche pas le Pre-Hook, ne demande aucune confirmation et ne crée aucun score `human_refund_approval`.

14. **Remboursement autorisé**
    - Étant donné une notification dont `type` vaut exactement `refund`,
    - quand la personne répond exactement `o` à la demande interactive `o/n`,
    - alors le traitement concerné reprend, le score `human_refund_approval` de valeur `1` est enregistré sur sa trace Langfuse, puis le Worker reprend sa boucle.

15. **Remboursement refusé**
    - Étant donné une notification dont `type` vaut exactement `refund`,
    - quand la personne répond exactement `n`,
    - alors l'action est annulée sans poursuite du remboursement, le score `human_refund_approval` de valeur `0` est enregistré sur sa trace Langfuse et le Worker reprend sa boucle.

16. **Réponse invalide**
    - Étant donné une demande de confirmation pour un remboursement,
    - quand la réponse n'est ni exactement `o` ni exactement `n`,
    - alors l'action ne reprend pas, la question est redemandée pour le même traitement et aucun score final n'est créé à ce stade.

17. **Entrée fermée ou indisponible**
    - Étant donné une demande de confirmation pour un remboursement,
    - quand aucune réponse valide ne peut être obtenue parce que l'entrée est fermée, indisponible ou interrompue,
    - alors l'action est refusée sans attente indéfinie, le score `human_refund_approval` de valeur `0` est enregistré sur la trace concernée lorsque Langfuse est disponible et le Worker reprend sa boucle.

18. **Association du score au traitement**
    - Étant donné au moins deux notifications distinctes, dont un remboursement soumis à décision,
    - quand la décision est prise,
    - alors son score est associé uniquement à l'identifiant de trace Langfuse du traitement de cette notification ; pendant l'attente, la notification suivante reste dans Redis et aucune autre confirmation interactive n'est active.

19. **Saisie dans Docker**
    - Étant donné le Worker exécuté dans le service Docker Compose,
    - quand un remboursement demande une confirmation,
    - alors un opérateur peut répondre `o` ou `n` depuis un terminal interactif attaché au Worker et la réponse produit le comportement et le score attendus ; sans entrée interactive disponible, le remboursement est refusé.

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
- Vérifier que le Worker utilise Google Gemini au moyen de l'endpoint compatible avec le SDK OpenAI `https://generativelanguage.googleapis.com/v1beta/openai/`.
- Vérifier que chaque appel à Google Gemini depuis le Worker est effectué par un client instrumenté avec `observeOpenAI` et produit une observation Langfuse de succès lorsque Langfuse est disponible.
- Vérifier que le modèle utilisé provient de `GEMINI_MODEL` et qu'aucun nom de modèle Gemini précis n'est imposé en dur par les spécifications.
- Vérifier qu'une erreur du LLM est observée comme telle lorsque Langfuse est disponible, n'affecte pas la réponse HTTP et n'arrête pas définitivement le Worker.
- Vérifier le comportement de l'App Express et du Worker lorsque Redis est indisponible au démarrage, conformément au mécanisme de disponibilité retenu.
- Vérifier qu'une interruption temporaire de Redis après le démarrage n'arrête définitivement ni l'App Express ni le Worker et que l'utilisation de la file peut reprendre après rétablissement.
- Vérifier que, pendant une indisponibilité de Redis, une notification JSON valide reste enregistrée dans la console et reçoit rapidement `200 OK`, sans appel LLM dans la requête HTTP.
- Vérifier qu'une indisponibilité de Langfuse ne dégrade pas le contrat HTTP du webhook et n'entraîne aucun appel LLM depuis l'App Express.
- Vérifier que la configuration Docker Compose déclare les services App, Worker et Redis et met en œuvre l'une des deux solutions admises pour la disponibilité de Redis au démarrage.
- Vérifier, sans appel réel à Gemini, que seule une notification dont `type` vaut exactement `refund` déclenche le Pre-Hook et la demande `o/n` ; une notification d'un autre type ou sans `type` continue sans confirmation et sans score `human_refund_approval`. Vérifier que l'App Express accepte ces notifications sans valider `type` et que le texte libre de Gemini ne déclenche pas le Pre-Hook.
- Vérifier, avec une entrée interactive simulée, que `o` reprend le traitement du remboursement concerné et produit sur sa trace Langfuse le score `human_refund_approval` de valeur `1`.
- Vérifier que `n` annule le remboursement, produit sur la trace concernée le score `human_refund_approval` de valeur `0`, puis laisse le Worker reprendre sa boucle.
- Vérifier qu'une réponse invalide, y compris vide, ne reprend pas l'action, redemande `o/n` et ne produit pas de score final avant `o`, `n` ou fermeture de l'entrée.
- Vérifier qu'une entrée fermée, indisponible ou interrompue, immédiatement ou après une réponse invalide, refuse le remboursement sans attente indéfinie et produit le score `human_refund_approval` de valeur `0` lorsque Langfuse est disponible.
- Vérifier que, pendant l'attente `o/n`, une seule confirmation est active et les notifications suivantes restent dans Redis ; après la décision, le Worker reprend sa boucle et récupère la notification suivante.
- Vérifier avec au moins deux traitements et des traces Langfuse distinctes que le score de chacun des remboursements décidés est associé à sa propre trace, jamais à celle d'un autre traitement ni à une trace globale ; vérifier qu'une erreur Langfuse n'arrête pas le Worker.
- Vérifier en environnement Docker Compose qu'un terminal attaché au service Worker permet réellement de saisir `o` ou `n` et d'obtenir la décision attendue ; vérifier aussi qu'un Worker sans entrée interactive refuse le remboursement. Ces scénarios doivent utiliser une analyse Gemini simulée ou un résultat de traitement contrôlé, sans appel Gemini réel.

## Variables d'environnement nécessaires

- `REDIS_URL` : adresse de connexion à Redis, accessible à l'App Express et au Worker.
- `GEMINI_API_KEY` : clé d'authentification permettant au Worker d'appeler Google Gemini.
- `GEMINI_MODEL` : nom du modèle Gemini à utiliser par le Worker, sans qu'une valeur précise soit imposée par les présentes spécifications.
- `LANGFUSE_PUBLIC_KEY` : clé publique du projet Langfuse utilisée par le Worker.
- `LANGFUSE_SECRET_KEY` : clé secrète du projet Langfuse utilisée par le Worker.
- `LANGFUSE_BASE_URL` : adresse de l'instance ou de la région Langfuse ciblée, requise uniquement si la valeur par défaut du client ne convient pas.

Aucune valeur sensible ne doit être inscrite en dur dans les fichiers versionnés. Les variables `OPENAI_API_KEY` et `OPENAI_MODEL` ne doivent pas être utilisées pour configurer le fournisseur LLM. Aucun nom de modèle Gemini précis ne doit être imposé : il est fourni au moyen de `GEMINI_MODEL`.

## Contraintes techniques imposées

- L'API doit être développée avec Node.js et Express.
- Le point d'entrée retenu par hypothèse est `POST /payments/webhook`.
- Le projet doit contenir un `Dockerfile` minimaliste.
- Dans Docker, le processus Node.js devra s'exécuter avec un utilisateur non-root.
- Aucun champ métier obligatoire ne doit être défini tant que le format précis de la banque n'est pas fourni.
- Redis doit être utilisé comme file d'attente entre l'App Express et le Worker, sans imposer de bibliothèque de file particulière.
- Le Worker doit être un processus séparé de l'App Express.
- Le fournisseur LLM utilisé par le Worker doit être Google Gemini.
- Google Gemini doit être appelé au moyen de son endpoint compatible avec le SDK OpenAI `https://generativelanguage.googleapis.com/v1beta/openai/`.
- Le client compatible OpenAI utilisé pour appeler Google Gemini doit rester instrumenté avec `observeOpenAI` afin que les appels soient tracés dans Langfuse.
- L'appel au LLM doit être réalisé uniquement depuis le Worker.
- La configuration du fournisseur LLM doit utiliser `GEMINI_API_KEY` et `GEMINI_MODEL`, et non `OPENAI_API_KEY` ou `OPENAI_MODEL`.
- Les variables Langfuse existantes `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY` et `LANGFUSE_BASE_URL` restent inchangées.
- Aucun modèle Gemini précis ne doit être imposé dans les spécifications.
- Un fichier `docker-compose.yml` doit contenir les services correspondant aux rôles App, Worker et Redis. Les noms techniques exacts des services ne sont pas imposés.
- L'App et le Worker doivent pouvoir joindre le service Redis au sein de la pile Docker Compose et recevoir leur configuration par variables d'environnement.
- La disponibilité de Redis au démarrage doit être gérée au minimum par l'une des solutions suivantes :
  - un mécanisme de retry de connexion dans l'App Express et dans le Worker ;
  - ou un healthcheck du service Redis dans `docker-compose.yml`, associé pour l'App et le Worker à `depends_on` avec `condition: service_healthy`.
- Les erreurs temporaires de connexion à Redis ne doivent pas arrêter définitivement l'App Express ou le Worker.
- Le service Worker Docker doit permettre une saisie depuis un terminal interactif afin que la confirmation `o/n` soit utilisable lorsque ce terminal est attaché.
- Aucun des tests attendus ne doit nécessiter un appel réel à Gemini ; les réponses du LLM doivent pouvoir être simulées.

## Éléments hors périmètre

- L'attente synchrone d'un traitement métier lourd avant la réponse.
- La définition ou la validation d'un schéma métier bancaire.
- L'authentification de la banque, la vérification de signature ou tout autre mécanisme de sécurité non demandé.
- La persistance des notifications dans une base de données ou un fichier.
- La déduplication et la gestion de l'idempotence.
- La garantie de livraison, le rejeu des notifications non mises en file, une file de quarantaine et une stratégie de nouvelle tentative des analyses LLM.
- La définition d'un format de résultat de l'analyse IA, son stockage ou l'exécution automatique d'une décision métier à partir de ce résultat.
- Le choix d'un modèle Gemini précis.
- Le choix d'une bibliothèque ou d'une structure de données Redis particulière pour implémenter la file.
- La conservation locale et le rejeu des traces lorsque Langfuse est indisponible.
- La persistance de la décision humaine et une véritable mise à jour du statut d'une commande ou l'exécution d'un remboursement.
- Toute autre route ou fonctionnalité d'API.
