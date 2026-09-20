# Revue FinOps et Human-in-the-Loop

## Objectif

Cette revue vérifie le coût des appels LLM exécutés par le Worker et
l’enregistrement dans Langfuse des décisions humaines prises avant une
opération de remboursement.

Deux scénarios ont été exécutés avec de fausses données :

1. un remboursement autorisé avec la réponse `o` ;
2. un remboursement refusé avec la réponse `n`.

## Résultats

| Scénario | Décision HITL | Score | Appel Gemini | Coût Langfuse |
|---|---|---:|---:|---:|
| Remboursement autorisé | `o` | `1` | Oui | 0,0022335 USD |
| Remboursement refusé | `n` | `0` | Non | 0 USD |

## Remboursement autorisé

- Identifiant du test : `finops-hitl-approved`
- Trace Langfuse : `049ae5253f6af86d938e895028ca7b08`
- Score : `human_refund_approval = 1`
- Modèle : `gemini-3.6-flash`
- Tokens d’entrée : `38`
- Tokens de sortie : `588`
- Total enregistré par Langfuse : `1 623`
- Latence de l’appel Gemini : `10,98 secondes`
- Durée totale de la trace : `18,33 secondes`
- Coût d’entrée : `0,0000285 USD`
- Coût de sortie : `0,002205 USD`
- Coût total estimé : `0,0022335 USD`

Après la validation humaine, le Worker a poursuivi le traitement et a
effectué l’analyse avec Gemini. L’appel, son usage et son coût ont été
enregistrés dans Langfuse.

## Remboursement refusé

- Identifiant du test : `finops-hitl-refused`
- Trace Langfuse : `1bee407cac3859184a997ffab7c894a2`
- Score : `human_refund_approval = 0`
- Appel Gemini : aucun
- Coût LLM : `0 USD`

Lorsque l’opérateur a répondu `n`, le Worker a annulé la poursuite du
traitement. Aucun appel Gemini n’a été effectué, ce qui évite une consommation
inutile de tokens.

## Analyse FinOps

Le coût affiché par Langfuse pour l’appel autorisé est très faible à l’échelle
d’un test isolé. Il doit néanmoins être surveillé, car il augmenterait avec le
nombre de transactions et la longueur des réponses générées.

Le refus HITL ne génère aucun coût LLM. Le Pre-Hook joue donc deux rôles :

- empêcher une action sensible sans validation humaine ;
- éviter un appel Gemini inutile lorsque l’action est refusée.

Le coût indiqué correspond à l’estimation enregistrée par Langfuse. Le montant
réellement facturé par Google peut être nul lorsque l’appel appartient au quota
gratuit Gemini.

## Preuves exportées

Les exports JSON contiennent les observations LLM, les informations de coût,
les scores HITL et les identifiants de trace correspondants :

- `evidence/langfuse/langfuse-trace-refund-approved.json`
- `evidence/langfuse/langfuse-trace-refund-refused.json`

Aucune donnée bancaire réelle ni clé d’API n’est présente dans ces fichiers.

## Conclusion

L’observabilité permet de relier une décision humaine à son traitement LLM et
à son coût.

Le scénario autorisé produit un score positif et déclenche l’analyse Gemini.
Le scénario refusé produit un score négatif, bloque la poursuite du traitement
et ne génère aucun coût LLM.

La fonctionnalité répond donc aux objectifs de gouvernance FinOps,
d’auditabilité et de sécurité Human-in-the-Loop.


## task2 et task3 a refaire trop d'aide via ia pour finir a temps.