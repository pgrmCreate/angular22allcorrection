import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Service, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Task } from '../models/task';
import { API_URL } from './api-url';
import { Logger } from './logger';

/** Clé utilisée dans le localStorage. */
const CLE_STOCKAGE = 'taskflow.tasks';

/** Relit les tâches sauvegardées ; null s'il n'y a encore rien (ou JSON corrompu). */
function lireTachesSauvegardees(): Task[] | null {
    try {
        const json = localStorage.getItem(CLE_STOCKAGE);
        return json ? (JSON.parse(json) as Task[]) : null;
    } catch {
        return null;
    }
}

/**
 * Le service qui centralise les tâches.
 *
 * TP 5 : état privé exposé en lecture seule, méthodes add / toggle / remove,
 * compteur remaining, sauvegarde dans le localStorage.
 * TP 6 : les tâches viennent de l'API JSONPlaceholder (GET /todos).
 *
 * PIÈGE du TP 6 : API + localStorage. Si load() interrogeait l'API à chaque
 * affichage de la liste, toute modification serait écrasée en revenant du détail
 * d'une tâche (et l'API ne conserve rien). D'où le signal « charge » :
 * - load() n'appelle l'API qu'une fois, puis renvoie les tâches en mémoire ;
 * - reload() force un nouvel appel (bouton « Recharger depuis l'API ») ;
 * - la sauvegarde ne commence qu'après le premier chargement, sinon on
 *   enregistrerait une liste vide au démarrage.
 */
@Service()
export class TaskStore {
    private readonly http = inject(HttpClient);
    private readonly api = inject(API_URL);
    private readonly logger = inject(Logger);

    private readonly sauvegarde = lireTachesSauvegardees();
    private readonly _tasks = signal<Task[]>(this.sauvegarde ?? []);
    private readonly charge = signal(this.sauvegarde !== null);

    readonly tasks = this._tasks.asReadonly();
    readonly remaining = computed(() => this._tasks().filter((t) => !t.completed).length);

    constructor() {
        effect(() => {
            if (this.charge()) {
                localStorage.setItem(CLE_STOCKAGE, JSON.stringify(this._tasks()));
            }
        });
    }

    /**
     * TP 6, objectif 2 : les 10 premières tâches de l'API.
     * Renvoie un Observable : rien ne part tant que personne ne s'abonne.
     */
    load(): Observable<Task[]> {
        return this.charge() ? of(this._tasks()) : this.reload();
    }

    /** Interroge l'API même si les tâches sont déjà chargées. */
    reload(): Observable<Task[]> {
        return this.http
            .get<Task[]>(`${this.api}/todos`, { params: { _limit: 10 } }) // → /todos?_limit=10
            .pipe(
                // tap : effet de bord sans modifier la valeur qui passe.
                tap((tasks) => {
                    this._tasks.set(tasks);
                    this.charge.set(true);
                    this.logger.log(`${tasks.length} tâches chargées depuis l'API`);
                }),
            );
    }

    /** Une tâche précise (utilisée par le résolveur). */
    getById(id: number): Observable<Task> {
        return this.http.get<Task>(`${this.api}/todos/${id}`);
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
