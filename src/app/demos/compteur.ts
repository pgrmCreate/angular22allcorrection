import { Service, signal } from '@angular/core';

/** Numéro attribué à chaque nouvelle instance, pour les distinguer à l'écran. */
let instances = 0;

/**
 * TP 5, pour aller plus loin : un petit service pour compter les instances.
 *
 * @Service() le fournit à la racine : un composant qui l'injecte reçoit
 * l'instance PARTAGÉE. Un composant qui le déclare dans ses providers reçoit
 * SA PROPRE instance (voir demo-injecteurs.ts).
 */
@Service()
export class Compteur {
    readonly instance = ++instances;
    readonly valeur = signal(0);

    incrementer(): void {
        this.valeur.update((n) => n + 1);
    }
}
