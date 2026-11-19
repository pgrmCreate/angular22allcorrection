import { Component, signal } from '@angular/core';
import {
    email,
    form,
    FormField,
    maxLength,
    minLength,
    pattern,
    required,
    validate,
} from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { Membre } from '../../models/member';
import { NOMS_INTERDITS } from '../interdit';

const MEMBRE_VIDE: Membre = { nom: '', email: '', telephone: '' };

/**
 * TP 3, pour aller plus loin : le même formulaire avec Signal Forms
 * (@angular/forms/signals, stable depuis Angular 22).
 *
 * 1. Le modèle est un signal ordinaire : c'est LA valeur du formulaire, pas une copie.
 * 2. form(modele, schema) construit un arbre de champs qui a la forme du modèle :
 *    memberForm.nom, memberForm.email, memberForm.telephone.
 * 3. Les règles sont écrites dans le schéma, avec leur message d'erreur.
 * 4. Dans le template, [formField] relie un <input> à un champ.
 */
@Component({
    selector: 'app-member-form-signal',
    imports: [FormField, RouterLink],
    templateUrl: './member-form-signal.html',
})
export class MemberFormSignal {
    protected readonly membre = signal<Membre>({ ...MEMBRE_VIDE });

    protected readonly memberForm = form(this.membre, (s) => {
        required(s.nom, { message: 'Le nom est obligatoire.' });
        minLength(s.nom, 3, { message: 'Au moins 3 caractères.' });
        maxLength(s.nom, 20, { message: '20 caractères maximum.' });
        // Règle personnalisée : validate() renvoie null ou une erreur { kind, message }.
        validate(s.nom, ({ value }) =>
            NOMS_INTERDITS.includes(value().trim().toLowerCase())
                ? { kind: 'interdit', message: `Le nom « ${value()} » est réservé.` }
                : null,
        );

        required(s.email, { message: "L'e-mail est obligatoire." });
        email(s.email, { message: 'Adresse e-mail invalide.' });

        pattern(s.telephone, /^06\d{8}$/, {
            message: 'Format attendu : 06 suivi de 8 chiffres, sans espace (0612345678).',
        });
    });

    protected readonly membres = signal<Membre[]>([]);

    protected ajouter(): void {
        if (this.memberForm().invalid()) {
            return;
        }
        // Le modèle EST la valeur du formulaire : on lit directement le signal.
        this.membres.update((liste) => [...liste, this.membre()]);
        // reset(valeur) remplace la valeur ET remet touched/dirty à false.
        this.memberForm().reset({ ...MEMBRE_VIDE });
    }
}
