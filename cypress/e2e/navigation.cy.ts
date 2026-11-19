/** TP 8, objectif 5 : la garde, vue depuis le navigateur. */
describe('Accès à la page Équipe', () => {
    it('redirige /equipe vers /login sans connexion', () => {
        cy.visit('/equipe');
        cy.url().should('include', '/login');
        cy.url().should('include', 'retour=%2Fequipe');
        cy.contains('h2', 'Connexion');
    });

    it('revient sur /equipe après connexion', () => {
        cy.visit('/equipe');
        cy.get('[data-cy=login-nom]').type('Jean-Baptiste');
        cy.get('[data-cy=login-valider]').click();
        cy.location('pathname').should('eq', '/equipe');
        cy.contains('h2', "Membres de l'équipe");
    });
});
