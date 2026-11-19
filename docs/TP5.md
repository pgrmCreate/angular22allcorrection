# TP 5 – Centraliser les tâches dans un service

Tag Git : `tp5`.

## 1. Générer `TaskStore` avec `@Service()`

```powershell
ng g service core/task-store
```

Le CLI 22 génère directement `@Service() export class TaskStore {}`. `@Service()` fournit le service à
la racine : une seule instance pour toute l'application (équivalent de
`@Injectable({ providedIn: 'root' })`). Il s'utilise avec `inject()`.

## 2. Signal privé exposé en lecture seule, `add`, `toggle`, `remove`

[task-store.ts](../src/app/core/task-store.ts)

```ts
private readonly _tasks = signal<Task[]>(lireTachesSauvegardees());
readonly tasks = this._tasks.asReadonly();
```

Un composant peut lire `store.tasks()` mais pas écrire `store.tasks.set([])` : toutes les modifications
passent par les méthodes du service, ce qui les rend faciles à suivre (et à journaliser). L'`effect` de
sauvegarde du TP 4 a quitté `App` pour rejoindre le service.

## 3. `TaskList` et `TaskAdd` injectent le service

- [task-list.ts](../src/app/tasks/task-list/task-list.ts) : `protected readonly store = inject(TaskStore)`.
  L'entrée `tasks` et les sorties `toggled`/`removed` du TP 4 disparaissent.
- [task-add.ts](../src/app/tasks/task-add/task-add.ts) : la sortie `added` disparaît, `ajouter()` appelle
  `store.add()`.
- [app.ts](../src/app/app.ts) ne contient plus que le titre : `<app-task-list />` suffit.
- `TaskItem` **garde** son entrée et ses sorties : composant de présentation, il ne dépend pas du service et
  reste réutilisable et facile à tester.

## 4. Le compteur `remaining`

Un `computed` du service, affiché par `TaskList` : `{{ store.remaining() }} restantes`.

## 5. Supprimer depuis l'interface

Le bouton « Supprimer » de `TaskItem` émet `removed` ; `TaskList` appelle `store.remove($event)`.

## Pour aller plus loin

- **Jeton `API_URL`** : [api-url.ts](../src/app/core/api-url.ts). `new InjectionToken<string>('API_URL', {
  providedIn: 'root', factory: () => 'https://jsonplaceholder.typicode.com' })`. On l'injecte avec
  `inject(API_URL)` et on le remplace avec `{ provide: API_URL, useValue: '…' }`.
- **`Logger` remplacé avec `useClass`** : [logger.ts](../src/app/core/logger.ts) et
  [app.config.ts](../src/app/app.config.ts) (`{ provide: Logger, useClass: ConsoleLogger }`).
  `TaskStore` injecte `Logger` et reçoit un `ConsoleLogger` : les messages apparaissent horodatés et en
  couleur. La sous-classe doit être décorée (`@Service({ autoProvided: false })`), sinon elle hérite de la
  fabrique de `Logger`.
- **Combien d'instances ?** [demo-injecteurs.ts](../src/app/demos/demo-injecteurs.ts). Un composant avec
  `providers: [Compteur]` obtient **sa propre instance**, une par composant affiché, détruite avec lui. Sans
  `providers`, l'injecteur remonte jusqu'à la racine : instance partagée. Résultat vérifié : deux compteurs
  locaux n° 1 et n° 2 indépendants, deux compteurs partagés qui affichent tous deux l'instance n° 3.
- **Injector Tree** (Angular DevTools) : `TaskStore`, `Logger` et `Compteur` dans l'injecteur racine ;
  un `Compteur` supplémentaire dans l'injecteur de chaque `CompteurLocal`.
