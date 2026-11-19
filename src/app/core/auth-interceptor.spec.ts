import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Auth } from './auth';
import { authInterceptor } from './auth-interceptor';

/** TP 7, pour aller plus loin : l'intercepteur, testé à travers HttpClient. */
describe('authInterceptor', () => {
    let http: HttpTestingController;
    let client: HttpClient;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([authInterceptor])),
                provideHttpClientTesting(),
            ],
        });
        http = TestBed.inject(HttpTestingController);
        client = TestBed.inject(HttpClient);
    });

    afterEach(() => http.verify());

    it('n’ajoute pas d’en-tête sans connexion', () => {
        client.get('/todos').subscribe();
        const req = http.expectOne('/todos');
        expect(req.request.headers.has('Authorization')).toBe(false);
        req.flush([]);
    });

    it('ajoute Authorization: Bearer … une fois connecté', () => {
        TestBed.inject(Auth).login('jb');
        client.get('/todos').subscribe();
        const req = http.expectOne('/todos');
        expect(req.request.headers.get('Authorization')).toBe(`Bearer ${btoa('jb')}`);
        req.flush([]);
    });
});
