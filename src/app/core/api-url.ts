import { InjectionToken } from '@angular/core';

/**
 * TP 5, pour aller plus loin : un jeton d'injection avec une valeur par défaut.
 *
 * Une simple chaîne (une URL) n'est pas une classe : on ne peut pas écrire
 * inject(string). Un InjectionToken sert d'identifiant pour l'injecter :
 *     private readonly api = inject(API_URL);
 *
 * factory donne la valeur par défaut ; providedIn: 'root' la rend disponible
 * partout sans rien déclarer. Pour la remplacer (autre serveur, tests) :
 *     { provide: API_URL, useValue: 'http://localhost:3000' }
 *
 * Le jeton sera utilisé au TP 6 pour appeler l'API JSONPlaceholder.
 */
export const API_URL = new InjectionToken<string>('API_URL', {
    providedIn: 'root',
    factory: () => 'https://jsonplaceholder.typicode.com',
});
