import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * TP 6, pour aller plus loin : panneau d'aide affiché dans l'outlet nommé « aide ».
 *
 * Route : { path: 'aide', component: Aide, outlet: 'aide' }
 * Ouvrir : <a [routerLink]="[{ outlets: { aide: ['aide'] } }]">
 * Fermer : <a [routerLink]="['/', { outlets: { aide: null } }]">
 * L'URL contient les deux zones : /tasks(aide:aide). La page principale ne change pas.
 *
 * PIÈGE : DANS ce composant, un lien est relatif à la route « aide » elle-même.
 * Sans le '/' initial, [{ outlets: { aide: null } }] ne ferme rien. Depuis App,
 * la racine est déjà le point de départ : le '/' n'y est pas nécessaire.
 */
@Component({
    selector: 'app-aide',
    imports: [RouterLink],
    template: `
        <aside class="panneau" aria-label="Aide">
            <h2>Aide</h2>
            <ul>
                <li>Cochez une tâche pour la marquer terminée.</li>
                <li>Cliquez sur un titre pour voir le détail et son auteur.</li>
                <li>La page Équipe demande d'être connecté.</li>
                <li>Regardez l'URL : ce panneau vit dans un outlet nommé.</li>
            </ul>
            <a [routerLink]="['/', { outlets: { aide: null } }]">Fermer l'aide</a>
        </aside>
    `,
    styles: `
        .panneau {
            position: fixed;
            top: 16px;
            right: 16px;
            width: 280px;
            padding: 4px 16px 16px;
            border: 1px solid var(--bordure);
            border-radius: 12px;
            background: #fff;
            box-shadow: 0 4px 16px rgb(0 0 0 / 12%);
        }
    `,
})
export class Aide {}
