# TP 3 – Formulaire des membres de l'équipe

Tag Git : `tp3`. Fichiers dans [src/app/equipe](../src/app/equipe).

## 1 et 2. `MemberForm` avec `FormBuilder`

[member-form.ts](../src/app/equipe/member-form/member-form.ts)

```ts
private readonly fb = inject(FormBuilder).nonNullable;
protected readonly form = this.fb.group({
    nom: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20), interdit(NOMS_INTERDITS)]],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', Validators.pattern(/^06\d{8}$/)],
});
```

Points à expliquer :

- `ReactiveFormsModule` dans les `imports` du composant, sinon `[formGroup]` est inconnu.
- `.nonNullable` : les champs sont typés `string` (et non `string | null`) et `reset()` remet `''`.
- Le téléphone n'est pas obligatoire : `pattern` ne contrôle que les valeurs non vides. Pour le rendre
  obligatoire, ajouter `Validators.required`.
- Le motif `/^06\d{8}$/` : `^` et `$` ancrent le début et la fin, sinon « xx0612345678xx » passerait.
  À tester dans la console : `/^06\d{8}$/.test('0612345678')`.
- `Validators.email` suit la définition HTML : `jb@test` est valide (le domaine n'a pas besoin de point).

## 3. Un message clair sous chaque champ

[member-form.html](../src/app/equipe/member-form/member-form.html) : `@let nom = form.controls.nom;` puis
`@if (nom.invalid && (nom.touched || nom.dirty))` et un `hasError()` par règle. `getError('minlength')`
donne `requiredLength` et `actualLength`. Sans la condition `touched || dirty`, toutes les erreurs
s'afficheraient à l'ouverture de la page.

## 4. Bouton désactivé

`<button type="submit" [disabled]="form.invalid">`. La méthode `ajouter()` revérifie quand même la
validité : c'est une bonne habitude (envoi par Entrée, bouton modifié dans les DevTools…).

## 5. Liste des membres

Un `signal<Membre[]>` mis à jour avec `update((l) => [...l, membre])`, puis `form.reset()`.

## Pour aller plus loin

### Validateur personnalisé

[interdit.ts](../src/app/equipe/interdit.ts) : une fabrique `interdit(mots)` qui renvoie un `ValidatorFn`.
Elle renvoie `null` si la valeur est valide, sinon `{ interdit: { mot } }` ; le template teste
`nom.hasError('interdit')`. La comparaison est exacte (« Admin » refusé, « Administrateur » accepté).

### Version Signal Forms

[member-form-signal.ts](../src/app/equipe/member-form-signal/member-form-signal.ts). La règle maison
s'écrit avec `validate(s.nom, ({ value }) => … ? { kind: 'interdit', message: '…' } : null)`.

| | Reactive Forms | Signal Forms |
|---|---|---|
| Import | `ReactiveFormsModule` | `FormField` |
| Source de vérité | le `FormGroup` (copie interne des valeurs) | le signal modèle lui-même |
| Déclaration | `fb.group({ nom: ['', [Validators…]] })` | `form(modele, (s) => { required(s.nom) … })` |
| Lier un champ | `formControlName="nom"` | `[formField]="f.nom"` |
| Lire l'état | `form.controls.nom.invalid` (propriétés) | `f.nom().invalid()` (signaux) |
| Messages d'erreur | dans le template, un `@if` par règle | dans le schéma, une boucle sur `errors()` |
| Règle maison | `ValidatorFn` qui renvoie `{ cle: … }` | `validate()` qui renvoie `{ kind, message }` |
| Valeur à l'envoi | `form.getRawValue()` | `modele()` |
| Remise à zéro | `form.reset()` | `f().reset(valeurInitiale)` |
| Suivre les changements | `valueChanges` (Observable) | `computed` / `effect` sur le modèle |

En résumé pour les stagiaires : Signal Forms demande moins de code dans le template et s'intègre
naturellement aux signaux ; les Reactive Forms restent la référence dans les applications existantes
et pour les cas où l'on a besoin des Observables (`valueChanges` avec `debounceTime`, par exemple).
