import { Component, output } from '@angular/core';

/**
 * TP 2 : un champ et un bouton pour ajouter une tâche.
 *
 * La saisie est lue avec une variable de template (#titre) : pas de formulaire,
 * pas de propriété dans la classe. Le composant ne stocke pas les tâches : il
 * prévient App, qui les possède, avec une sortie (output(), détaillé au module 3).
 */
@Component({
    selector: 'app-task-add',
    templateUrl: './task-add.html',
    styleUrl: './task-add.css',
})
export class TaskAdd {
    /** Émet le titre saisi. Nom au passé, comme le recommande Angular : added, removed… */
    readonly added = output<string>();

    /** Reçoit l'élément <input> lui-même, grâce à la variable de template #titre. */
    protected ajouter(champ: HTMLInputElement): void {
        const titre = champ.value.trim();
        if (titre) {
            this.added.emit(titre);
        }
        champ.value = '';
        champ.focus();
    }
}
