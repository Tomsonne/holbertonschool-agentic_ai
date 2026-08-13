# Analyse comparative de React, Vue.js et Svelte

## Introduction

Ce projet constitue la troisième implémentation de la même interface Agentic AI. La première version a été développée avec React, la deuxième avec Vue.js et la troisième avec Svelte 5. Le but de cette nouvelle migration n'était pas de modifier le design, mais de comprendre comment Svelte exprime les mêmes concepts avec une syntaxe et un modèle de réactivité différents.

La version Svelte conserve les sections `Header`, `Hero`, `About`, `Features`, `Insights`, `Contact` et `Footer`. Elle conserve également les données, le service asynchrone des insights, la validation du formulaire, les liens de navigation, les classes Tailwind et le comportement responsive des versions précédentes.

## 1. Comparaison générale

Les trois projets reposent sur les mêmes principes fondamentaux. L'interface est découpée en composants, les données descendent du parent vers l'enfant grâce aux props, l'état contrôle le contenu affiché, les événements déclenchent des fonctions et le cycle de vie permet d'exécuter une opération au montage d'un composant.

| Concept | React | Vue.js | Svelte |
| --- | --- | --- | --- |
| Composant principal | `App.jsx` | `App.vue` | `App.svelte` |
| Template | JSX | `<template>` | Balisage du fichier `.svelte` |
| Props | Paramètres de fonction | `defineProps()` | `$props()` |
| État | `useState()` | `ref()` ou `reactive()` | `$state()` |
| Valeur dérivée | Calcul ou `useMemo()` | `computed()` | `$derived()` |
| Montage | `useEffect(..., [])` | `onMounted()` | `onMount()` |
| Liste | `.map()` | `v-for` | `{#each}` |
| Condition | `&&` ou ternaire | `v-if` | `{#if}` |
| Liaison de formulaire | `value` et `onChange` | `v-model` | `bind:value` |
| Icônes | `lucide-react` | `lucide-vue-next` | `@lucide/svelte` |

La différence principale concerne la manière d'écrire ces concepts. React place presque toute la logique d'affichage dans JavaScript et JSX. Vue sépare la logique dans `<script setup>` et utilise des directives dans `<template>`. Svelte place la logique dans `<script>` et propose des blocs de template comme `{#if}` et `{#each}`. Svelte compile les composants pendant le build, ce qui réduit la quantité de logique de framework nécessaire dans le navigateur.

## 2. Composants Svelte

Un composant Svelte est un fichier `.svelte`. Dans ce projet, `FeatureCard.svelte` contient un bloc `<script>` pour recevoir les props, puis le balisage de la carte directement sous ce bloc :

```svelte
<script>
    let { icon: Icon, title, description } = $props();
</script>

<article>
    <Icon aria-hidden="true" size={20} />
    <h3>{title}</h3>
    <p>{description}</p>
</article>
```

Le composant React équivalent est une fonction JavaScript qui retourne du JSX. Le composant Vue équivalent est un Single File Component avec `<script setup>` et `<template>`. Svelte ressemble donc à Vue par son format de fichier, mais il demande moins de balises structurelles car le template n'a pas besoin d'être entouré par `<template>`.

Dans les trois projets, `App` joue le même rôle : il importe et ordonne les composants de la page. Svelte permet plusieurs éléments à la racine, comme React avec un fragment et Vue avec son template.

## 3. Balises, attributs et templates

Le balisage Svelte est très proche du HTML. Contrairement à JSX, il utilise `class` et `for` sans renommage :

| HTML ou besoin | React JSX | Vue.js | Svelte |
| --- | --- | --- | --- |
| Classe CSS | `className="..."` | `class="..."` | `class="..."` |
| Association label | `htmlFor="email"` | `for="email"` | `for="email"` |
| Texte dynamique | `{title}` | `{{ title }}` | `{title}` |
| Attribut dynamique | `disabled={value}` | `:disabled="value"` | `disabled={value}` |
| Événement | `onSubmit={fn}` | `@submit="fn"` | `onsubmit={fn}` |
| Commentaire | `{/* texte */}` | `<!-- texte -->` | `<!-- texte -->` |

