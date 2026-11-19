import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    map,
    Observable,
    of,
    switchMap,
    tap,
} from 'rxjs';
import { API_URL } from '../core/api-url';
import { Task } from '../models/task';

/**
 * TP 6, pour aller plus loin : recherche dans l'API avec debounceTime et switchMap.
 *
 * La saisie est un flux (valueChanges). Chaque opérateur transforme le flux :
 *   saisie → map(trim) → debounceTime(300) → distinctUntilChanged → switchMap(requête)
 *
 * - debounceTime(300) : attend 300 ms sans frappe avant de laisser passer.
 *   En tapant « angular », une seule requête part au lieu de sept.
 * - distinctUntilChanged : ignore une valeur identique à la précédente.
 * - switchMap : lance la requête et ANNULE la précédente si une nouvelle valeur
 *   arrive. Les réponses ne peuvent pas arriver dans le désordre.
 * - toSignal : transforme le résultat en signal ; l'abonnement suit la vie du composant.
 */
@Component({
    selector: 'app-recherche',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './recherche.html',
})
export class Recherche {
    private readonly http = inject(HttpClient);
    private readonly api = inject(API_URL);

    protected readonly terme = new FormControl('', { nonNullable: true });
    protected readonly enCours = signal(false);
    protected readonly erreur = signal<string | null>(null);

    protected readonly resultats = toSignal(
        this.terme.valueChanges.pipe(
            map((t) => t.trim()),
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((t) => (t.length < 2 ? of(null) : this.chercher(t))),
        ),
        { initialValue: null },
    );

    /** GET /todos?q=… (JSONPlaceholder cherche le texte dans tous les champs). */
    private chercher(t: string): Observable<Task[]> {
        this.enCours.set(true);
        this.erreur.set(null);
        return this.http.get<Task[]>(`${this.api}/todos`, { params: { q: t, _limit: 20 } }).pipe(
            tap(() => this.enCours.set(false)),
            // catchError DANS le switchMap : une erreur ne tue que cette requête,
            // pas tout le flux. Placé après switchMap, il arrêterait la recherche.
            catchError(() => {
                this.enCours.set(false);
                this.erreur.set('La recherche a échoué. Vérifiez votre connexion.');
                return of([]);
            }),
        );
    }
}
