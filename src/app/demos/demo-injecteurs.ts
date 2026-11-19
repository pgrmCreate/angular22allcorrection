import { Component, inject } from '@angular/core';
import { Compteur } from './compteur';

/**
 * Compteur avec providers: [Compteur] : Angular crée un injecteur pour CHAQUE
 * instance du composant, donc un Compteur par composant. Il est détruit avec lui.
 */
@Component({
    selector: 'app-compteur-local',
    providers: [Compteur],
    template: `
        <button type="button" (click)="compteur.incrementer()">
            Instance n° {{ compteur.instance }} : {{ compteur.valeur() }}
        </button>
    `,
})
export class CompteurLocal {
    protected readonly compteur = inject(Compteur);
}

/** Compteur sans providers : l'injecteur remonte jusqu'à la racine, instance partagée. */
@Component({
    selector: 'app-compteur-partage',
    template: `
        <button type="button" class="secondaire" (click)="compteur.incrementer()">
            Instance n° {{ compteur.instance }} : {{ compteur.valeur() }}
        </button>
    `,
})
export class CompteurPartage {
    protected readonly compteur = inject(Compteur);
}

/**
 * TP 5, pour aller plus loin : « Déclarer un service dans les providers d'un
 * composant : combien d'instances obtient-on ? »
 * Réponse : une par instance du composant. Cliquez sur les boutons pour le voir.
 */
@Component({
    selector: 'app-demo-injecteurs',
    imports: [CompteurLocal, CompteurPartage],
    template: `
        <h2>Démo : combien d'instances ?</h2>
        <p>Avec <code>providers: [Compteur]</code> dans le composant : une instance chacun.</p>
        <p class="ligne"><app-compteur-local /> <app-compteur-local /></p>
        <p>Sans providers : l'instance unique fournie à la racine, partagée.</p>
        <p class="ligne"><app-compteur-partage /> <app-compteur-partage /></p>
    `,
    styles: `
        .ligne {
            display: flex;
            gap: 8px;
        }
    `,
})
export class DemoInjecteurs {}
