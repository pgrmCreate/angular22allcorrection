import { computed, effect, inject, Service, signal } from '@angular/core';
import { Task, TASKS_DEMO } from '../models/task';
import { Logger } from './logger';

/** Clé utilisée dans le localStorage. */
const CLE_STOCKAGE = 'taskflow.tasks';

/** Relit les tâches sauvegardées ; à défaut, part des données de démonstration. */
function lireTachesSauvegardees(): Task[] {
    try {
        const json = localStorage.getItem(CLE_STOCKAGE);
        return json ? (JSON.parse(json) as Task[]) : [...TASKS_DEMO];
    } catch {
        return [...TASKS_DEMO];
    }
}

/**
 * TP 5 : le service qui centralise les tâches (ng g service core/task-store).
 *
 * @Service() (Angular 22) : le service est fourni automatiquement à la racine.
 * Il n'existe qu'UNE instance pour toute l'application : TaskList, TaskAdd et
 * tout autre composant qui l'injecte partagent les mêmes tâches.
 * Équivalent historique : @Injectable({ providedIn: 'root' }).
 * @Service() s'utilise avec inject() (pas d'injection par le constructeur).
 *
 * Le modèle « état privé, lecture publique » :
 * - _tasks est privé et modifiable : seul le service peut le changer ;
 * - tasks est exposé en lecture seule (asReadonly()) : un composant ne peut pas
 *   faire store.tasks.set([]) ; il doit passer par add, toggle ou remove.
 */
@Service()
export class TaskStore {
    private readonly logger = inject(Logger);

    private readonly _tasks = signal<Task[]>(lireTachesSauvegardees());

    /** Lecture seule : un Signal<Task[]> sans set() ni update(). */
    readonly tasks = this._tasks.asReadonly();

    /** TP 5, objectif 4 : le compteur, calculé à partir de l'état. */
    readonly remaining = computed(() => this._tasks().filter((t) => !t.completed).length);

    constructor() {
        // La sauvegarde du TP 4 quitte App et rejoint les données qu'elle protège.
        // Un effect créé dans un service racine vit aussi longtemps que l'application.
        effect(() => {
            localStorage.setItem(CLE_STOCKAGE, JSON.stringify(this._tasks()));
        });
    }

    add(title: string): void {
        const titre = title.trim();
        if (!titre) {
            return;
        }
        this._tasks.update((liste) => [
            ...liste,
            { id: Date.now(), userId: 1, title: titre, completed: false },
        ]);
        this.logger.log(`Tâche ajoutée : « ${titre} »`);
    }

    toggle(id: number): void {
        this._tasks.update((liste) =>
            liste.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
        );
        this.logger.log(`Tâche ${id} basculée`);
    }

    remove(id: number): void {
        this._tasks.update((liste) => liste.filter((t) => t.id !== id));
        this.logger.log(`Tâche ${id} supprimée`);
    }
}
