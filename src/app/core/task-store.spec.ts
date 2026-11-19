import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Task } from '../models/task';
import { Logger } from './logger';
import { TaskStore } from './task-store';

const API_TODOS: Task[] = [
    { id: 1, userId: 1, title: 'Première', completed: false },
    { id: 2, userId: 1, title: 'Deuxième', completed: true },
];

/**
 * TP 7, objectifs 2 et 3 : tester le service.
 *
 * - provideHttpClientTesting() remplace le vrai réseau : aucune requête ne part,
 *   HttpTestingController permet de les inspecter et d'y répondre (flush).
 * - Logger est remplacé par une doublure ({ provide, useValue }) : pas de bruit
 *   dans la console, et on peut vérifier les appels.
 * - Le localStorage de jsdom est conservé entre les tests : on le vide avant
 *   chacun pour que les tests restent indépendants.
 */
describe('TaskStore', () => {
    let store: TaskStore;
    let http: HttpTestingController;
    const logger = { log: vi.fn() };

    beforeEach(() => {
        localStorage.clear();
        logger.log.mockClear();
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: Logger, useValue: logger },
            ],
        });
        store = TestBed.inject(TaskStore);
        http = TestBed.inject(HttpTestingController);
    });

    // Échoue si une requête attendue n'a pas reçu de réponse, ou si une requête imprévue est partie.
    afterEach(() => http.verify());

    /** Charge les deux tâches de test, comme si l'API avait répondu. */
    function chargerDepuisApi(): void {
        store.load().subscribe();
        http.expectOne((r) => r.url.endsWith('/todos')).flush(API_TODOS);
    }

    describe('add, toggle, remove et remaining', () => {
        it('démarre sans tâche', () => {
            expect(store.tasks()).toEqual([]);
            expect(store.remaining()).toBe(0);
        });

        it('ajoute une tâche non terminée et met à jour le compteur', () => {
            store.add('Préparer la démo');
            expect(store.tasks().length).toBe(1);
            expect(store.tasks()[0]).toMatchObject({ title: 'Préparer la démo', completed: false });
            expect(store.remaining()).toBe(1);
            expect(logger.log).toHaveBeenCalledWith('Tâche ajoutée : « Préparer la démo »');
        });

        it('retire les espaces et ignore un titre vide', () => {
            store.add('  Relire  ');
            store.add('   ');
            expect(store.tasks().map((t) => t.title)).toEqual(['Relire']);
        });

        it('bascule une tâche, dans un sens puis dans l’autre', () => {
            chargerDepuisApi();
            store.toggle(1);
            expect(store.tasks()[0].completed).toBe(true);
            expect(store.remaining()).toBe(0);
            store.toggle(1);
            expect(store.tasks()[0].completed).toBe(false);
            expect(store.remaining()).toBe(1);
        });

        it('ne modifie pas les autres tâches (même référence)', () => {
            chargerDepuisApi();
            const autre = store.tasks()[1];
            store.toggle(1);
            expect(store.tasks()[1]).toBe(autre);
        });

        it('supprime une tâche', () => {
            chargerDepuisApi();
            store.remove(1);
            expect(store.tasks().map((t) => t.id)).toEqual([2]);
            expect(store.remaining()).toBe(0);
        });
    });

    describe('load() avec HttpTestingController', () => {
        it('demande les 10 premières tâches à l’API', () => {
            store.load().subscribe();
            const req = http.expectOne((r) => r.url.endsWith('/todos'));
            expect(req.request.method).toBe('GET');
            expect(req.request.params.get('_limit')).toBe('10');
            req.flush(API_TODOS);

            expect(store.tasks()).toEqual(API_TODOS);
            expect(store.remaining()).toBe(1);
        });

        it('n’interroge l’API qu’une fois', () => {
            chargerDepuisApi();
            store.load().subscribe();
            http.expectNone((r) => r.url.endsWith('/todos'));
        });

        it('reload() interroge de nouveau l’API', () => {
            chargerDepuisApi();
            store.reload().subscribe();
            http.expectOne((r) => r.url.endsWith('/todos')).flush([]);
            expect(store.tasks()).toEqual([]);
        });

        it('transmet une erreur 500 à l’abonné, sans toucher aux tâches', () => {
            let erreur: { status: number } | undefined;
            store.load().subscribe({ error: (e) => (erreur = e) });
            http.expectOne((r) => r.url.endsWith('/todos')).flush(null, {
                status: 500,
                statusText: 'Erreur serveur',
            });
            expect(erreur?.status).toBe(500);
            expect(store.tasks()).toEqual([]);
        });

        it('sauvegarde les tâches dans le localStorage après le chargement', () => {
            chargerDepuisApi();
            store.add('Nouvelle');
            // L'effect s'exécute lors de la synchronisation suivante : on la provoque.
            TestBed.tick();
            const sauvegarde = JSON.parse(localStorage.getItem('taskflow.tasks')!);
            expect(sauvegarde.length).toBe(3);
        });
    });
});
