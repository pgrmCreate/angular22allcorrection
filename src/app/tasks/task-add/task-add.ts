import { afterNextRender, Component, ElementRef, output, viewChild } from '@angular/core';

/**
 * Champ d'ajout d'une tâche.
 *
 * TP 2 : la saisie est lue avec une variable de template (#titre).
 * TP 4, pour aller plus loin : le champ reçoit le focus au chargement.
 */
@Component({
    selector: 'app-task-add',
    templateUrl: './task-add.html',
    styleUrl: './task-add.css',
})
export class TaskAdd {
    readonly added = output<string>();

    /**
     * viewChild() : requête de vue. Elle renvoie un SIGNAL contenant l'élément qui
     * porte #titre dans le template. required : il existe forcément (pas de @if autour).
     */
    private readonly champ = viewChild.required<ElementRef<HTMLInputElement>>('titre');

    constructor() {
        // Le DOM n'existe pas encore dans le constructeur : afterNextRender attend
        // le premier rendu, puis exécute le code une seule fois (et seulement dans le
        // navigateur, jamais côté serveur en SSR).
        afterNextRender(() => this.champ().nativeElement.focus());
    }

    protected ajouter(champ: HTMLInputElement): void {
        const titre = champ.value.trim();
        if (titre) {
            this.added.emit(titre);
        }
        champ.value = '';
        champ.focus();
    }
}
