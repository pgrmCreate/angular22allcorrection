import { Routes } from '@angular/router';
import { Aide } from './aide/aide';
import { authGuard } from './core/auth-guard';
import { taskResolver } from './core/task-resolver';
import { Login } from './pages/login/login';
import { TaskList } from './tasks/task-list/task-list';

/**
 * TP 6, objectif 3 : la table des routes.
 *
 * - component : le composant est dans le paquet principal.
 * - loadComponent : le composant est téléchargé à la première visite (lazy loading).
 *   Il ne doit alors être importé nulle part ailleurs de façon statique.
 * - title : le titre de l'onglet du navigateur.
 * L'ordre compte : le routeur prend la première route qui correspond, '**' en dernier.
 */
export const routes: Routes = [
    { path: '', redirectTo: 'tasks', pathMatch: 'full' },
    { path: 'tasks', component: TaskList, title: 'Mes tâches' },
    {
        path: 'tasks/:id',
        loadComponent: () => import('./tasks/task-detail/task-detail').then((m) => m.TaskDetail),
        resolve: { task: taskResolver },
        title: 'Détail de la tâche',
    },
    { path: 'login', component: Login, title: 'Connexion' },
    {
        // Route parente sans composant : la garde protège tous ses enfants.
        path: 'equipe',
        canActivate: [authGuard],
        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./equipe/member-form/member-form').then((m) => m.MemberForm),
                title: 'Équipe',
            },
            {
                path: 'signal',
                loadComponent: () =>
                    import('./equipe/member-form-signal/member-form-signal').then(
                        (m) => m.MemberFormSignal,
                    ),
                title: 'Équipe (Signal Forms)',
            },
        ],
    },
    {
        path: 'recherche',
        loadComponent: () => import('./recherche/recherche').then((m) => m.Recherche),
        title: 'Recherche',
    },
    {
        path: 'demos',
        loadComponent: () => import('./demos/demo-injecteurs').then((m) => m.DemoInjecteurs),
        title: 'Démo des injecteurs',
    },
    // Route de l'outlet nommé « aide ».
    { path: 'aide', component: Aide, outlet: 'aide' },
    { path: '**', redirectTo: 'tasks' },
];
