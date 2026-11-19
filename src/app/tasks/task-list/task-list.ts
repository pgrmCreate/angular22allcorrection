import { Component, computed, inject, signal } from '@angular/core';
import { TaskStore } from '../../core/task-store';
import { Carte } from '../../shared/carte';
import { Filtre, FiltreTache } from '../filtre/filtre';
import { TaskAdd } from '../task-add/task-add';
import { TaskItem } from '../task-item/task-item';

/**
 * Liste des tâches.
 *
 * TP 5 : TaskList injecte TaskStore. Ses entrées (tasks) et ses sorties (toggled,
 * removed) du TP 4 ont disparu : elle lit les tâches dans le service et lui demande
 * directement les modifications. Plus de relais vers App.
 *
 * TaskItem garde son entrée et ses sorties : c'est un composant de présentation,
 * réutilisable, qui n'a pas besoin de connaître le service.
 */
@Component({
    selector: 'app-task-list',
    imports: [Carte, TaskAdd, Filtre, TaskItem],
    templateUrl: './task-list.html',
    styleUrl: './task-list.css',
})
export class TaskList {
    /** protected : le template peut lire store.remaining(), store.toggle()… */
    protected readonly store = inject(TaskStore);

    protected readonly filtre = signal<FiltreTache>('toutes');

    /** Le computed lit un signal du service : il se recalcule quand les tâches changent. */
    protected readonly visibles = computed(() => {
        const filtre = this.filtre();
        return this.store
            .tasks()
            .filter((t) =>
                filtre === 'toutes' ? true : filtre === 'actives' ? !t.completed : t.completed,
            );
    });
}
