import { Component } from '@angular/core';

/**
 * TP 4, pour aller plus loin : projection de contenu.
 *
 *     <app-carte>
 *         <h2 titre>Mes tâches</h2>      ← va dans <ng-content select="[titre]">
 *         <p>Le reste du contenu</p>      ← va dans le <ng-content> sans select
 *     </app-carte>
 *
 * select prend un sélecteur CSS : ici, tout élément qui porte l'attribut « titre ».
 * Le contenu placé ENTRE les balises <ng-content> s'affiche par défaut quand le
 * parent ne fournit rien pour cet emplacement (depuis Angular 18).
 */
@Component({
    selector: 'app-carte',
    template: `
        <article class="carte">
            <header>
                <ng-content select="[titre]"><h2>Sans titre</h2></ng-content>
            </header>
            <ng-content />
        </article>
    `,
    styles: `
        .carte {
            margin-bottom: 24px;
            padding: 4px 20px 16px;
            border: 1px solid var(--bordure);
            border-radius: 12px;
            background: #fff;
            box-shadow: 0 1px 3px rgb(0 0 0 / 6%);
        }
    `,
})
export class Carte {}
