# Comparaison des implémentations React et Vue.js

## Introduction

Ce projet consiste à recréer avec Vue.js une application initialement développée avec React. L'objectif n'est pas seulement d'obtenir le même rendu visuel. Il s'agit également de comprendre comment les deux frameworks organisent une interface, transmettent des données, gèrent un état réactif, répondent aux actions de l'utilisateur et mettent à jour le DOM.

Les deux versions utilisent JavaScript, Vite, Tailwind CSS et les icônes Lucide. Elles présentent les mêmes sections principales : `Header`, `Hero`, `About`, `Features`, `Insights`, `Contact` et `Footer`. Les données de `features.js`, `insights.js` et `step.js` ainsi que le service `insightsService.js` ont aussi été conservés. La différence principale ne concerne donc pas le rôle de l'application, mais la manière dont React et Vue expriment les mêmes fonctionnalités.

## 1. Création et composition des composants

### Composants React

Dans la version React, un composant est généralement une fonction JavaScript qui retourne du JSX. Le fichier porte l'extension `.jsx`.

```jsx
function SectionBadge({ text, className = "" }) {
    return (
        <span className={className}>
            {text}
        </span>
    );
}

export default SectionBadge;
```

Les props sont reçues dans les paramètres de la fonction. La fonction retourne ensuite la structure à afficher.

### Composants Vue

Dans la version Vue, les composants sont des Single File Components, ou SFC, portant l'extension `.vue`. Un même fichier contient généralement un bloc `<script setup>` pour la logique et un bloc `<template>` pour le balisage.

```vue
<script setup>
defineProps({
    text: {
        type: String,
        required: true,
    },
});
</script>

<template>
  <span>{{ text }}</span>
</template>
```

`<script setup>` est une syntaxe simplifiée de la Composition API. Les imports, variables et fonctions déclarés dans ce bloc sont directement utilisables dans le template.

### Composition de l'application

`App.jsx` et `App.vue` ont la même responsabilité : importer les composants principaux et définir leur ordre d'affichage.

En React :

```jsx
function App() {
    return (
        <>
            <Header />
            <main>
                <Hero />
                <About />
                <Features />
                <Insights />
                <Contact />
                <Footer />
            </main>
        </>
    );
}
```

En Vue :

```vue
<template>
  <Header />
  <main>
    <Hero />
    <About />
    <Features />
    <Insights />
    <Contact />
  </main>
  <Footer />
</template>
```

Les deux frameworks permettent de créer des composants réutilisables. React les représente par des fonctions JavaScript, tandis que Vue rassemble la logique et le template dans un SFC. Vue autorise aussi plusieurs éléments racines dans un template. React utilise souvent un fragment `<>...</>` lorsqu'il ne veut pas ajouter de balise HTML supplémentaire.

## 2. Balises, attributs et syntaxe des templates

React utilise JSX, une extension de JavaScript qui ressemble à du HTML. Vue utilise un template plus proche du HTML classique, complété par des directives.

| Besoin | React avec JSX | Vue avec un template |
| --- | --- | --- |
| Classe CSS statique | `className="px-6"` | `class="px-6"` |
| Classe CSS dynamique | `className={classes}` | `:class="classes"` |
| Association d'un label | `htmlFor="email"` | `for="email"` |
| Texte dynamique | `{title}` | `{{ title }}` |
| Attribut dynamique | `src={image}` | `:src="image"` |
| Valeur booléenne dynamique | `disabled={isSending}` | `:disabled="isSending"` |
| Événement de clic | `onClick={handler}` | `@click="handler"` |
| Soumission d'un formulaire | `onSubmit={handleSubmit}` | `@submit.prevent="handleSubmit"` |
| Condition | `{error && <p>{error}</p>}` | `<p v-if="error">{{ error }}</p>` |
| Boucle | `{items.map(...)}` | `v-for="item in items"` |
| Liaison d'un champ | `value` et `onChange` | `v-model` |
| Contenu enfant | `children` | `<slot />` |
| Composant dynamique | `<Icon />` | `<component :is="icon" />` |

### Différences sur les balises HTML

Les balises sémantiques restent les mêmes dans les deux projets : `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<nav>`, `<form>`, `<label>`, `<input>`, `<button>`, `<ul>` et `<li>`. Le navigateur reçoit finalement du HTML dans les deux cas.

