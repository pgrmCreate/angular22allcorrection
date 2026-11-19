import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { ConsoleLogger, Logger } from './core/logger';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes, withComponentInputBinding()),
        // TP 5, pour aller plus loin : partout où l'on injecte Logger, l'injecteur
        // racine fournit un ConsoleLogger. Retirer cette ligne pour revenir au Logger simple.
        { provide: Logger, useClass: ConsoleLogger },
    ],
};
