import { Component, computed, input, output, signal } from '@angular/core';
import { Task } from '../../models/task';
import { Filtre, FiltreTache } from '../filtre/filtre';
import { TaskItem } from '../task-item/task-item';

/**
 * Liste des tâches.
 *
 * TP 4 : chaque tâche est affichée par un TaskItem, et un Filtre choisit les tâches
 * visibles. TaskList ne possède toujours pas les tâches : elle relaie les sorties de
 * TaskItem vers App. Ce « relais » de main en main est exactement ce que le service
 * du TP 5 va supprimer.
 */
@Component({
    selector: 'app-task-list',
    imports: [TaskItem, Filtre],
    templateUrl: './task-list.html',
    styleUrl: './task-list.css',
})
export class TaskList {
    readonly tasks = input.required<Task[]>();
    readonly toggled = output<number>();
    readonly removed = output<number>();

    /** État local à la liste : le filtre choisi. Partagé avec Filtre par [(value)]. */
    protected readonly filtre = signal<FiltreTache>('toutes');

    /**
     * Tâches visibles : dérivées de tasks ET de filtre. Le computed se recalcule
     * seulement quand l'un des deux change, et mémorise le résultat entre-temps.
     */
    protected readonly visibles = computed(() => {
        const filtre = this.filtre();
        return this.tasks().filter((t) =>
            filtre === 'toutes' ? true : filtre === 'actives' ? !t.completed : t.completed,
        );
    });
}
