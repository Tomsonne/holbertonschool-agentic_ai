# Spécifications fonctionnelles

## 1. Objectif

Fournir un service qui surveille le fichier `tasks.json` et affiche régulièrement l'action de la première tâche en attente.

## 2. Source de données

Le service doit utiliser le fichier `tasks.json` comme source de données. Les tâches sont examinées dans l'ordre où elles apparaissent dans le tableau JSON.

## 3. Fonctionnement attendu

À chaque cycle, le service doit :

1. lire le contenu de `tasks.json` ;
2. parcourir les tâches dans leur ordre d'apparition ;
3. identifier la première tâche dont la valeur du champ `status` est exactement `pending` ;
4. afficher dans la sortie console la valeur du champ `action` de cette tâche ;
5. attendre 5 secondes avant de commencer le cycle suivant.

Le service doit répéter ces cycles en continu tant qu'il est en fonctionnement.

Si aucune tâche n'a le statut `pending` lors d'un cycle, aucune action ne doit être affichée pour ce cycle. Le service doit néanmoins poursuivre sa surveillance et effectuer le cycle suivant 5 secondes plus tard.

## 4. Exécution sous Docker

Le service doit pouvoir être démarré dans un conteneur Docker.

Une fois démarré, le service doit rester actif afin que les actions affichées soient consultables dans les logs du conteneur. Le fichier `tasks.json` doit être accessible au service dans le conteneur.

## 5. Critères d'acceptation

- Avec le fichier fourni et plusieurs tâches `pending`, la console affiche l'action de la première tâche `pending`, et non celles des suivantes.
- Une tâche dont le statut est `done` est ignorée.
- Un nouveau cycle de lecture est effectué toutes les 5 secondes.
- Lorsqu'aucune tâche n'est `pending`, aucune action n'est affichée et le service ne s'arrête pas.
- Le service peut être lancé sous Docker et ses sorties sont visibles dans les logs du conteneur.

## 6. Périmètre

Cette spécification décrit uniquement le comportement fonctionnel attendu. Elle ne fixe ni le langage, ni l'architecture du code, ni la forme des fichiers Docker à produire.
