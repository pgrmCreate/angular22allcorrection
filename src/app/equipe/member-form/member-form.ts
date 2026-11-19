import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Membre } from '../../models/member';
import { interdit, NOMS_INTERDITS } from '../interdit';

/**
 * TP 3 : formulaire des membres de l'équipe, en Reactive Forms avec FormBuilder.
 *
 * La STRUCTURE du formulaire (champs, valeurs initiales, règles) est déclarée
 * dans la classe. Le template se contente de relier chaque <input> à son contrôle
 * avec formControlName.
 */
@Component({
    selector: 'app-member-form',
    // ReactiveFormsModule fournit [formGroup], formControlName et (ngSubmit).
    imports: [ReactiveFormsModule],
    templateUrl: './member-form.html',
})
export class MemberForm {
    /**
     * .nonNullable : les champs ne valent jamais null. Sans cette option, reset()
     * remettrait null dans chaque champ et le type serait string | null.
     */
    private readonly fb = inject(FormBuilder).nonNullable;

    /** Chaque champ : [valeur initiale, validateurs]. */
    protected readonly form = this.fb.group({
        nom: [
            '',
            [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(20),
                interdit(NOMS_INTERDITS), // pour aller plus loin : validateur personnalisé
            ],
        ],
        // Validators.email suit la norme HTML : « jb@test » est accepté (pas de domaine obligatoire).
        email: ['', [Validators.required, Validators.email]],
        // Pas de required : le téléphone est facultatif, mais s'il est saisi il doit
        // respecter le format. pattern ne contrôle que les valeurs non vides.
        telephone: ['', Validators.pattern(/^06\d{8}$/)],
    });

    /** Membres ajoutés. Un signal : la liste s'affiche dès qu'elle change. */
    protected readonly membres = signal<Membre[]>([]);

    protected ajouter(): void {
        // Le bouton est désactivé si le formulaire est invalide ; cette garde protège
        // aussi l'envoi par la touche Entrée. markAllAsTouched() affiche toutes les erreurs.
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        // getRawValue() renvoie un objet typé { nom: string; email: string; telephone: string }.
        const membre: Membre = this.form.getRawValue();
        this.membres.update((liste) => [...liste, membre]);
        // Avec nonNullable, reset() revient aux valeurs initiales ('') et remet touched à false.
        this.form.reset();
    }
}