La différence se trouve principalement dans les attributs. JSX utilise les noms JavaScript `className` et `htmlFor`, car `class` et `for` ont une signification particulière en JavaScript. Vue étant plus proche du HTML, il utilise directement `class` et `for`.

En React, les composants et certaines balises peuvent être autofermés :

```jsx
<input type="email" />
<SectionTitle title="Explore Agentic AI" />
```

Dans un template Vue, un composant peut aussi être autofermé. Pour les éléments HTML natifs, le projet suit les règles de formatage Vue :

```vue
<input type="email">
<SectionTitle title="Explore Agentic AI" />
```

Dans les deux cas, les composants personnalisés commencent par une majuscule dans ce projet. Cela permet de les distinguer immédiatement des balises HTML natives.

### Expressions dynamiques

React place toute expression JavaScript dynamique entre accolades :

```jsx
<img src={image} alt={title} />
<p>{description}</p>
```

Vue sépare le texte et les attributs. Le texte utilise l'interpolation `{{ }}`. Un attribut dynamique utilise `v-bind`, généralement abrégé avec `:` :

```vue
<img :src="image" :alt="title">
<p>{{ description }}</p>
```

JSX donne un accès direct à JavaScript dans le balisage, ce qui est pratique pour les expressions complexes. Le template Vue est souvent plus lisible pour une personne habituée au HTML, mais il faut apprendre les directives telles que `v-if`, `v-for`, `v-bind`, `v-on` et `v-model`.

## 3. Props et circulation des données

Dans les deux frameworks, les props servent à transmettre des données d'un composant parent vers un composant enfant. Cette circulation est unidirectionnelle : l'enfant reçoit la valeur, mais ne doit pas modifier directement l'état appartenant au parent.

Dans `Features.jsx`, React transmet les données avec des expressions JSX :

```jsx
<FeatureCard
    icon={feature.icon}
    title={feature.title}
    description={feature.description}
/>
```

`FeatureCard.jsx` les reçoit avec la déstructuration :

```jsx
function FeatureCard({ icon: Icon, title, description }) {
```

Dans `Features.vue`, les props dynamiques utilisent `:` :

```vue
<FeatureCard
  :icon="feature.icon"
  :title="feature.title"
  :description="feature.description"
/>
```

Le composant enfant déclare ses props avec `defineProps` :

```js
defineProps({
    icon: Object,
    title: String,
    description: String,
});
```

Une prop statique n'a pas besoin de `:` en Vue. Par exemple, `title="Features"` transmet directement une chaîne. En revanche, `:index="index"` évalue une variable JavaScript.

React traite les props comme les arguments d'une fonction. Vue ajoute une déclaration explicite qui peut préciser le type, le caractère obligatoire et une valeur par défaut. Dans les deux cas, une modification doit remonter vers le parent par une fonction callback en React ou par un événement émis avec `defineEmits` en Vue.

## 4. Contenu enfant : `children` et slots

Le composant `Button` doit pouvoir recevoir du texte et une icône entre ses balises.

En React, ce contenu est disponible dans la prop spéciale `children` :

```jsx
<Button>
    Enroll at Holberton School
    <ArrowRight size={18} />
</Button>
```

Dans le composant enfant :

```jsx
function Button({ children, ...props }) {
    return <a {...props}>{children}</a>;
}
```

En Vue, le parent écrit presque la même structure, mais le composant enfant affiche le contenu avec un slot :

```vue
<Button>
  Enroll at Holberton School
  <ArrowRight :size="18" />
</Button>
```

Dans `Button.vue` :

```vue
<template>
  <a>
    <slot />
  </a>
</template>
```

`children` et `<slot />` remplissent donc le même objectif. Vue propose également des slots nommés pour gérer plusieurs zones de contenu.

## 5. État local et réactivité

### `useState` dans React

React gère l'état local avec le hook `useState`. Dans `Insights.jsx`, deux états séparés sont utilisés :

```jsx
const [insights, setInsights] = useState([]);
const [error, setError] = useState("");
```

La valeur est lue avec `insights` ou `error`. Elle doit être modifiée avec son setter :

```jsx
setInsights(data);
setError("Unable to load insights.");
```

