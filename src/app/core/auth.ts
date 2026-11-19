import { computed, Service, signal } from '@angular/core';

/**
 * TP 6 : l'état de connexion.
 *
 * JSONPlaceholder n'a pas de vraie authentification : login() fabrique un faux
 * jeton à partir du nom. Dans une vraie application, le jeton est renvoyé par
 * le serveur (POST /login) et, idéalement, rangé dans un cookie HttpOnly.
 * Ici il reste en mémoire : il disparaît au rechargement de la page.
 */
@Service()
export class Auth {
    private readonly _utilisateur = signal<string | null>(null);
    private readonly _token = signal<string | null>(null);

    readonly utilisateur = this._utilisateur.asReadonly();
    readonly token = this._token.asReadonly();
    readonly isLogged = computed(() => this._token() !== null);

    login(nom: string): void {
        this._utilisateur.set(nom);
        // btoa n'accepte que l'ASCII : encodeURIComponent protège les accents.
        this._token.set(btoa(encodeURIComponent(nom)));
    }

    logout(): void {
        this._utilisateur.set(null);
        this._token.set(null);
    }
}
