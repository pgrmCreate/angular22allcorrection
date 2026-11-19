import { Component, input } from '@angular/core';
import { Task } from '../../models/task';
import { Done } from '../../shared/done';
import { TruncatePipe } from '../../shared/truncate-pipe';

/**
 * TP 2 : affiche la liste des tâches.
 *
 * Les tâches restent déclarées dans App (consigne du TP). Pour que TaskList puisse
 * les afficher, App les lui passe par une entrée : <app-task-list [tasks]="tasks" />.
 * input() est détaillé au module 3 ; ici on l'utilise simplement, comme le property
 * binding <app-task-item [task]="task" /> vu au module 2.
 */
@Component({
    selector: 'app-task-list',
    // Tout ce que le template utilise doit être importé : la directive et le pipe.
    imports: [Done, TruncatePipe],
    templateUrl: './task-list.html',
    styleUrl: './task-list.css',
})
export class TaskList {
    /** required : Angular signale une erreur si le parent oublie [tasks]. */
    readonly tasks = input.required<Task[]>();
}