L'appel du setter demande à React de recalculer le composant et son JSX.

### `ref` et `reactive` dans Vue

Vue utilise `ref` pour les valeurs simples, les tableaux ou les références qui doivent être remplacées :

```js
const insights = ref([]);
const error = ref("");
```

Dans le bloc JavaScript, la valeur d'un `ref` se lit et se modifie avec `.value` :

```js
insights.value = await getInsights();
error.value = "Unable to load insights.";
```

Dans le template, Vue enlève automatiquement cette enveloppe. Il suffit donc d'écrire `insights` ou `error`, sans `.value`.

Pour le formulaire de `Contact.vue`, `reactive` est adapté à un objet contenant plusieurs propriétés :

```js
const formData = reactive({
    fullName: "",
    email: "",
    message: "",
});
```

Les propriétés peuvent être modifiées directement :

```js
formData.fullName = "";
```

La version React doit créer un nouvel objet pour ne pas modifier directement l'état :

```jsx
setFormData({
    ...formData,
    [name]: value,
});
```

React relance la fonction du composant après une mise à jour d'état. Vue suit les dépendances réactives utilisées par le template et met à jour les parties concernées. Les deux approches produisent une interface réactive, mais leur mécanisme et leur syntaxe diffèrent.

## 6. Valeurs calculées

Dans `Contact.jsx`, les règles de validation sont recalculées pendant chaque rendu :

```jsx
const fullNameIsValid = formData.fullName.trim().length >= 2;
const messageIsValid = formData.message.trim().length >= 10;
const formIsValid = fullNameIsValid && emailIsValid && messageIsValid;
```

Dans Vue, ces valeurs dépendantes sont déclarées avec `computed` :

```js
const fullNameIsValid = computed(() => formData.fullName.trim().length >= 2);
const formIsValid = computed(() => (
    fullNameIsValid.value && emailIsValid.value && messageIsValid.value
));
```

Une propriété calculée Vue est mise en cache et n'est recalculée que lorsqu'une de ses dépendances réactives change. React peut obtenir un comportement de mémorisation comparable avec `useMemo`, même si cela n'est pas nécessaire pour des validations aussi simples.

## 7. Cycle de vie et chargement asynchrone

La section `Insights` charge ses données avec `getInsights()` lors de son premier affichage.

React utilise `useEffect` avec un tableau de dépendances vide :

```jsx
useEffect(() => {
    const loadInsights = async () => {
        const data = await getInsights();
        setInsights(data);
    };

    loadInsights();
}, []);
```

Le tableau `[]` indique que l'effet doit être lancé après le premier montage du composant. Si des dépendances sont ajoutées au tableau, l'effet est également relancé lorsqu'elles changent.

Vue utilise le hook de cycle de vie `onMounted` :

```js
onMounted(async () => {
    try {
        insights.value = await getInsights();
    } catch {
        error.value = "Unable to load insights.";
    }
});
```

`onMounted` décrit directement le moment où le composant est monté. Pour réagir aux changements d'une valeur après le montage, Vue propose `watch` et `watchEffect`. Pour effectuer un nettoyage, React retourne une fonction depuis `useEffect`, alors que Vue peut utiliser `onUnmounted`.

## 8. Rendu conditionnel

Dans React, le rendu conditionnel s'appuie sur JavaScript. La section `Insights` utilise l'opérateur `&&` :

```jsx
{error && (
    <p role="alert">
        {error}
    </p>
)}
```

Vue utilise la directive `v-if` :

```vue
<p v-if="error" role="alert">
  {{ error }}
</p>
```

Pour choisir entre deux contenus, React utilise souvent un opérateur ternaire :

```jsx
{isSending ? "Sending..." : "Send message"}
```

Vue peut également utiliser un ternaire dans une interpolation :

```vue
{{ isSending ? "Sending..." : "Send message" }}
```

Vue fournit aussi `v-else-if`, `v-else` et `v-show`. `v-if` ajoute ou retire l'élément du DOM. `v-show` le conserve dans le DOM et modifie son affichage CSS. React ne possède pas de directive équivalente : le développeur utilise une condition JavaScript ou une classe CSS.

## 9. Rendu dynamique des listes

React utilise la méthode JavaScript `map()` pour générer une liste de composants. Dans `Insights.jsx` :

