import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { API_URL } from './core/api-url';
import { authInterceptor } from './core/auth-interceptor';
import { ConsoleLogger, Logger } from './core/logger';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        // withComponentInputBinding : paramètres (:id), query params (?retour=)
        // et données résolues arrivent dans les input() des composants routés.
        provideRouter(routes, withComponentInputBinding()),
        // TP 6, objectif 1 : HttpClient configuré avec notre intercepteur.
        // (Depuis Angular 21, HttpClient est injectable sans rien déclarer ;
        // provideHttpClient sert à le configurer. Fetch est utilisé par défaut.)
        provideHttpClient(withInterceptors([authInterceptor])),
        // TP 6, objectif 1 : le jeton a déjà une valeur par défaut (api-url.ts).
        // La fournir ici la rend visible et facile à changer.
        { provide: API_URL, useValue: 'https://jsonplaceholder.typicode.com' },
        { provide: Logger, useClass: ConsoleLogger },
    ],
};
