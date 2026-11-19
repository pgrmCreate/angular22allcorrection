import { TruncatePipe } from './truncate-pipe';

/**
 * TP 7, objectif 1. Un pipe est une simple classe : pas besoin de TestBed,
 * on l'instancie avec new et on appelle transform().
 */
describe('TruncatePipe', () => {
    let pipe: TruncatePipe;

    beforeEach(() => {
        pipe = new TruncatePipe();
    });

    it('laisse un texte court intact', () => {
        expect(pipe.transform('Angular', 10)).toBe('Angular');
    });

    it('laisse intact un texte qui fait exactement la longueur maximale', () => {
        expect(pipe.transform('Angular', 7)).toBe('Angular');
    });

    it('coupe un texte long et ajoute « … »', () => {
        expect(pipe.transform('Développement Angular', 11)).toBe('Développeme…');
    });

    it("retire l'espace avant le suffixe", () => {
        // 'Préparer la démo'.slice(0, 12) === 'Préparer la ' → trimEnd → 'Préparer la'
        expect(pipe.transform('Préparer la démo', 12)).toBe('Préparer la…');
    });

    it('utilise 30 caractères par défaut', () => {
        const texte = 'a'.repeat(40);
        expect(pipe.transform(texte)).toBe('a'.repeat(30) + '…');
    });

    it('accepte un suffixe personnalisé', () => {
        expect(pipe.transform('Développement Angular', 11, ' [...]')).toBe('Développeme [...]');
    });

    it('renvoie une chaîne vide pour null ou undefined', () => {
        expect(pipe.transform(null)).toBe('');
        expect(pipe.transform(undefined)).toBe('');
    });
});