```jsx
{insights.map((insight, index) => (
    <InsightCard
        key={insight.title}
        title={insight.title}
        index={index}
    />
))}
```

Vue utilise la directive `v-for` :

```vue
<InsightCard
  v-for="(insight, index) in insights"
  :key="insight.title"
  :title="insight.title"
  :index="index"
/>
```

Les deux versions utilisent une clé stable avec le titre de l'insight. Cette clé aide le framework à reconnaître chaque élément lors d'une mise à jour. En React, `key` est un attribut spécial utilisé par React et n'est pas transmis comme une prop classique. Dans Vue, `:key` joue le même rôle pour l'algorithme de rendu.

Le projet applique le même principe aux cartes de fonctionnalités dans `Features` et aux étapes numérotées dans `About`.

## 10. Composants et icônes dynamiques

Dans `FeatureCard.jsx`, l'icône reçue en prop est renommée avec une majuscule pour que React la reconnaisse comme un composant :

```jsx
function FeatureCard({ icon: Icon, title, description }) {
    return <Icon aria-hidden="true" />;
}
```

Vue utilise la balise spéciale `<component>` avec l'attribut dynamique `:is` :

```vue
<component
  :is="icon"
  aria-hidden="true"
/>
```

Les dépendances sont aussi différentes. React importe les icônes depuis `lucide-react`, tandis que Vue les importe depuis `lucide-vue-next`. L'apparence finale reste la même, mais les objets importés sont des composants adaptés à chaque framework.

## 11. Gestion des formulaires

### Champs contrôlés en React

Dans `Contact.jsx`, chaque champ est contrôlé par l'état React :

```jsx
<input
    name="email"
    value={formData.email}
    onChange={handleChange}
    disabled={isSending}
/>
```

`handleChange` récupère `event.target.name` et `event.target.value`, puis met à jour la bonne propriété de l'objet.

### `v-model` dans Vue

Vue simplifie la liaison dans `Contact.vue` :

```vue
<input
  v-model="formData.email"
  name="email"
  :disabled="isSending"
  @input="resetFeedback"
>
```

`v-model` combine la lecture de la valeur et sa mise à jour lors de la saisie. Il joue donc ici un rôle proche de l'association `value` et `onChange` de React.

La validation fonctionnelle reste la même dans les deux projets :

- le nom complet doit contenir au moins deux caractères ;
- l'adresse électronique doit contenir `@` et `.` ;
- le message doit contenir au moins dix caractères ;
- le bouton reste désactivé si le formulaire est invalide ou si l'envoi est en cours ;
- un message informe l'utilisateur de l'état du formulaire.

Les attributs HTML d'accessibilité sont conservés : `required`, `aria-invalid`, `aria-live`, `role="alert"`, `label` et l'association `for` ou `htmlFor` avec l'identifiant du champ.

## 12. Gestion des événements

React écrit les événements en camelCase et transmet une fonction :

```jsx
<form onSubmit={handleSubmit}>
<input onChange={handleChange} />
```

Dans `handleSubmit`, React doit empêcher explicitement le rechargement de la page :

```js
const handleSubmit = async (event) => {
    event.preventDefault();
};
```

Vue utilise `v-on`, abrégé avec `@` :

```vue
<form @submit.prevent="handleSubmit">
<input @input="resetFeedback">
```

Le modificateur `.prevent` appelle automatiquement `preventDefault()`. Vue propose aussi `.stop`, `.once`, `.self` et des modificateurs de clavier. React réalise ces comportements dans la fonction JavaScript.

Dans les deux cas, les événements proviennent du navigateur. La différence concerne surtout la syntaxe utilisée pour relier un événement au gestionnaire.

## 13. Styles Tailwind CSS et classes dynamiques

La migration a pu conserver presque toutes les classes Tailwind, car Tailwind fonctionne indépendamment de React et de Vue.

En React :

```jsx
<section className="bg-slate-950 px-6 py-24">
```

En Vue :

```vue
<section class="bg-slate-950 px-6 py-24">
```

Pour une classe calculée, React place la fonction dans `className` :

```jsx
className={getFieldClasses(emailIsValid)}
```

Vue lie l'attribut `class` avec `:` :

```vue
:class="getFieldClasses(emailIsValid)"
```

