# TP 8 – Tests de bout en bout de TaskFlow

Tag Git : `tp8`.

## 1. Installer Cypress

```powershell
ng add @cypress/schematic
```

Le schematic (v6.0.0) installe Cypress 16.3, crée `cypress/` et
[cypress.config.ts](../cypress.config.ts), ajoute les scripts npm et les cibles `e2e`, `cypress-run` et
`cypress-open` dans `angular.json`. Nettoyage fait dans la correction : suppression du test d'exemple, de
la fixture d'exemple et de la configuration des tests de **composants** (elle utilise webpack, qu'un
projet Angular 22 n'emploie plus).

**Piège constaté le 19/11/2026** : avec Angular 22, le constructeur `@cypress/schematic:cypress`
(`ng e2e`, `ng run taskflow:cypress-run`) démarre le serveur puis s'arrête **sans lancer Cypress**, avec
le code de sortie 0. La commande a l'air de réussir alors qu'aucun test n'a tourné. Deux façons fiables :

```powershell
# Pendant le développement : deux terminaux (astuce du TP)
npm start
npm run cypress:open     # ou npm run cypress:run

# En une commande (intégration continue) : start-server-and-test lance le serveur,
# attend qu'il réponde, exécute les tests puis l'arrête
npm run e2e:ci
```

Autre piège : un `ng serve` resté ouvert pendant `ng add` peut servir deux copies d'Angular après la mise
à jour des dépendances (erreur « needs to be compiled using the JIT compiler »). Arrêter le serveur, lancer
`ng cache clean`, puis relancer.

## 2. Les attributs `data-cy`

[task-add.html](../src/app/tasks/task-add/task-add.html) : `data-cy="nouvelle-tache"` sur le champ,
`data-cy="ajouter"` sur le bouton (et `login-nom`, `login-valider` sur la page de connexion). Ces repères
ne changent pas quand on modifie le design, contrairement aux classes CSS.

## 3 et 4. Liste, ajout et passage à « terminée »

[taches.cy.ts](../cypress/e2e/taches.cy.ts), avec la vraie API :

- `cy.title().should('eq', 'Mes tâches')` lit le `title` de la route ;
- `cy.get('app-task-item').should('have.length', 10)` : `should` réessaie pendant 4 s, sans `wait` ;
- l'ajout, puis `.find('input[type=checkbox]').check()` et `.find('li').should('have.class', 'done')`.

**Piège** : attendre la fin du chargement (10 tâches) **avant** d'ajouter. Sinon la réponse de l'API peut
arriver après l'ajout et remplacer la liste : le test échoue une fois sur deux.

## 5. La redirection de `/equipe`

[navigation.cy.ts](../cypress/e2e/navigation.cy.ts) : `cy.visit('/equipe')` puis
`cy.url().should('include', '/login')`. Un second test se connecte et vérifie le retour sur `/equipe`.

Cypress vide le `localStorage` entre deux tests (*test isolation*) : chaque test repart de l'API.

## Pour aller plus loin

- **API simulée** : [api-simulee.cy.ts](../cypress/e2e/api-simulee.cy.ts) et la fixture
  [todos.json](../cypress/fixtures/todos.json) (3 tâches).
  `cy.intercept('GET', '**/todos*', { fixture: 'todos.json' }).as('todos')` puis `cy.wait('@todos')`.
- **Erreur 500** : `cy.intercept('GET', '**/todos*', { statusCode: 500 })` →
  « Impossible de charger les tâches (erreur 500). ». En plus : `{ forceNetworkError: true }` →
  « serveur injoignable ».
- **Playwright** : [playwright.config.ts](../playwright.config.ts) et
  [ajout.spec.ts](../playwright/ajout.spec.ts), lancés avec `npm run e2e:playwright`.

| | Cypress | Playwright |
|---|---|---|
| Style | chaîne de commandes mises en file d'attente | `async`/`await` classique |
| Attente automatique | `.should(...)` | `await expect(...)`, locators |
| Cibler `data-cy` | `cy.get('[data-cy=ajouter]')` | `page.getByTestId('ajouter')` (`testIdAttribute`) |
| Simuler l'API | `cy.intercept(...)` | `page.route(...)` |
| Serveur de dev | à lancer à part (ou `start-server-and-test`) | `webServer` dans la configuration |
| Navigateurs | Chrome, Edge, Firefox, Electron | Chromium, Firefox, WebKit (Safari) |
| Onglets, plusieurs domaines | limité | natif |
| Interface | Cypress App : pas à pas visuel, « voyage dans le temps » | UI mode, *trace viewer* |

La configuration Playwright utilise le Chrome installé (`channel: 'chrome'`) ; sans Chrome, lancer
`npx playwright install chromium` et retirer `channel`.

## Résultats

- Cypress : 3 fichiers, **9 tests passants** (`npm run e2e:ci`, environ 30 s avec le démarrage du serveur).
- Playwright : **2 tests passants**.
- Les tests marqués « API réelle » demandent un accès à internet (JSONPlaceholder).
