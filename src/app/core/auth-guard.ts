import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './auth';

/**
 * TP 6, objectif 5 : garde fonctionnelle qui protège /equipe.
 *
 * Elle renvoie true (accès autorisé) ou une UrlTree (redirection). Le paramètre
 * « retour » permet à la page de connexion de revenir ensuite sur la page demandée.
 * Renvoyer une UrlTree plutôt que d'appeler router.navigate() : le routeur annule
 * proprement la navigation en cours avant de rediriger.
 *
 * Une garde améliore l'expérience, pas la sécurité : le code reste téléchargeable.
 * C'est l'API qui doit refuser les accès non autorisés.
 */
export const authGuard: CanActivateFn = (route, state) => {
    const auth = inject(Auth);
    const router = inject(Router);
    return auth.isLogged()
        ? true
        : router.createUrlTree(['/login'], { queryParams: { retour: state.url } });
};
