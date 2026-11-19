import { Directive, input } from '@angular/core';

/**
 * Directive d'attribut [appDone] : signale visuellement une tâche terminée.
 *
 *     <li [appDone]="task.completed">…</li>
 *
 * - Le sélecteur entre crochets cible un attribut, pas une balise.
 * - L'entrée porte le même nom que le sélecteur : on écrit donc [appDone]="…".
 * - La propriété host remplace @HostBinding : la classe CSS « done » est posée
 *   sur l'élément hôte quand appDone() vaut true.
 *
 * Une directive n'a pas de styles : la classe « done » est stylée dans le composant
 * qui affiche la liste (task-list.css, puis task-item au TP 4).
 *
 * Nom de classe : le CLI 22 génère « Done » (fichier done.ts), sans le suffixe
 * « Directive » des anciennes versions. Les deux noms fonctionnent.
 */
@Directive({
    selector: '[appDone]',
    host: {
        '[class.done]': 'appDone()',
    },
})
export class Done {
    readonly appDone = input(false);
}
