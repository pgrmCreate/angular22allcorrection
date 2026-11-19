import { Component, computed, effect, signal } from '@angular/core';
import { MemberForm } from './equipe/member-form/member-form';
import { MemberFormSignal } from './equipe/member-form-signal/member-form-signal';
import { Task, TASKS_DEMO } from './models/task';
import { Carte } from './shared/carte';
import { TaskAdd } from './tasks/task-add/task-add';
import { TaskList } from './tasks/task-list/task-list';

/** Clé utilisée dans le localStorage. */
const CLE_STOCKAGE = 'taskflow.tasks';

/** Relit les tâches sauvegardées ; à défaut, part des données de démonstration. */
function lireTachesSauvegardees(): Task[] {
    try {
        const json = localStorage.getItem(CLE_STOCKAGE);
        return json ? (JSON.parse(json) as Task[]) : [...TASKS_DEMO];
    } catch {
        // JSON corrompu ou localStorage indisponible (navigation privée stricte…).
        return [...TASKS_DEMO];
    }
}

/**
 * Composant racine.
 *
 * TP 4 : les tâches deviennent un signal. Les modifications passent par update()
 * en créant toujours un NOUVEAU tableau : muter le tableau existant ne préviendrait
 * personne. remaining est un computed et la sauvegarde un effect.
 */
@Component({
    selector: 'app-root',
    imports: [Carte, TaskList, TaskAdd, MemberForm, MemberFormSignal],
    templateUrl: './app.html',
    styleUrl: './app.css',
})
export class App {
    protected readonly title = signal('TaskFlow');

    /** TP 4, objectif 2 : la source de vérité est un signal. */
    protected readonly tasks = signal<Task[]>(lireTachesSauvegardees());

    /**
     * TP 4, objectif 2 : valeur dérivée. Un computed est paresseux (calculé à la
     * lecture), mémorisé, et recalculé seulement quand tasks change.
     */
    protected readonly remaining = computed(() => this.tasks().filter((t) => !t.completed).length);

    constructor() {
        // TP 4, objectif 4 : un effect pour synchroniser avec l'extérieur.
        // Il s'exécute une première fois, puis à chaque changement des signaux qu'il
        // lit (ici tasks). Il est détruit avec le composant.
        // Règle : effect pour les effets de bord (stockage, logs…), computed pour
        // calculer une valeur.
        effect(() => {
            localStorage.setItem(CLE_STOCKAGE, JSON.stringify(this.tasks()));
        });
    }

    protected ajouter(title: string): void {
        this.tasks.update((liste) => [
            ...liste,
            { id: Date.now(), userId: 1, title, completed: false },
        ]);
    }

    protected basculer(id: number): void {
        // On remplace la tâche modifiée par une copie ; les autres gardent la même
        // référence, donc leurs TaskItem (OnPush) ne sont pas revérifiés.
        this.tasks.update((liste) =>
            liste.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
        );
    }

    protected supprimer(id: number): void {
        this.tasks.update((liste) => liste.filter((t) => t.id !== id));
    }
}
