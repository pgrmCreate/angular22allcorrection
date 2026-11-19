import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Noms réservés, refusés par le formulaire des membres (TP 3, pour aller plus loin). */
export const NOMS_INTERDITS = ['admin', 'root'];

/**
 * Validateur personnalisé pour les Reactive Forms.
 *
 * Un validateur est une simple fonction : elle reçoit le contrôle et renvoie
 * null si la valeur est correcte, sinon un objet d'erreur. La clé de l'objet
 * (« interdit ») est celle qu'on teste dans le template avec hasError('interdit').
 *
 * interdit() est une « fabrique » : elle reçoit la liste des mots et RENVOIE le
 * validateur. On l'utilise donc avec des parenthèses : interdit(['admin', 'root']).
 *
 * Comparaison exacte, sans tenir compte de la casse ni des espaces :
 * « Admin » est refusé, « Administrateur » est accepté. Pour refuser tout nom qui
 * CONTIENT un mot interdit, remplacer === par v.includes(m).
 */
export function interdit(mots: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const v = String(control.value ?? '').trim().toLowerCase();
        const trouve = mots.find((m) => v === m);
        return trouve ? { interdit: { mot: trouve } } : null;
    };
}
