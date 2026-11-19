import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../core/auth';

/**
 * Page /login.
 *
 * retour vient du paramètre de requête ?retour=/equipe posé par la garde, grâce à
 * withComponentInputBinding(). Si le paramètre est absent, le routeur met l'entrée
 * à undefined (même avec une valeur par défaut) : d'où le « ?? '/tasks' ».
 */
@Component({
    selector: 'app-login',
    template: `
        <h2>Connexion</h2>
        @if (auth.isLogged()) {
            <p>Vous êtes connecté en tant que {{ auth.utilisateur() }}.</p>
        } @else {
            <p class="aide">Démonstration : n'importe quel nom suffit, aucun mot de passe.</p>
            <form class="ligne" (submit)="$event.preventDefault(); connecter(nom.value)">
                <input #nom placeholder="Votre nom" aria-label="Votre nom" required data-cy="login-nom">
                <button type="submit" data-cy="login-valider">Se connecter</button>
            </form>
        }
    `,
    styles: `
        .ligne {
            display: flex;
            gap: 8px;
        }
    `,
})
export class Login {
    protected readonly auth = inject(Auth);
    private readonly router = inject(Router);

    readonly retour = input<string>();

    protected connecter(nom: string): void {
        if (!nom.trim()) {
            return;
        }
        this.auth.login(nom.trim());
        this.router.navigateByUrl(this.retour() ?? '/tasks');
    }
}