React utilise des accolades pour les expressions et impose quelques noms adaptés à JavaScript. Vue utilise des doubles accolades pour le texte et `:` pour lier un attribut. Svelte conserve les noms HTML et utilise une seule paire d'accolades. Cette syntaxe m'a paru plus proche du HTML tout en restant directe pour les valeurs JavaScript.

Dans `SectionTitle`, React écrit `{title}`, Vue écrit `{{ title }}` et Svelte écrit également `{title}`. La ressemblance entre React et Svelte ne signifie cependant pas que Svelte utilise JSX : son balisage est analysé par le compilateur Svelte.

## 4. Props et flux de données

Dans les trois versions, `Features` transmet l'icône, le titre et la description à chaque `FeatureCard`. Le flux reste descendant : le parent possède les données et l'enfant les affiche.

React déstructure les props dans le paramètre de la fonction :

```jsx
function FeatureCard({ icon: Icon, title, description }) {
```

Vue les déclare avec `defineProps()` :

```js
const props = defineProps({
    icon: Object,
    title: String,
    description: String,
});
```

Svelte 5 utilise la rune `$props()` :

```js
let { icon: Icon, title, description } = $props();
```

Le concept reste identique, mais la déclaration Svelte est courte et ressemble à une déstructuration JavaScript classique. Pour transmettre toutes les propriétés d'un objet, la section Svelte utilise `<FeatureCard {...feature} />`, comme React. Vue utilise plutôt plusieurs liaisons `:prop` ou `v-bind="feature"`.

Le composant `Button.svelte` reçoit aussi `children`, qui représente son contenu enfant sous forme de snippet Svelte 5. Il l'affiche avec `{@render children?.()}`. Cela correspond à `children` en React et au `<slot />` de Vue.

## 5. État et réactivité

La section `Contact` montre clairement les différences. React utilise plusieurs appels à `useState()` et doit appeler une fonction de mise à jour :

```jsx
const [isSending, setIsSending] = useState(false);
setIsSending(true);
```

Vue utilise un `ref` et modifie sa propriété `.value` dans le script :

```js
const isSending = ref(false);
isSending.value = true;
```

Svelte 5 utilise `$state()` et permet ensuite une affectation directe :

```js
let isSending = $state(false);
isSending = true;
```

Pour l'objet du formulaire, Svelte permet de modifier directement `formData.fullName`, `formData.email` et `formData.message`. React recrée généralement l'objet avec l'opérateur de décomposition afin de respecter l'immutabilité de l'état. Vue utilise souvent `reactive()` pour obtenir un comportement proche de Svelte.

Les validités du formulaire sont des valeurs dérivées. Dans Svelte :

```js
let fullNameIsValid = $derived(formData.fullName.trim().length >= 2);
let formIsValid = $derived(
    fullNameIsValid && emailIsValid && messageIsValid
);
```

Svelte recalcule automatiquement ces valeurs lorsque les champs concernés changent. Vue exprime ce besoin avec `computed()`. React recalcule souvent les expressions lors de chaque rendu ou utilise `useMemo()` lorsqu'une mémorisation est utile.

Cette comparaison m'a appris que la réactivité est un concept commun, mais que chaque framework expose un mécanisme différent. React demande des fonctions de mise à jour, Vue utilise des objets réactifs ou des références, et Svelte autorise une écriture plus proche de JavaScript grâce à son compilateur.

## 6. Rendu conditionnel

Dans `Insights`, le message d'erreur n'est affiché que si `error` contient une valeur.

React utilise une expression JavaScript :

```jsx
{error && <p role="alert">{error}</p>}
```

Vue utilise une directive :

```vue
<p v-if="error" role="alert">{{ error }}</p>
```

Svelte utilise un bloc :

```svelte
{#if error}
    <p role="alert">{error}</p>
{/if}
```

Svelte propose aussi `{:else if}` et `{:else}`. Les blocs rendent la condition visible dans le template. Ils sont plus spécifiques que le JavaScript libre de React, mais évitent d'ajouter une directive sur la balise comme en Vue.

Le bouton réutilisable contient un autre exemple : `{#if href}` affiche un lien, sinon `{:else}` affiche un bouton. Le comportement est identique au `if (href)` de React et au couple `v-if` et `v-else` de Vue.

