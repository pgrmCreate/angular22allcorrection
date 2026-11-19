import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Auth } from './auth';
import { authGuard } from './auth-guard';

/** Petits composants de test : on vérifie le routage, pas les vraies pages. */
@Component({ template: 'Équipe' })
class FakeTeam {}

@Component({ template: 'Connexion' })
class FakeLogin {}

/**
 * TP 7, objectif 5 : RouterTestingHarness navigue réellement (garde comprise)
 * et affiche le composant de la route atteinte.
 */
describe('authGuard', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideRouter([
                    { path: 'equipe', component: FakeTeam, canActivate: [authGuard] },
                    { path: 'login', component: FakeLogin },
                ]),
            ],
        });
    });

    it('redirige vers /login sans connexion, en gardant la page demandée', async () => {
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/equipe');
        expect(harness.routeNativeElement?.textContent).toContain('Connexion');
        expect(TestBed.inject(Router).url).toBe('/login?retour=%2Fequipe');
    });

    it('laisse passer un utilisateur connecté', async () => {
        TestBed.inject(Auth).login('jb');
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/equipe');
        expect(harness.routeNativeElement?.textContent).toContain('Équipe');
    });
});
