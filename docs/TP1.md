# TP 1 – Mettre en œuvre l'environnement de développement

Tag Git : `tp1` (`git checkout tp1`).

## 1. Vérifier Node.js et installer Angular CLI 22

```powershell
node -v          # Angular 22 exige ^22.22.3, ^24.15.0 ou >=26
npm -v
npm install -g @angular/cli@22
ng version       # doit afficher Angular CLI 22.x
```

Pièges fréquents sous Windows :

- PowerShell refuse `ng` ou `npm` (« l'exécution de scripts est désactivée ») :
  `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
- `ng version` affiche une ancienne version : un `package.json` ou un `node_modules` contenant
  `@angular/cli` dans un dossier parent (souvent le dossier utilisateur) prend le dessus. Le supprimer,
  ou créer le projet avec `npx @angular/cli@22 new taskflow`.
- Avec nvm, chaque version de Node a ses propres paquets globaux : réinstaller le CLI après un `nvm use`.

## 2. Créer le projet

```powershell
ng new taskflow --defaults   # CSS, sans SSR, sans questions
cd taskflow
```

## 3. Lancer le serveur de développement

```powershell
ng serve        # ou npm start
```

Ouvrir http://localhost:4200. Le serveur recompile et recharge la page à chaque enregistrement.

## 4. L'arborescence générée

| Fichier ou dossier | Rôle |
|---|---|
| `package.json` | dépendances et scripts npm (`start`, `build`, `test`) |
| `angular.json` | configuration du CLI : build, serveur, tests, budgets de taille |
| `tsconfig*.json` | configuration TypeScript (mode strict activé par défaut) |
| `public/` | fichiers copiés tels quels (favicon, images) |
| `src/index.html` | la seule page HTML ; contient `<app-root>` |
| `src/main.ts` | point d'entrée : `bootstrapApplication(App, appConfig)` |
| `src/styles.css` | styles globaux |
| `src/app/app.ts` | le composant racine `App` (classe + décorateur `@Component`) |
| `src/app/app.html`, `app.css` | son template et ses styles isolés |
| `src/app/app.config.ts` | les *providers* de l'application (routeur, HTTP…) |
| `src/app/app.routes.ts` | la table des routes (vide pour l'instant) |
| `src/app/app.spec.ts` | le test unitaire de `App` (Vitest) |

À noter en Angular 22 : plus de `NgModule` (composants *standalone*), plus de Zone.js
(application *zoneless*), et les composants sont en `OnPush` par défaut.

## 5. Vider le template de `App`

Voir [app.html](../src/app/app.html) et [app.ts](../src/app/app.ts) : le template ne contient plus que
`<h1>{{ title() }}</h1>`. Comme le `<router-outlet />` a disparu, l'import de `RouterOutlet` est
retiré de `App` (sinon le compilateur signale un import inutilisé).

## Pour aller plus loin

- **Angular DevTools** : extension Chrome ou Firefox. Onglet *Angular* des outils de développement
  (F12) → *Components* : sélectionner `App` montre la valeur du signal `title`, modifiable en direct.
- **Rechargement automatique** : changer `signal('TaskFlow')` en `signal('TaskFlow 22')` et enregistrer :
  le navigateur se met à jour sans action. Le CLI fait même du remplacement à chaud des templates et
  des styles, sans recharger toute la page.
- **`ng build`** : produit `dist/taskflow/browser/` avec `index.html`, des fichiers `main-XXXX.js`
  et `styles-XXXX.css`. Le suffixe est une empreinte du contenu (*output hashing*) : un fichier modifié
  change de nom, ce qui évite les problèmes de cache. Le code est minifié et l'arbre des dépendances
  inutilisées est élagué (*tree shaking*). Les *budgets* d'`angular.json` font échouer le build si le
  paquet initial dépasse 1 Mo.