Les préfixes responsives `md:` et `lg:`, les états `hover:`, `focus:` et `disabled:`, ainsi que les couleurs et espacements ont le même effet dans les deux versions.

La fidélité visuelle dépend cependant de la structure des balises. Pour obtenir un fond sur toute la largeur et conserver un contenu limité, les sections Vue utilisent une section externe avec le fond et une `div` interne avec `max-w-6xl` :

```vue
<section class="bg-slate-950">
  <div class="mx-auto max-w-6xl px-6 py-24">
    <!-- contenu -->
  </div>
</section>
```

Cette structure a notamment été appliquée à `About`, `Features` et `Insights` pour reproduire la nouvelle mise en page.

## 14. HTML sémantique et accessibilité

React et Vue n'imposent pas automatiquement un HTML accessible. Le développeur doit choisir les bonnes balises dans les deux frameworks.

Le projet utilise :

- `<header>` pour l'en-tête ;
- `<main>` pour le contenu principal ;
- `<section>` pour chaque grande partie de la page ;
- `<article>` pour les cartes autonomes ;
- `<nav>` pour la navigation ;
- `<footer>` pour le pied de page ;
- `<form>`, `<label>`, `<input>` et `<button>` pour le formulaire ;
- des listes `<ul>`, `<ol>` et `<li>` lorsque les éléments forment réellement une liste.

Les attributs ARIA sont presque identiques. En JSX, ils conservent leur écriture avec des tirets, par exemple `aria-hidden` et `aria-live`. Dans Vue, ils sont utilisés comme en HTML. Lorsqu'une valeur ARIA est dynamique en Vue, elle est liée avec `:`.

Les icônes uniquement décoratives utilisent `aria-hidden="true"`. Les messages d'erreur utilisent `role="alert"` et la zone de retour du formulaire utilise `aria-live="polite"`. Ces choix sont nécessaires dans les deux frameworks et ne dépendent pas de leur système de réactivité.

## 15. Organisation des projets

Les deux applications suivent une organisation proche :

```text
src/
├── components/
│   ├── cards/
│   ├── layout/
│   └── ui/
├── data/
├── sections/
├── services/
├── global.css
└── App
```

Dans React, les sections sont placées dans `src/components/sections/`, tandis que la conversion Vue les place dans `src/sections/`. Cette différence n'est pas imposée par les frameworks. Il s'agit d'un choix d'organisation.

Les principales différences de fichiers sont les suivantes :

| React | Vue | Rôle |
| --- | --- | --- |
| `main.jsx` | `main.js` | Point d'entrée |
| `App.jsx` | `App.vue` | Composition principale |
| `Component.jsx` | `Component.vue` | Composant d'interface |
| `lucide-react` | `lucide-vue-next` | Icônes |
| Plugin ESLint React | Plugin ESLint Vue | Analyse du code |

Les données et services en JavaScript peuvent rester presque identiques, car ils ne contiennent pas de rendu propre à un framework.

## 16. Démarrage de l'application

React crée une racine puis rend le composant `App` :

```jsx
createRoot(document.getElementById("root")).render(<App />);
```

Le fichier `index.html` contient donc généralement :

```html
<div id="root"></div>
```

Vue crée une instance d'application puis la monte :

```js
createApp(App).mount("#app");
```

Le fichier `index.html` contient :

```html
<div id="app"></div>
```

Les deux projets utilisent ensuite Vite pour lancer le serveur de développement et produire le build de production. Les commandes `npm run dev`, `npm run lint` et `npm run build` remplissent des rôles comparables.

## 17. Principales similitudes entre React et Vue

React et Vue partagent les principes suivants :

- l'interface est découpée en composants réutilisables ;
- un composant parent transmet des données à un enfant avec des props ;
- l'état est réactif et une modification entraîne une mise à jour de l'interface ;
- les listes ont besoin d'une clé stable ;
- le rendu peut dépendre d'une condition ;
- les événements relient les actions de l'utilisateur à des fonctions JavaScript ;
- le cycle de vie permet de lancer du code lors du montage ou du démontage ;
- les données, services et styles peuvent être séparés de l'affichage ;
- Vite peut servir et construire les deux applications.

