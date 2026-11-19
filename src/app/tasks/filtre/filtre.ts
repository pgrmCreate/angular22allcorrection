import { Component, model } from '@angular/core';

export type FiltreTache = 'toutes' | 'actives' | 'terminees';

/**
 * TP 4, objectif 3 : choix du filtre (toutes / actives / terminées).
 *
 * model() crée une entrée MODIFIABLE par l'enfant. Quand Filtre appelle
 * value.set(…), le parent est prévenu automatiquement (sortie valueChange).
 * Le parent utilise la liaison bidirectionnelle : <app-filtre [(value)]="filtre" />.
 *
 * Template et styles « inline » : pratique pour un petit composant
 * (ng g c tasks/filtre --inline-template --inline-style).
 */
@Component({
    selector: 'app-filtre',
    template: `
        <div class="filtre" role="group" aria-label="Filtrer les tâches">
            @for (f of filtres; track f.valeur) {
                <button
                    type="button"
                    [class.actif]="value() === f.valeur"
                    [attr.aria-pressed]="value() === f.valeur"
                    (click)="value.set(f.valeur)"
                >
                    {{ f.libelle }}
                </button>
            }
        </div>
    `,
    styles: `
        .filtre {
            display: flex;
            gap: 6px;
            margin: 12px 0;
        }
        button {
            color: var(--bleu);
            background: #fff;
            border: 1px solid var(--bleu);
        }
        button.actif {
            color: #fff;
            background: var(--bleu);
        }
    `,
})
export class Filtre {
    readonly value = model<FiltreTache>('toutes');

    /** as const : TypeScript garde les valeurs exactes ('toutes'…), pas un simple string. */
    protected readonly filtres = [
        { valeur: 'toutes', libelle: 'Toutes' },
        { valeur: 'actives', libelle: 'Actives' },
        { valeur: 'terminees', libelle: 'Terminées' },
    ] as const;
}
