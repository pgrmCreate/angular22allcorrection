import { Service } from '@angular/core';

/**
 * TP 5, pour aller plus loin : un service de journalisation.
 *
 * Logger est l'implémentation par défaut : @Service() la fournit automatiquement
 * à la racine. Les composants et services écrivent inject(Logger) sans savoir
 * quelle classe ils vont recevoir.
 */
@Service()
export class Logger {
    log(message: string): void {
        console.log(message);
    }
}

/**
 * Une autre implémentation : horodatage et couleur dans la console.
 *
 * Elle est choisie dans app.config.ts avec :
 *     { provide: Logger, useClass: ConsoleLogger }
 * Partout où l'on demande Logger, l'injecteur fournit alors un ConsoleLogger.
 *
 * autoProvided: false : ce service n'est PAS fourni automatiquement à la racine.
 * Il n'existe que là où on le déclare dans un tableau providers.
 *
 * PIÈGE : sans décorateur, une sous-classe hériterait de la « fabrique » de Logger,
 * et useClass créerait… un Logger. Il faut décorer la sous-classe.
 */
@Service({ autoProvided: false })
export class ConsoleLogger extends Logger {
    override log(message: string): void {
        const heure = new Date().toLocaleTimeString('fr-FR');
        console.log(`%c[TaskFlow ${heure}]`, 'color: #00a9b0; font-weight: bold', message);
    }
}
