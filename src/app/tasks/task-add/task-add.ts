import { afterNextRender, Component, ElementRef, inject, viewChild } from '@angular/core';
import { TaskStore } from '../../core/task-store';

/**
 * Champ d'ajout d'une tâche.
 *
 * TP 2 : la saisie est lue avec une variable de template (#titre).
 * TP 4 : le champ reçoit le focus au chargement.
 * TP 5 : la sortie « added » disparaît ; TaskAdd appelle directement TaskStore.add().
 */
@Component({
    selector: 'app-task-add',
    templateUrl: './task-add.html',
    styleUrl: './task-add.css',
})
export class TaskAdd {
    /** inject() : fonctionne à l'initialisation des propriétés ou dans le constructeur. */
    private readonly store = inject(TaskStore);

    private readonly champ = viewChild.required<ElementRef<HTMLInputElement>>('titre');

    constructor() {
        afterNextRender(() => this.champ().nativeElement.focus());
    }

    protected ajouter(champ: HTMLInputElement): void {
        // Le service ignore les titres vides : la règle est au même endroit que les données.
        this.store.add(champ.value);
        champ.value = '';
        champ.focus();
    }
}
