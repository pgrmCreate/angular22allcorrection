/**
 * TP 8, objectifs 3 et 4 : la liste et l'ajout, avec la VRAIE API JSONPlaceholder.
 *
 * Cypress vide le localStorage entre deux tests (testIsolation) : chaque test
 * repart donc de l'API, sans les tâches ajoutées par le test précédent.
 */
describe('Liste des tâches (API réelle)', () => {
    beforeEach(() => {
        cy.visit('/tasks');
    });

    it('affiche le titre de la page', () => {
        cy.contains('h2', 'Mes tâches');
        cy.title().should('eq', 'Mes tâches');
    });

    it('affiche les 10 tâches venant de l’API', () => {
        // .should réessaie jusqu'au délai (4 s) : pas besoin d'attente explicite.
        cy.get('app-task-item').should('have.length', 10);
    });

    it('ajoute une tâche puis la passe à l’état « terminée »', () => {
        // On attend la fin du chargement : sinon la réponse de l'API pourrait
        // arriver après l'ajout et remplacer la liste.
        cy.get('app-task-item').should('have.length', 10);

        // data-cy : des sélecteurs dédiés aux tests, indépendants du design.
        cy.get('[data-cy=nouvelle-tache]').type('Préparer la démo');
        cy.get('[data-cy=ajouter]').click();

        cy.get('app-task-item').should('have.length', 11);
        cy.contains('app-task-item', 'Préparer la démo')
            .should('be.visible')
            .find('input[type=checkbox]')
            .check();

        // La directive appDone pose la classe « done ».
        cy.contains('app-task-item', 'Préparer la démo').find('li').should('have.class', 'done');
    });

    it('ajoute une tâche avec la touche Entrée', () => {
        cy.get('app-task-item').should('have.length', 10);
        cy.get('[data-cy=nouvelle-tache]').type('Relire les supports{enter}');
        cy.contains('app-task-item', 'Relire les supports');
        // Le champ est vidé et garde le focus.
        cy.get('[data-cy=nouvelle-tache]').should('have.value', '').and('have.focus');
    });
});
