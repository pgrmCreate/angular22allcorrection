# TaskFlow – correction complète des TP Angular 22

Correction commentée des 8 travaux pratiques de la formation **Angular – Développement d'applications
web** (ORSYS, réf. LNF), Angular 22.2. TaskFlow est l'application fil rouge : un gestionnaire de tâches
d'équipe, enrichi à chaque TP, qui finit par charger ses données depuis l'API
[JSONPlaceholder](https://jsonplaceholder.typicode.com).

Chaque TP a son **tag Git**, qui montre le projet exactement à la fin de ce TP, et sa **fiche de
correction** dans [docs/](docs). Le code contient des commentaires sur chaque notion et sur les pièges
rencontrés.

| TP | Sujet | Tag | Fiche |
|---|---|---|---|
| – | Code de départ fourni aux stagiaires | [`depart`](https://github.com/pgrmCreate/angular22allcorrection/tree/depart) | |
| 1 | Environnement, squelette | [`tp1`](https://github.com/pgrmCreate/angular22allcorrection/tree/tp1) | [TP1.md](docs/TP1.md) |
| 2 | Liste, ajout, `@let`, pipe `truncate`, directive `appDone` | [`tp2`](https://github.com/pgrmCreate/angular22allcorrection/tree/tp2) | [TP2.md](docs/TP2.md) |
| 3 | Formulaire des membres : Reactive Forms, validateur, Signal Forms | [`tp3`](https://github.com/pgrmCreate/angular22allcorrection/tree/tp3) | [TP3.md](docs/TP3.md) |
| 4 | `input`/`output`, signaux, `model()`, `effect`, cycle de vie, `ng-content` | [`tp4`](https://github.com/pgrmCreate/angular22allcorrection/tree/tp4) | [TP4.md](docs/TP4.md) |
| 5 | Service `TaskStore` avec `@Service()`, `useClass`, injecteurs | [`tp5`](https://github.com/pgrmCreate/angular22allcorrection/tree/tp5) | [TP5.md](docs/TP5.md) |
| 6 | Routes, HTTP, résolveur, `httpResource`, garde, intercepteur | [`tp6`](https://github.com/pgrmCreate/angular22allcorrection/tree/tp6) | [TP6.md](docs/TP6.md) |
| 7 | Tests unitaires Vitest, couverture | [`tp7`](https://github.com/pgrmCreate/angular22allcorrection/tree/tp7) | [TP7.md](docs/TP7.md) |
| 8 | Tests E2E Cypress, comparaison Playwright | [`tp8`](https://github.com/pgrmCreate/angular22allcorrection/tree/tp8) | [TP8.md](docs/TP8.md) |

Les objectifs **et** les « Pour aller plus loin » de chaque énoncé sont traités.

## Démarrer

Prérequis : Node `^22.22.3`, `^24.15.0` ou `>=26`, et npm. Sous Windows, si PowerShell refuse `npm` ou
`ng` : `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

```powershell
git clone https://github.com/pgrmCreate/angular22allcorrection.git
cd angular22allcorrection
npm install
npm start                 # http://localhost:4200
```

Voir l'état à la fin d'un TP :

```powershell
git checkout tp4          # puis npm install si package.json a changé
git checkout main         # revenir à la version finale
```

## Commandes

| Commande | Rôle |
|---|---|
| `npm start` | serveur de développement |
| `npm run build` | build de production dans `dist/` |
| `npm test` | tests unitaires Vitest, mode surveillance |
| `npm run test:ci` | tests unitaires, une seule exécution (34 tests) |
| `npm run test:coverage` | rapport de couverture dans `coverage/` |
| `npm run cypress:open` | Cypress en mode interactif (avec `npm start` lancé à côté) |
| `npm run e2e:ci` | démarre le serveur et lance les 9 tests Cypress |
| `npm run e2e:playwright` | le test d'ajout réécrit avec Playwright |

## Organisation du code

```text
src/app/
├── app.ts / app.html / app.routes.ts / app.config.ts   coquille, routes, providers
├── core/          TaskStore, Auth, garde, intercepteur, résolveur, Logger, API_URL
├── tasks/         TaskList, TaskItem, TaskAdd, Filtre, TaskDetail
├── equipe/        MemberForm (Reactive Forms), MemberFormSignal (Signal Forms), validateur
├── pages/login/   page de connexion
├── recherche/     recherche avec debounceTime + switchMap
├── aide/          panneau affiché dans l'outlet nommé « aide »
├── demos/         combien d'instances avec providers ?
├── shared/        pipe truncate, directive appDone, composant Carte
└── models/        Task, User, Membre
cypress/           tests E2E Cypress (fixture todos.json)
playwright/        test E2E Playwright
docs/              une fiche de correction par TP
```

## Choix et points d'attention

- **TP 2** : l'énoncé garde les tâches dans `App` et annonce leur transmission aux enfants au module 3.
  Pour que `TaskList` les affiche, la correction utilise une entrée simple (`input.required()`), comme le
  *property binding* vu au module 2.
- **OnPush par défaut** (Angular 22) : toujours créer un nouveau tableau (`[...l, t]`) au lieu de `push`.
- **Noms générés par le CLI 22** : `shared/done.ts` (classe `Done`), `shared/truncate-pipe.ts`, un dossier
  par composant. Les diapos utilisent `DoneDirective` : les deux noms fonctionnent.
- **TP 6** : `load()` n'interroge l'API qu'une fois, pour ne pas écraser les modifications (l'API ne
  conserve rien) ; `reload()` force l'appel.
- **TP 8** : avec Angular 22, la cible `ng e2e` de `@cypress/schematic` 6.0.0 ne lance pas Cypress ;
  utiliser `npm run e2e:ci` ou deux terminaux. Détails dans [TP8.md](docs/TP8.md).
- Le programme ORSYS cite encore Protractor pour le module 7 : il est abandonné ; la formation utilise
  Cypress.

Indentation : 4 espaces (`.editorconfig`, `.prettierrc`).
