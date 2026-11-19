import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { Task } from '../models/task';
import { TaskStore } from './task-store';

/**
 * TP 6, objectif 4 : charge la tâche AVANT d'afficher /tasks/:id.
 *
 * Le composant reçoit la tâche prête à l'emploi dans son entrée « task » (clé
 * de resolve: { task: taskResolver }, grâce à withComponentInputBinding()).
 *
 * 1. Si la tâche est déjà dans le store, on la renvoie directement : c'est le cas
 *    des tâches ajoutées localement, que l'API ne connaît pas (elle ne conserve rien).
 * 2. Sinon on la demande à l'API (GET /todos/:id).
 * 3. En cas d'erreur (404…), RedirectCommand renvoie vers la liste au lieu
 *    d'afficher une page cassée.
 */
export const taskResolver: ResolveFn<Task> = (route) => {
    const store = inject(TaskStore);
    const router = inject(Router);
    const id = Number(route.paramMap.get('id')); // les paramètres sont toujours des chaînes

    const locale = store.tasks().find((t) => t.id === id);
    if (locale) {
        return locale;
    }
    return store
        .getById(id)
        .pipe(catchError(() => of(new RedirectCommand(router.parseUrl('/tasks')))));
};
