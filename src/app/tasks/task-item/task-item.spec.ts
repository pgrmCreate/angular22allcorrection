import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Task } from '../../models/task';
import { TaskItem } from './task-item';

/**
 * TP 7, objectif 4 : tester un composant.
 *
 * - setInput() fournit l'entrée obligatoire « task », comme le ferait le parent.
 * - On s'abonne aux sorties avec une fonction espionne vi.fn().
 * - provideRouter([]) : le template contient un routerLink.
 */
describe('TaskItem', () => {
    let fixture: ComponentFixture<TaskItem>;
    let el: HTMLElement;
    const task: Task = { id: 7, userId: 1, title: 'Écrire les tests', completed: false };

    beforeEach(async () => {
        TestBed.configureTestingModule({ imports: [TaskItem], providers: [provideRouter([])] });
        fixture = TestBed.createComponent(TaskItem);
        fixture.componentRef.setInput('task', task);
        await fixture.whenStable();
        el = fixture.nativeElement;
    });

    it('affiche le titre et un lien vers le détail', () => {
        const lien = el.querySelector('a')!;
        expect(lien.textContent).toContain('Écrire les tests');
        expect(lien.getAttribute('href')).toBe('/tasks/7');
    });

    it('émet removed avec l’identifiant au clic sur Supprimer', () => {
        const espion = vi.fn();
        fixture.componentInstance.removed.subscribe(espion);
        el.querySelector('button')!.click();
        expect(espion).toHaveBeenCalledWith(7);
    });

    it('émet toggled quand on coche la case', () => {
        const espion = vi.fn();
        fixture.componentInstance.toggled.subscribe(espion);
        el.querySelector<HTMLInputElement>('input[type=checkbox]')!.click();
        expect(espion).toHaveBeenCalledWith(7);
    });

    it('pose la classe done sur une tâche terminée', async () => {
        fixture.componentRef.setInput('task', { ...task, completed: true });
        await fixture.whenStable();
        expect(el.querySelector('li')!.classList).toContain('done');
    });
});