Ces similitudes expliquent pourquoi les connaissances acquises avec React restent utiles lors de l'apprentissage de Vue.

## 18. Principales différences entre React et Vue

| Sujet | React | Vue |
| --- | --- | --- |
| Type de composant | Fonction JavaScript retournant du JSX | Single File Component |
| Affichage | JSX | Bloc `<template>` |
| Logique | Dans la fonction du composant | Bloc `<script setup>` |
| Classe CSS | `className` | `class` |
| Texte dynamique | `{value}` | `{{ value }}` |
| Attribut dynamique | `{value}` | `:attribute="value"` |
| Props | Paramètres de fonction | `defineProps` |
| État simple | `useState` | `ref` |
| Objet réactif | `useState` avec mise à jour immuable | `reactive` |
| Valeur dérivée | Calcul au rendu ou `useMemo` | `computed` |
| Montage | `useEffect(..., [])` | `onMounted` |
| Surveillance | Dépendances de `useEffect` | `watch` ou `watchEffect` |
| Condition | JavaScript, `&&`, ternaire | `v-if`, `v-else`, `v-show` |
| Liste | `map()` | `v-for` |
| Formulaire | `value` et `onChange` | `v-model` |
| Événement | `onClick`, `onSubmit` | `@click`, `@submit` |
| Prévention d'un événement | `event.preventDefault()` | Modificateur `.prevent` |
| Contenu enfant | `children` | `<slot />` |
| Composant dynamique | Variable avec majuscule | `<component :is="...">` |

React place JavaScript au centre de l'écriture de l'interface. Vue propose davantage de syntaxe spécifique dans le template afin de rendre les intentions visibles directement dans le balisage.

## 19. Migration assistée par l'IA

L'IA a été utilisée pour analyser le projet React, proposer les équivalents Vue et accélérer la conversion des composants. Elle a été particulièrement utile pour :

- convertir les fichiers `.jsx` en SFC `.vue` ;
- remplacer `className` par `class` et `htmlFor` par `for` ;
- convertir `map()` en `v-for` ;
- convertir les conditions JSX en `v-if` ;
- remplacer `useState` par `ref` ou `reactive` ;
- remplacer `useEffect` par `onMounted` ;
- convertir les champs contrôlés en champs utilisant `v-model` ;
- adapter les imports `lucide-react` vers `lucide-vue-next` ;
- conserver les classes Tailwind et la structure responsive.

La première conversion n'était pas parfaite. Une comparaison manuelle avec le projet React actuel a été nécessaire. Certaines versions générées se basaient sur un ancien état du projet. Les fonds des sections, la structure des conteneurs, le header translucide, les décors du `Hero` et de `Contact`, les couleurs des cartes, le formulaire et plusieurs attributs d'accessibilité ont dû être revérifiés.

Les fichiers de configuration ont également demandé une attention particulière. Une interface peut être correcte localement mais échouer au build ou au déploiement si les dépendances, les scripts NPM ou la configuration Vite ne correspondent pas au projet Vue.

La validation finale ne s'est donc pas limitée à lire le code généré. Elle a consisté à :

1. comparer chaque composant Vue avec sa source React ;
2. vérifier les textes, les props, les icônes et les données ;
3. comparer le comportement du formulaire et du chargement asynchrone ;
4. vérifier l'affichage responsive et les arrière-plans ;
5. exécuter ESLint ;
6. produire un build de production.

Cette migration montre que l'IA peut accélérer un travail répétitif et expliquer les correspondances entre frameworks. Elle ne remplace cependant ni la compréhension du développeur ni les tests. Le développeur doit savoir pourquoi `ref` utilise `.value` dans le script, pourquoi `v-model` remplace la combinaison `value` et `onChange`, pourquoi `onMounted` correspond au premier chargement et pourquoi `:key` reste indispensable dans une boucle.

## Conclusion

React et Vue répondent aux mêmes besoins fondamentaux : construire une interface à partir de composants, transmettre des données, gérer un état, rendre des listes, afficher des éléments conditionnels et traiter les événements de l'utilisateur.

React exprime principalement ces mécanismes avec JavaScript, JSX et les hooks. Vue les exprime avec des Single File Components, la Composition API, des templates et des directives. React rend les mises à jour d'état plus explicites, tandis que Vue propose une liaison de données et des directives qui réduisent souvent la quantité de code dans le template.

