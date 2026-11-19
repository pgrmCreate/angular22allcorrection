import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe « truncate » : coupe un texte trop long et ajoute un suffixe.
 *
 *     {{ task.title | truncate }}               30 caractères, suffixe « … »
 *     {{ task.title | truncate: 40 }}           40 caractères
 *     {{ task.title | truncate: 20 : ' [...]' }} suffixe personnalisé
 *
 * Un pipe est « pur » par défaut : Angular ne rappelle transform() que si l'une
 * de ses entrées change. Il ne modifie jamais la donnée d'origine.
 * Pour l'utiliser, il faut l'ajouter aux imports du composant.
 */
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
    transform(value: string | null | undefined, max = 30, suffix = '…'): string {
        // On accepte null/undefined pour pouvoir écrire {{ valeurPasEncoreChargee | truncate }}.
        if (!value) {
            return '';
        }
        // trimEnd() évite « Préparer la … » (espace avant le suffixe).
        return value.length > max ? value.slice(0, max).trimEnd() + suffix : value;
    }
}
