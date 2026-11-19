# TP 6 – Routes, API REST et authentification

Tag Git : `tp6`.

## 1. `provideHttpClient()` et le jeton `API_URL`

[app.config.ts](../src/app/app.config.ts) :
`provideHttpClient(withInterceptors([authInterceptor]))` et
`{ provide: API_URL, useValue: 'https://jsonplaceholder.typicode.com' }`. Le jeton avait déjà une valeur
par défaut (TP 5) ; la fournir ici la rend visible et facile à changer.

## 2. `TaskStore.load()`

[task-store.ts](../src/app/core/task-store.ts) :

```ts
this.http.get<Task[]>(`${this.api}/todos`, { params: { _limit: 10 } })
    .pipe(tap((tasks) => this._tasks.set(tasks)));
```

`load()` renvoie un Observable : la requête ne part qu'à l'abonnement. `TaskList` s'abonne dans
`ngOnInit` avec `takeUntilDestroyed()`.

**Piège API + `localStorage`** : si `load()` interroge l'API à chaque affichage de la liste, une tâche
cochée redevient non cochée au retour du détail, et une tâche ajoutée disparaît (JSONPlaceholder ne
conserve rien). La correction ajoute un signal `charge` : `load()` n'appelle l'API qu'une fois puis
renvoie les tâches en mémoire, `reload()` force l'appel (bouton « Recharger depuis l'API »), et la
sauvegarde ne démarre qu'après le premier chargement (sinon une liste vide serait enregistrée au
démarrage et l'API ne serait plus jamais appelée).

## 3. Les routes

[app.routes.ts](../src/app/app.routes.ts) : `/tasks` (composant direct), `/tasks/:id` avec
`loadComponent` (le build produit un fichier `task-detail` séparé), `/login` et `/equipe`. `App`
devient la coquille : navigation avec `routerLink`/`routerLinkActive` et `<router-outlet />`. `/equipe`
est une route parente sans composant dont les enfants sont la version Reactive Forms (`/equipe`) et la
version Signal Forms (`/equipe/signal`) du TP 3 ; la garde posée sur le parent protège les deux.

## 4. Résolveur et `httpResource`

- [task-resolver.ts](../src/app/core/task-resolver.ts) cherche d'abord la tâche dans le store (les tâches
  ajoutées localement n'existent pas dans l'API), sinon `GET /todos/:id`. En cas d'erreur, il renvoie une
  `RedirectCommand` vers `/tasks`.
- [task-detail.ts](../src/app/tasks/task-detail/task-detail.ts) reçoit la tâche dans
  `task = input.required<Task>()` (clé `task` du `resolve`, grâce à `withComponentInputBinding()`) et
  charge l'auteur avec `httpResource<User>(() => `${api}/users/${this.task().userId}`)`. Le template gère
  les états `isLoading()`, `hasValue()` et `error()`.

## 5. La garde

[auth-guard.ts](../src/app/core/auth-guard.ts) renvoie `true` ou
`router.createUrlTree(['/login'], { queryParams: { retour: state.url } })`. La page
[login.ts](../src/app/pages/login/login.ts) lit `retour` dans une entrée. Piège : si le paramètre est
absent, le routeur met l'entrée à `undefined` même avec une valeur par défaut, d'où
`this.retour() ?? '/tasks'`.

## 6. L'intercepteur

[auth-interceptor.ts](../src/app/core/auth-interceptor.ts) : `req.clone({ setHeaders: { Authorization:
`Bearer ${token}` } })`. Vérifié dans l'onglet Réseau : après connexion en « Jean-Baptiste », les requêtes
partent avec `Authorization: Bearer SmVhbi1CYXB0aXN0ZQ==`. Le jeton vient de
[auth.ts](../src/app/core/auth.ts) ; il est factice et reste en mémoire.

## Pour aller plus loin

- **Recherche** : [recherche.ts](../src/app/recherche/recherche.ts), page `/recherche`.
  `valueChanges.pipe(map(trim), debounceTime(300), distinctUntilChanged(), switchMap(...))` puis
  `toSignal()`. Le `catchError` est **dans** le `switchMap` : placé après, la première erreur
  terminerait le flux et la recherche ne répondrait plus.
- **Erreur réseau** : [task-list.ts](../src/app/tasks/task-list/task-list.ts) affiche « Impossible de
  charger les tâches : serveur injoignable. » (`status === 0`) ou « … (erreur 500). ». Le détail affiche
  « Auteur introuvable » avec un bouton Réessayer (`author.reload()`).
- **Outlet nommé** : [aide.ts](../src/app/aide/aide.ts), `<router-outlet name="aide" />` dans
  [app.html](../src/app/app.html). L'URL devient `/tasks(aide:aide)`. Piège rencontré : dans le panneau,
  le lien de fermeture doit partir de la racine, `['/', { outlets: { aide: null } }]` ; sans le `'/'`, il
  est relatif à la route `aide` et ne ferme rien.
- La démo des injecteurs du TP 5 a maintenant sa propre page, `/demos`.
