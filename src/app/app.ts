import { Component, signal } from '@angular/core';
import { MemberForm } from './equipe/member-form/member-form';
import { MemberFormSignal } from './equipe/member-form-signal/member-form-signal';
import { Task, TASKS_DEMO } from './models/task';
import { TaskAdd } from './tasks/task-add/task-add';
import { TaskList } from './tasks/task-list/task-list';

/**
 * Composant racine.
 *
 * TP 2 : App possède le tableau des tâches. Il le transmet à TaskList et reçoit
 * les nouveaux titres de TaskAdd. Au TP 4 ce tableau deviendra un signal, puis
 * il partira dans un service au TP 5.
 *
 * TP 3 : App affiche aussi le formulaire des membres, dans ses deux versions.
 * Au TP 6, chaque page aura sa propre route.
 */
@Component({
    selector: 'app-root',
    imports: [TaskList, TaskAdd, MemberForm, MemberFormSignal],
    templateUrl: './app.html',
    styleUrl: './app.css',
})
export class App {
    protected readonly title = signal('TaskFlow');

    /** Copie des données de démonstration : on ne modifie pas la constante d'origine. */
    protected tasks: Task[] = [...TASKS_DEMO];

    protected ajouter(title: string): void {
        const task: Task = { id: Date.now(), userId: 1, title, completed: false };
        // PIÈGE : ne pas écrire this.tasks.push(task).
        // En Angular 22, les composants sont en OnPush par défaut : TaskList n'est
        // revérifié que si la RÉFÉRENCE de son entrée change. Un push modifie le même
        // tableau, la liste ne se mettrait pas à jour. On crée donc un nouveau tableau.
        this.tasks = [...this.tasks, task];
    }
}
