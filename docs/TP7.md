# TP 7 – Tester TaskFlow avec Vitest

Tag Git : `tp7`.

```powershell
npm test                 # ng test, mode surveillance
npm run test:ci          # une seule exécution
npm run test:coverage    # rapport de couverture dans coverage/
```

Résultat : 8 fichiers, 34 tests, environ 3 secondes. Les traces du cycle de vie de `TaskItem` (TP 4) sont
désactivées (`TRACER_CYCLE_DE_VIE = false`) pour garder une sortie lisible.

## 1. Le pipe `truncate`

[truncate-pipe.spec.ts](../src/app/shared/truncate-pipe.spec.ts) : pas de `TestBed`, un simple
`new TruncatePipe()`. Texte court, longueur exacte, texte long, suppression de l'espace avant « … »,
30 caractères par défaut, suffixe personnalisé, `null`.

## 2 et 3. `TaskStore` et `load()`

[task-store.spec.ts](../src/app/core/task-store.spec.ts)

- `provideHttpClient()` + `provideHttpClientTesting()` : aucune requête réelle.
- `http.expectOne((r) => r.url.endsWith('/todos'))` vérifie la requête (`GET`, `_limit=10`) ; `flush()`
  y répond ; `flush(null, { status: 500, statusText: '…' })` simule une erreur.
- `afterEach(() => http.verify())` échoue si une requête est restée sans réponse.
- `http.expectNone()` prouve que le second `load()` ne rappelle pas l'API.
- `Logger` est remplacé par `{ log: vi.fn() }` : pas de bruit, et on vérifie le message.
- `localStorage.clear()` dans `beforeEach` : jsdom le conserve d'un test à l'autre, ce qui rendrait les
  tests dépendants de leur ordre.
- `TestBed.tick()` déclenche l'`effect` de sauvegarde avant de lire le `localStorage`.

## 4. `TaskItem`

[task-item.spec.ts](../src/app/tasks/task-item/task-item.spec.ts) :
`fixture.componentRef.setInput('task', …)`, `await fixture.whenStable()`, puis on lit le DOM. Les
sorties sont espionnées avec `removed.subscribe(vi.fn())`. `provideRouter([])` est nécessaire à cause
du `routerLink`.

## 5. `authGuard` avec `RouterTestingHarness`

[auth-guard.spec.ts](../src/app/core/auth-guard.spec.ts) : deux composants factices, un vrai routeur.
On vérifie la page affichée et l'URL finale `/login?retour=%2Fequipe`.

## Pour aller plus loin

- **`TaskList` avec un store simulé** : [task-list.spec.ts](../src/app/tasks/task-list/task-list.spec.ts),
  `{ provide: TaskStore, useValue: storeSimule }`. Chargement à l'initialisation, compteur, appel de
  `toggle`, filtre « Terminées ».
- **Erreur 500** : `load: vi.fn().mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })))`
  puis on lit `[role=alert]`. Un second test couvre le serveur injoignable (`status: 0`).
- Tests en plus : l'intercepteur ([auth-interceptor.spec.ts](../src/app/core/auth-interceptor.spec.ts)) et
  le validateur ([interdit.spec.ts](../src/app/equipe/interdit.spec.ts)).
- **Un test qui échoue d'abord** : en remplaçant `!t.completed` par `t.completed` dans `remaining`,
  3 tests de `TaskStore` échouent. Les tests vérifient donc vraiment le compteur.

### Couverture

`npm run test:coverage` demande le paquet `@vitest/coverage-v8` (ajouté aux dépendances de dev).

**Piège** : par défaut, le rapport ne liste que les fichiers importés par au moins un test. Il annonçait
86 % alors que plusieurs fichiers n'étaient jamais testés. Avec `coverageInclude: ["src/app/**/*.ts"]` dans
la cible `test` d'`angular.json`, on obtient le vrai chiffre : **57 %** des instructions.

Code non testé repéré :

| Fichier | Pourquoi c'est à tester (ou pas) |
|---|---|
| `task-resolver.ts` | logique métier : tâche locale, appel API, redirection sur erreur. Priorité haute. |
| `task-detail.ts` | `httpResource` et le bouton Terminer/Rouvrir. |
| `recherche.ts` | `debounceTime` + `switchMap` : se teste avec `vi.useFakeTimers()` et `HttpTestingController`. |
| `login.ts` | redirection vers `retour` après connexion. |
| `member-form*.ts` | règles de validation affichées. |
| `logger.ts`, `aide.ts`, `demos/`, `app.routes.ts` | peu de logique : couvert par les tests E2E du TP 8. |

Une couverture élevée ne garantit pas des tests utiles : viser d'abord les règles métier et les cas
d'erreur.
