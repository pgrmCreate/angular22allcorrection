import { expect, test } from '@playwright/test';

/**
 * Le test « ajoute une tâche puis la termine » de cypress/e2e/taches.cy.ts,
 * réécrit avec Playwright pour comparer (voir docs/TP8.md).
 *
 * Différences principales :
 * - le code est asynchrone : chaque action s'écrit avec await ;
 * - expect(...) réessaie jusqu'au délai, comme .should() dans Cypress ;
 * - les locators sont paresseux : ils cherchent l'élément au moment de l'action.
 */
test.describe('Ajout d’une tâche (Playwright)', () => {
    test('ajoute une tâche puis la passe à l’état « terminée »', async ({ page }) => {
        await page.goto('/tasks');
        const taches = page.locator('app-task-item');
        await expect(taches).toHaveCount(10); // fin du chargement depuis l'API

        await page.getByTestId('nouvelle-tache').fill('Préparer la démo');
        await page.getByTestId('ajouter').click();

        const tache = taches.filter({ hasText: 'Préparer la démo' });
        await expect(tache).toBeVisible();
        await tache.getByRole('checkbox').check();
        await expect(tache.locator('li')).toHaveClass(/done/);
    });

    test('affiche les tâches d’une API simulée', async ({ page }) => {
        // Équivalent de cy.intercept('GET', '**/todos*', { fixture: 'todos.json' }).
        await page.route('**/todos?*', (route) =>
            route.fulfill({ path: 'cypress/fixtures/todos.json' }),
        );
        await page.goto('/tasks');
        await expect(page.locator('app-task-item')).toHaveCount(3);
    });
});
