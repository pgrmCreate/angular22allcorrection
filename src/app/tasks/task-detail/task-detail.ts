import { httpResource } from '@angular/common/http';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { API_URL } from '../../core/api-url';
import { TaskStore } from '../../core/task-store';
import { Task, User } from '../../models/task';
import { Carte } from '../../shared/carte';

/**
 * Page /tasks/:id, chargée à la demande (loadComponent dans app.routes.ts) :
 * son code est dans un fichier JavaScript séparé, téléchargé à la première visite.
 *
 * TP 6, objectif 4 :
 * - la tâche arrive du résolveur, dans l'entrée task (withComponentInputBinding) ;
 * - l'auteur est chargé avec httpResource (GET /users/:userId).
 */
@Component({
    selector: 'app-task-detail',
    imports: [Carte, RouterLink],
    templateUrl: './task-detail.html',
})
export class TaskDetail {
    private readonly api = inject(API_URL);
    private readonly store = inject(TaskStore);

    /** Clé « task » du resolve de la route. */
    readonly task = input.required<Task>();

    /**
     * La tâche résolue est une photo prise à la navigation. Pour refléter une
     * modification faite ici (bouton ci-dessous), on relit la version du store.
     * TaskDetail est un « composant éloigné » qui partage l'état grâce au service.
     */
    protected readonly courante = computed(
        () => this.store.tasks().find((t) => t.id === this.task().id) ?? this.task(),
    );

    /**
     * httpResource : la requête part automatiquement et son état est exposé en
     * signaux (isLoading, hasValue, value, error). Si task() change, une nouvelle
     * requête part. Les intercepteurs s'appliquent (httpResource utilise HttpClient).
     */
    protected readonly author = httpResource<User>(
        () => `${this.api}/users/${this.task().userId}`,
    );

    protected basculer(): void {
        this.store.toggle(this.task().id);
    }
}
