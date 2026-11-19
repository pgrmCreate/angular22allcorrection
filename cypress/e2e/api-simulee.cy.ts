/**
 * TP 8, pour aller plus loin : l'API simulée avec cy.intercept.
 *
 * - Des données stables : le test ne dépend plus du réseau ni de l'API réelle.
 * - Des cas difficiles à provoquer en vrai : erreur 500, liste vide, lenteur.
 * '**' + '/todos*' : n'importe quel domaine, /todos suivi de n'importe quoi (?_limit=10).
 */
describe('Liste des tâches (API simulée)', () => {
    it('affiche les 3 tâches de la fixture', () => {
        cy.intercept('GET', '**/todos*', { fixture: 'todos.json' }).as('todos');
        cy.visit('/tasks');

        // cy.wait('@alias') attend la requête et permet d'en vérifier le contenu.
        cy.wait('@todos').its('request.url').should('include', '_limit=10');
        cy.get('app-task-item').should('have.length', 3);
        cy.contains('h2', '2 restantes');
    });

    it('affiche un message en cas d’erreur 500', () => {
        cy.intercept('GET', '**/todos*', { statusCode: 500 });
        cy.visit('/tasks');
        cy.contains('[role=alert]', 'Impossible de charger les tâches');
    });

    it('affiche un message si le serveur est injoignable', () => {
        cy.intercept('GET', '**/todos*', { forceNetworkError: true });
        cy.visit('/tasks');
        cy.contains('[role=alert]', 'serveur injoignable');
    });
});
