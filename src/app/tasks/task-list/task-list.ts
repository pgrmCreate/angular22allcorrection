import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { TaskStore } from '../../core/task-store';
import { Task } from '../../models/task';
import { Carte } from '../../shared/carte';
import { Filtre, FiltreTache } from '../filtre/filtre';
import { TaskAdd } from '../task-add/task-add';
import { TaskItem } from '../task-item/task-item';

/**
 * Page /tasks : la liste des tâches.
 *
 * TP 5 : lit et modifie les tâches via TaskStore.
 * TP 6 : demande le chargement depuis l'API à l'initialisation, et affiche un
 * message clair en cas d'erreur réseau (pour aller plus loin).
 */
@Component({
    selector: 'app-task-list',
    imports: [Carte, TaskAdd, Filtre, TaskItem],
    templateUrl: './task-list.html',
    styleUrl: './task-list.css',
})
export class TaskList implements OnInit {
    protected readonly store = inject(TaskStore);
    private readonly destroyRef = inject(DestroyRef);

    protected readonly filtre = signal<FiltreTache>('toutes');
    protected readonly chargement = signal(false);
    protected readonly erreur = signal<string | null>(null);

    protected readonly visibles = computed(() => {
        const filtre = this.filtre();
        return this.store
            .tasks()
            .filter((t) =>
                filtre === 'toutes' ? true : filtre === 'actives' ? !t.completed : t.completed,
            );
    });

    ngOnInit(): void {
        this.charger(this.store.load());
    }

    protected recharger(): void {
        this.charger(this.store.reload());
    }

    private charger(requete: Observable<Task[]>): void {
        this.chargement.set(true);
        this.erreur.set(null);
        requete
            // Désabonnement automatique si l'on quitte la page avant la réponse.
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => this.chargement.set(false),
                error: (err: HttpErrorResponse) => {
                    this.chargement.set(false);
                    // status 0 : pas de réponse du tout (réseau coupé, CORS…).
                    this.erreur.set(
                        err.status === 0
                            ? 'Impossible de charger les tâches : serveur injoignable.'
                            : `Impossible de charger les tâches (erreur ${err.status}).`,
                    );
                },
            });
    }
}
