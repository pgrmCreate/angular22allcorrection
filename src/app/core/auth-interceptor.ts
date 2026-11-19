import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from './auth';

/**
 * TP 6, objectif 6 : ajoute « Authorization: Bearer <jeton> » à chaque requête
 * une fois l'utilisateur connecté.
 *
 * Les requêtes sont immuables : on les modifie avec clone(). Un intercepteur
 * s'applique à tout ce qui passe par HttpClient, y compris httpResource.
 * Vérification : onglet Réseau des outils du navigateur, en-têtes de /todos.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = inject(Auth).token();
    if (!token) {
        return next(req);
    }
    return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