## 7. Rendu dynamique des listes

La liste des insights montre les trois syntaxes principales.

React :

```jsx
{insights.map((insight, index) => (
    <InsightCard key={insight.title} {...insight} index={index} />
))}
```

Vue :

```vue
<InsightCard
    v-for="(insight, index) in insights"
    :key="insight.title"
    v-bind="insight"
    :index="index"
/>
```

Svelte :

```svelte
{#each insights as insight, index (insight.title)}
    <InsightCard {...insight} {index} />
{/each}
```

Les trois versions utilisent le titre comme clé stable. React place la clé dans une prop spéciale, Vue utilise `:key`, et Svelte place la clé entre parenthèses après la déclaration de la boucle. La même logique est utilisée pour les étapes de `About`, les fonctionnalités et les statistiques du `Hero`.

## 8. Cycle de vie et effets secondaires

La section `Insights` appelle `getInsights()` lors de son montage. React utilise `useEffect` avec un tableau de dépendances vide :

```jsx
useEffect(() => {
    loadInsights();
}, []);
```

Vue utilise `onMounted()` et Svelte utilise `onMount()` :

```js
onMount(async () => {
    insights = await getInsights();
});
```

Dans les trois cas, l'intention est identique : attendre que le composant soit monté avant de lancer un effet asynchrone. La différence concerne principalement l'API. `useEffect` peut aussi dépendre de plusieurs valeurs, alors que `onMounted` et `onMount` décrivent explicitement le montage. Svelte fournit `$effect` pour les effets réactifs liés à des dépendances lues dans leur fonction.

Une fonction retournée par `onMount` peut servir au nettoyage, comme la fonction retournée par `useEffect` en React. Vue utilise notamment `onUnmounted()` pour cette étape.

## 9. Formulaires et événements

Dans React, les champs du formulaire sont contrôlés avec `value` et `onChange` :

```jsx
<input
    value={formData.email}
    onChange={handleChange}
/>
```

Vue utilise `v-model` et Svelte utilise `bind:value` :

```svelte
<input
    bind:value={formData.email}
    oninput={handleInput}
>
```

`bind:value` établit une liaison dans les deux sens : une modification de la variable met à jour le champ et une saisie met à jour la variable. Cette écriture réduit la quantité de code par rapport au gestionnaire générique `handleChange` de React. Elle est conceptuellement proche de `v-model`.

Svelte 5 accepte les événements comme propriétés, par exemple `onsubmit={handleSubmit}` et `oninput={handleInput}`. Dans React, les noms sont en camelCase avec `onSubmit` et `onChange`. Vue utilise `@submit` et `@input`, avec des modificateurs comme `.prevent`.

Dans la version Svelte, `handleSubmit` appelle `event.preventDefault()`, vérifie `formIsValid`, affiche l'état d'envoi, attend 1,2 seconde, réinitialise les champs puis affiche le message de réussite. La validation et l'expérience utilisateur sont donc identiques aux versions React et Vue.

Les attributs d'accessibilité sont également conservés : `required`, `disabled`, `aria-invalid`, `aria-live`, `role="alert"`, ainsi que les associations entre `label` et champ grâce à `for` et `id`.

## 10. Classes Tailwind et comportement responsive

Tailwind CSS est indépendant du framework. La majorité des classes a donc été copiée sans modification. Seul React remplace `class` par `className`.

```jsx
<section className="bg-black px-6 py-24">
```

```vue
<section class="bg-black px-6 py-24">
```

```svelte
<section class="bg-black px-6 py-24">
```

Les préfixes `sm:`, `md:` et `lg:`, ainsi que `hover:`, `focus:` et `disabled:`, fonctionnent de la même façon. La fidélité visuelle dépend toutefois du maintien de la même structure HTML. Les sections conservent donc un fond pleine largeur et un conteneur interne `max-w-6xl` centré.

Dans `InsightCard.svelte`, la première carte reçoit des classes supplémentaires avec une expression :

```svelte
class={`... ${isFirstCard ? "sm:col-span-2 lg:col-span-2" : ""}`}
```

Cela correspond au template literal React et à la liaison `:class` de Vue.

## 11. HTML sémantique et accessibilité

