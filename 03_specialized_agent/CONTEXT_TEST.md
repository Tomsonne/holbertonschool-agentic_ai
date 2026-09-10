# Crash test du contexte

## Réponse avant la purge

« La règle exacte est :
should_[EXPECTED_BEHAVIOR]_when_[CONDITION]

Chaque nom de test doit être en anglais et respecter cette structure. »

Exemple fourni : should_return_zero_when_cart_is_empty.

## Réponse après la réinitialisation

« Selon les guidelines, chaque test doit être nommé en anglais
avec la forme exacte :
should_[EXPECTED_BEHAVIOR]_when_[CONDITION] »

L’agent précise que cette convention est obligatoire pour chaque
bloc it() ou test().

## Constat

Les deux réponses restituent correctement la règle de nommage.
Aucun oubli, approximation ou hallucination n’a été observé après
les échanges hors sujet. La réinitialisation n’a donc pas apporté
d’amélioration observable sur cette question.

Les modèles affichés sont différents : GPT-5.6 Luna avant la purge
et MAI-Code-1.1-Flash après. Les guidelines ont également été relues
lors de la réinitialisation. Cette comparaison ne permet donc pas
d’isoler l’effet de la purge du contexte.