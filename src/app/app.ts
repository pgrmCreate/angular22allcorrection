import { Component, signal } from '@angular/core';

/**
 * Composant racine, affiché dans <app-root> de index.html.
 *
 * TP 1 : on garde la classe générée par ng new et on simplifie son template.
 * L'import de RouterOutlet est retiré : le template ne contient plus de <router-outlet />
 * (il reviendra au TP 6, avec les routes). Un import inutilisé déclenche un avertissement
 * du compilateur.
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrl: './app.css',
})
export class App {
    /** Un signal : modifier sa valeur met la vue à jour automatiquement. */
    protected readonly title = signal('TaskFlow');
}