Les trois frameworks produisent finalement du HTML. Ils n'imposent pas automatiquement une structure sémantique. La migration conserve donc les balises du projet original :

- `<header>` pour l'en-tête ;
- `<main>` pour le contenu principal ;
- `<section>` pour les grandes parties ;
- `<article>` pour les cartes ;
- `<nav>` pour les groupes de navigation ;
- `<footer>` pour le pied de page ;
- `<ol>` et `<ul>` pour les listes ;
- `<form>`, `<label>`, `<input>` et `<textarea>` pour le formulaire.

Les icônes décoratives utilisent `aria-hidden="true"`. Les liens vers les réseaux sociaux possèdent un `aria-label`. Les liens externes ouverts dans un nouvel onglet utilisent `rel="noopener noreferrer"`. Ces règles restent nécessaires quel que soit le framework.

## 12. Organisation du projet

La structure Svelte reprend volontairement celle des projets précédents :

```text
src/
├── components/
│   ├── cards/
│   ├── layout/
│   ├── sections/
│   └── ui/
├── data/
├── services/
├── App.svelte
├── global.css
└── main.js
```

Les fichiers `features.js`, `insights.js`, `steps.js` et `insightsService.js` restent séparés de l'interface. Leur logique est presque indépendante du framework. Seul `features.js` change ses imports d'icônes pour utiliser `@lucide/svelte`.

| React | Vue.js | Svelte | Rôle |
| --- | --- | --- | --- |
| `main.jsx` | `main.js` | `main.js` | Point d'entrée |
| `App.jsx` | `App.vue` | `App.svelte` | Composition de la page |
| `.jsx` | `.vue` | `.svelte` | Composants |
| `createRoot()` | `createApp().mount()` | `mount()` | Montage de l'application |

Cette organisation commune a facilité la migration. Chaque composant React avait une responsabilité claire et pouvait être converti séparément sans modifier les autres sections.

## 13. Démarrage, build et déploiement

Le point d'entrée Svelte importe `mount` puis monte `App` dans l'élément `#app` :

```js
import { mount } from "svelte";
import App from "./App.svelte";

mount(App, {
    target: document.getElementById("app"),
});
```

Vite fournit les mêmes commandes principales dans les trois projets : `npm run dev`, `npm run lint`, `npm run build` et `npm run preview`. La configuration Svelte utilise `@sveltejs/vite-plugin-svelte`, Tailwind utilise `@tailwindcss/vite`, et `base: "./"` permet aux ressources construites de fonctionner sur GitHub Pages.

## 14. Migration assistée par l'IA

ChatGPT a été utilisé pour analyser les fichiers React et Vue, construire les équivalences Svelte, adapter les dépendances et produire une première version complète. Le projet React a servi de référence principale pour le contenu, les classes Tailwind, la validation et les interactions. Le projet Vue a aidé à identifier les parties déjà exprimées avec un template, notamment les listes, les conditions et les formulaires liés.

L'IA a été efficace pour les conversions répétitives :

- remplacer les fichiers `.jsx` par des fichiers `.svelte` ;
- remplacer les props React par `$props()` ;
- convertir `useState` en `$state()` ;
- convertir les valeurs calculées en `$derived()` ;
- convertir `.map()` et `v-for` en `{#each}` ;
- convertir les conditions en `{#if}` ;
- remplacer `useEffect` et `onMounted` par `onMount` ;
- convertir les champs contrôlés et `v-model` en `bind:value` ;
- adapter `lucide-react` et `lucide-vue-next` vers `@lucide/svelte` ;
- conserver les classes Tailwind et le responsive.

Une révision manuelle restait indispensable. Il fallait vérifier les textes, les URL, l'ordre des sections, les classes longues de dégradés, les attributs ARIA, le comportement du formulaire et les différences entre anciennes et nouvelles syntaxes de Svelte. Les icônes Bootstrap présentes dans le footer React ne pouvaient pas être conservées car le projet Svelte doit utiliser Lucide sans autre framework CSS. Elles ont donc été remplacées par des composants Lucide proches.

La qualité de la structure React a directement influencé la qualité de la migration. Comme les cartes, les sections, les données et le service étaient séparés, il était possible de comparer chaque responsabilité et de valider chaque équivalent. Un projet monolithique aurait rendu la conversion plus risquée.

