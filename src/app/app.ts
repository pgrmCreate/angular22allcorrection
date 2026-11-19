import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from './core/auth';

/**
 * Composant racine.
 *
 * TP 6 : App devient la « coquille » de l'application : un en-tête avec la
 * navigation, un <router-outlet /> où s'affiche la page de l'URL courante, et un
 * outlet nommé « aide » pour le panneau d'aide.
 */
@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './app.html',
    styleUrl: './app.css',
})
export class App {
    protected readonly title = signal('TaskFlow');
    protected readonly auth = inject(Auth);
    private readonly router = inject(Router);

    protected deconnecter(): void {
        this.auth.logout();
        this.router.navigateByUrl('/tasks');
    }
}
