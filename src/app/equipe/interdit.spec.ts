import { FormControl } from '@angular/forms';
import { interdit } from './interdit';

/** TP 7, pour aller plus loin : un validateur est une fonction, facile à tester seule. */
describe('interdit()', () => {
    const valider = interdit(['admin', 'root']);

    it('refuse un nom interdit, sans tenir compte de la casse ni des espaces', () => {
        expect(valider(new FormControl(' Admin '))).toEqual({ interdit: { mot: 'admin' } });
        expect(valider(new FormControl('ROOT'))).toEqual({ interdit: { mot: 'root' } });
    });

    it('accepte les autres noms, même s’ils contiennent un mot interdit', () => {
        expect(valider(new FormControl('Ada'))).toBeNull();
        expect(valider(new FormControl('Administrateur'))).toBeNull();
    });
});
