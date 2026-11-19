import { defineConfig } from 'cypress';

/**
 * TP 8 : configuration créée par ng add @cypress/schematic.
 *
 * baseUrl : cy.visit('/tasks') ouvre http://localhost:4200/tasks.
 * La partie « component » (tests de composants avec webpack) a été retirée :
 * un projet Angular 22 compile avec esbuild et ne l'utiliserait pas sans
 * dépendances supplémentaires.
 */
export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:4200',
    },
});
