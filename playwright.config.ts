import { defineConfig } from '@playwright/test';

/**
 * TP 8, pour aller plus loin : le même test d'ajout avec Playwright.
 *
 * - webServer : Playwright démarre lui-même `npm start` (ou réutilise un ng serve
 *   déjà lancé) et attend que l'URL réponde. Avec Cypress, il faut un outil en plus
 *   (start-server-and-test) ou un second terminal.
 * - channel: 'chrome' utilise le Chrome installé sur le poste. Pour le Chromium de
 *   Playwright à la place : npx playwright install chromium, puis retirer channel.
 * - testIdAttribute : page.getByTestId('ajouter') cherche [data-cy="ajouter"],
 *   les mêmes repères que les tests Cypress.
 */
export default defineConfig({
    testDir: './playwright',
    use: {
        baseURL: 'http://localhost:4200',
        channel: 'chrome',
        testIdAttribute: 'data-cy',
    },
    webServer: {
        command: 'npm start',
        url: 'http://localhost:4200',
        reuseExistingServer: true,
    },
});