## 15. Perspective professionnelle

Ce projet montre qu'apprendre un nouveau framework ne signifie pas recommencer l'apprentissage du frontend depuis zéro. Les concepts de composant, prop, état, rendu conditionnel, boucle, événement, formulaire et cycle de vie restent présents. Il faut surtout apprendre comment le nouveau framework les exprime.

L'architecture des composants est donc plus importante que la mémorisation de la syntaxe. Une personne qui comprend pourquoi `Insights` possède un état, pourquoi il charge les données au montage et pourquoi chaque carte possède une clé peut retrouver la solution dans React, Vue ou Svelte.

L'IA réduit la barrière entre les écosystèmes en proposant rapidement des correspondances. Elle ne garantit cependant ni la fidélité visuelle ni la correction technique. Le développeur doit lire le code, comprendre les runes Svelte, lancer ESLint, produire le build, tester les liens, remplir le formulaire et comparer le résultat avec les versions précédentes.

## Conclusion

Svelte permet de construire la même application avec moins de code cérémoniel pour l'état et les formulaires. `$state()` autorise des affectations directes, `$derived()` exprime clairement les valeurs calculées, `bind:value` simplifie les champs et les blocs `{#if}` et `{#each}` rendent la logique visible dans le template.

React reste plus centré sur JavaScript et JSX. Vue fournit un template riche en directives et une Composition API explicite. Svelte combine un balisage proche du HTML avec une réactivité transformée à la compilation. Malgré ces différences, les trois versions conservent la même architecture et répondent aux mêmes besoins fonctionnels.

## Lexique

**Attribut** : information placée dans une balise HTML, par exemple `class`, `href`, `disabled` ou `aria-label`.

**Build** : transformation du code source en fichiers optimisés pour la production. Vite crée le dossier `dist` avec `npm run build`.

**Compilation** : transformation du code Svelte en JavaScript et CSS exécutables par le navigateur. Svelte effectue une partie importante de son travail lors de cette étape.

**Composant** : partie autonome et réutilisable de l'interface, comme `Header`, `FeatureCard` ou `Contact`.

**DOM (Document Object Model)** : représentation de la page HTML sous forme d'un arbre d'objets. Le navigateur et JavaScript utilisent cet arbre pour afficher et modifier la page.

**État réactif** : donnée dont la modification entraîne la mise à jour de l'interface. Svelte 5 crée cet état avec `$state()`.

**Effet secondaire** : opération qui agit en dehors du calcul direct du template, par exemple charger des données, utiliser un minuteur ou ajouter un écouteur d'événement.

**Événement** : action détectée dans l'interface, comme un clic, une saisie ou l'envoi d'un formulaire.

**Framework frontend** : ensemble d'outils et de conventions pour construire une interface web organisée et interactive.

**Hydratation** : opération qui rend interactif dans le navigateur un HTML initialement produit ailleurs. Ce projet Vite est rendu côté client, mais le concept est courant dans les frameworks modernes.

**JSX** : syntaxe utilisée par React pour écrire une structure proche du HTML dans JavaScript.

**Prop** : donnée transmise par un composant parent à un composant enfant. Svelte 5 reçoit les props avec `$props()`.

**Réactivité** : mécanisme qui relie les données à l'interface afin que l'affichage reste synchronisé lorsque les données changent.

**Rendu** : création ou mise à jour de l'interface à partir des composants et des données.

**Rune Svelte** : fonction spéciale de Svelte 5 commençant par `$`, comme `$props()`, `$state()` ou `$derived()`, utilisée pour déclarer un comportement réactif.

**SFC (Single File Component)** : fichier de composant Vue regroupant template, logique et éventuellement styles. Un fichier `.svelte` suit une idée proche, sans bloc `<template>` obligatoire.

**Snippet Svelte** : contenu réutilisable pouvant être transmis à un composant. Le contenu enfant d'un composant Svelte 5 peut être reçu avec la prop `children` puis affiché avec `{@render}`.

**Template** : partie d'un composant qui décrit le balisage affiché. Svelte utilise directement le balisage du fichier `.svelte`.

**Vite** : outil fournissant le serveur de développement et le build de production pour les trois versions du projet.
