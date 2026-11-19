import { Component, signal } from '@angular/core';
import { DemoInjecteurs } from './demos/demo-injecteurs';
import { MemberForm } from './equipe/member-form/member-form';
import { MemberFormSignal } from './equipe/member-form-signal/member-form-signal';
import { TaskList } from './tasks/task-list/task-list';

/**
 * Composant racine.
 *
 * TP 5 : App ne gère plus les tâches. Le signal, le computed, l'effect et les
 * méthodes ajouter / basculer / supprimer du TP 4 sont partis dans TaskStore.
 * App se contente d'assembler les blocs de la page.
 */
@Component({
    selector: 'app-root',
    imports: [TaskList, MemberForm, MemberFormSignal, DemoInjecteurs],
    templateUrl: './app.html',
    styleUrl: './app.css',
})
export class App {
    protected readonly title = signal('TaskFlow');
}
