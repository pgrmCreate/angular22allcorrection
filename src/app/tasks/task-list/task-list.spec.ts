import { HttpErrorResponse } from '@angular/common/http';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TaskStore } from '../../core/task-store';
import { Task } from '../../models/task';
import { TaskList } from './task-list';

/**
 * TP 7, pour aller plus loin : TaskList avec un TaskStore SIMULÉ.
 *
 * On ne teste que TaskList : le vrai service (et le réseau) est remplacé par une
 * doublure qui a la même forme. C'est l'injection de dépendances qui rend la
 * substitution aussi simple : { provide: TaskStore, useValue: storeSimule }.
 */
describe('TaskList', () => {
    let storeSimule: {
        tasks: ReturnType<typeof signal<Task[]>>;
        remaining: ReturnType<typeof signal<number>>;
        load: ReturnType<typeof vi.fn>;
        reload: ReturnType<typeof vi.fn>;
        toggle: ReturnType<typeof vi.fn>;
        remove: ReturnType<typeof vi.fn>;
        add: ReturnType<typeof vi.fn>;
    };
    let fixture: ComponentFixture<TaskList>;

    beforeEach(() => {
        storeSimule = {
            tasks: signal<Task[]>([
                { id: 1, userId: 1, title: 'A', completed: false },
                { id: 2, userId: 1, title: 'B', completed: true },
            ]),
            remaining: signal(1),
            load: vi.fn().mockReturnValue(of([])),
            reload: vi.fn().mockReturnValue(of([])),
            toggle: vi.fn(),
            remove: vi.fn(),
            add: vi.fn(),
        };
        TestBed.configureTestingModule({
            imports: [TaskList],
            providers: [provideRouter([]), { provide: TaskStore, useValue: storeSimule }],
        });
    });

    async function creer(): Promise<HTMLElement> {
        fixture = TestBed.createComponent(TaskList);
        await fixture.whenStable();
        return fixture.nativeElement;
    }

    it('charge les tâches à l’initialisation et affiche le compteur', async () => {
        const el = await creer();
        expect(storeSimule.load).toHaveBeenCalled();
        expect(el.textContent).toContain('1 restantes');
        expect(el.querySelectorAll('app-task-item').length).toBe(2);
    });

    it('appelle store.toggle quand on coche une tâche', async () => {
        const el = await creer();
        el.querySelector<HTMLInputElement>('app-task-item input[type=checkbox]')!.click();
        expect(storeSimule.toggle).toHaveBeenCalledWith(1);
    });

    it('filtre les tâches terminées', async () => {
        const el = await creer();
        const boutons = Array.from(el.querySelectorAll<HTMLButtonElement>('app-filtre button'));
        boutons.find((b) => b.textContent?.includes('Terminées'))!.click();
        await fixture.whenStable();
        const titres = Array.from(el.querySelectorAll('app-task-item a')).map((a) => a.textContent);
        expect(titres).toEqual(['B']);
    });

    it('affiche un message clair en cas d’erreur 500', async () => {
        storeSimule.load.mockReturnValue(
            throwError(() => new HttpErrorResponse({ status: 500, statusText: 'Erreur' })),
        );
        const el = await creer();
        expect(el.querySelector('[role=alert]')?.textContent).toContain(
            'Impossible de charger les tâches (erreur 500).',
        );
    });

    it('distingue un serveur injoignable (status 0)', async () => {
        storeSimule.load.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 0 })));
        const el = await creer();
        expect(el.querySelector('[role=alert]')?.textContent).toContain('serveur injoignable');
    });
});