La réalisation des deux versions montre que les concepts sont plus importants que la syntaxe. Une fois les composants, les props, l'état, le cycle de vie et les événements compris, il devient possible de retrouver dans Vue l'équivalent d'une solution React tout en conservant la même structure, les mêmes fonctionnalités, l'accessibilité et l'expérience utilisateur.

## Lexique

**API (Application Programming Interface)** : interface qui permet à plusieurs parties d'un logiciel de communiquer. Dans ce projet, le service des insights simule un appel asynchrone à une API afin de fournir des données au composant `Insights`.

**Attribut** : information ajoutée à une balise HTML pour préciser son comportement ou son contenu. Par exemple, `id`, `class`, `href`, `aria-label` et `disabled` sont des attributs.

**Build** : opération qui transforme le code source en fichiers optimisés pouvant être publiés. Avec Vite, la commande `npm run build` crée normalement le dossier `dist`.

**Composant** : partie autonome et réutilisable d'une interface. `Header`, `FeatureCard`, `Insights` et `Footer` sont des composants du projet.

**Composition API** : manière d'organiser la logique d'un composant Vue avec des fonctions comme `ref`, `reactive`, `computed` et `onMounted`. Elle est utilisée dans les blocs `<script setup>` du projet Vue.

**Cycle de vie** : ensemble des étapes traversées par un composant, notamment sa création, son ajout à la page, sa mise à jour et sa suppression. React utilise notamment `useEffect`, tandis que Vue propose des fonctions comme `onMounted`.

**Directive Vue** : attribut spécial commençant généralement par `v-` et donnant une instruction à Vue. `v-if`, `v-for`, `v-bind` et `v-model` sont des directives.

**DOM (Document Object Model)** : représentation de la page HTML sous la forme d'un arbre d'objets que JavaScript peut consulter et modifier. React et Vue mettent à jour le DOM lorsque les données de l'interface changent.

**État, ou state** : donnée interne susceptible de changer pendant l'utilisation d'un composant. La liste des insights, le contenu du formulaire et le message d'erreur font partie de l'état de l'application.

**État réactif** : donnée dont la modification provoque automatiquement la mise à jour des éléments de l'interface qui en dépendent. React crée cet état avec `useState`. Vue utilise notamment `ref` et `reactive`.

**Événement** : action détectée dans l'interface, comme un clic, une saisie ou l'envoi d'un formulaire. React utilise par exemple `onClick` et `onSubmit`, tandis que Vue utilise `@click` et `@submit`.

**Framework frontend** : ensemble d'outils et de règles permettant d'organiser et de construire une interface web. React et Vue permettent tous les deux de créer une application à partir de composants réutilisables.

**Hook React** : fonction spéciale permettant d'utiliser certaines fonctionnalités de React dans un composant fonctionnel. `useState` et `useEffect` sont des hooks.

**Interpolation** : insertion d'une valeur JavaScript dans le contenu affiché. React utilise `{valeur}` dans JSX, alors que Vue utilise `{{ valeur }}` dans le texte d'un template.

**JSX** : extension de syntaxe utilisée par React pour écrire un balisage proche du HTML directement dans JavaScript. JSX emploie notamment `className`, `htmlFor` et des expressions placées entre accolades.

**Prop** : donnée transmise d'un composant parent à un composant enfant. Dans le projet, `Features` transmet par exemple `icon`, `title` et `description` à `FeatureCard`.

**Rendu** : opération qui produit ou met à jour l'interface affichée à partir des composants et de leurs données. Une modification de l'état peut déclencher un nouveau rendu.

**SFC (Single File Component)** : format de composant Vue regroupant généralement le template, la logique JavaScript et éventuellement les styles dans un seul fichier `.vue`.

**Template Vue** : bloc `<template>` d'un SFC décrivant la structure HTML du composant. Il accepte les interpolations, les directives et les composants enfants.

**Vite** : outil de développement et de build utilisé par les deux versions du projet. Il fournit le serveur local et prépare les fichiers de production.

**DOM virtuel** : représentation légère du DOM conservée en mémoire. React et Vue peuvent comparer les changements dans cette représentation avant d'appliquer au DOM réel uniquement les mises à jour nécessaires.
