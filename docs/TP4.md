# TP 4 – Mettre en œuvre les composants

Tag Git : `tp4`.

## 1. `TaskItem` : `input.required()` et `output()`

[task-item.ts](../src/app/tasks/task-item/task-item.ts)

```ts
readonly task = input.required<Task>();
readonly toggled = output<number>();
readonly removed = output<number>();
```

Dans le template, l'entrée est un signal : `task().title`. `TaskItem` ne modifie jamais la tâche ; il
émet son identifiant. `TaskList` relaie ces sorties vers `App`
(`(toggled)="toggled.emit($event)"`) : c'est fastidieux, et c'est justement ce que le service du TP 5
supprimera.

## 2. Les tâches deviennent un signal, `remaining` un `computed`

[app.ts](../src/app/app.ts)

```ts
protected readonly tasks = signal<Task[]>(lireTachesSauvegardees());
protected readonly remaining = computed(() => this.tasks().filter((t) => !t.completed).length);
```

Les modifications passent par `update()` en renvoyant toujours un nouveau tableau (`[...l, t]`, `map`,
`filter`). Le `@let` du TP 2 disparaît : le `computed` est mémorisé, recalculé seulement quand `tasks`
change, et il se teste sans template.

## 3. `Filtre` relié à `TaskList` par `model()`

[filtre.ts](../src/app/tasks/filtre/filtre.ts) déclare `value = model<FiltreTache>('toutes')` et appelle
`value.set(f)` au clic. [task-list.html](../src/app/tasks/task-list/task-list.html) écrit
`<app-filtre [(value)]="filtre" />` en passant le signal lui-même, sans parenthèses. Les tâches visibles
sont un `computed` qui dépend de `tasks` et de `filtre`.

## 4. Sauvegarde dans le `localStorage` avec `effect()`

Dans le constructeur de `App` :

```ts
effect(() => localStorage.setItem(CLE_STOCKAGE, JSON.stringify(this.tasks())));
```

L'effet se relance à chaque changement de `tasks`. Au démarrage, `lireTachesSauvegardees()` relit la
sauvegarde (avec un `try/catch` en cas de JSON corrompu). Erreur classique : utiliser `effect` pour
calculer une valeur à mettre dans un autre signal ; il faut alors un `computed`.

## 5. Le cycle de vie de `TaskItem`

Les `console.log` sont dans [task-item.ts](../src/app/tasks/task-item/task-item.ts) (constante
`TRACER_CYCLE_DE_VIE`). Ordre réellement observé au chargement de 3 tâches :

1. les 3 `constructor` d'abord ;
2. puis pour chaque tâche : `ngOnChanges` → `ngOnInit` → `ngDoCheck` → `ngAfterContentInit` →
   `ngAfterContentChecked` → `ngAfterViewInit` → `ngAfterViewChecked` ;
3. enfin les 3 `afterNextRender`.

Quand on coche une tâche, `ngOnChanges` n'est appelé que sur la tâche cochée (seule son entrée a
changé). À la suppression : `ngOnDestroy`, puis `DestroyRef.onDestroy`. Dans le constructeur, lire
`this.task()` provoque l'erreur NG0950 : les entrées ne sont pas encore fixées.

## Pour aller plus loin

- **`Carte`** : [carte.ts](../src/app/shared/carte.ts). `<ng-content select="[titre]">` reçoit
  `<h2 titre>…</h2>` ; le `<ng-content />` sans `select` reçoit tout le reste. Le contenu placé entre
  les balises `<ng-content>` est affiché par défaut (« Sans titre ») si le parent ne fournit rien.
- **Focus automatique** : [task-add.ts](../src/app/tasks/task-add/task-add.ts).
  `viewChild.required<ElementRef<HTMLInputElement>>('titre')` renvoie un signal ;
  `afterNextRender(() => this.champ().nativeElement.focus())` attend que le DOM existe.
- **Profiler d'Angular DevTools** : en cochant une tâche, on voit `App`, `TaskList` et **le seul**
  `TaskItem` coché. Les autres `TaskItem`, `Filtre`, `TaskAdd` et les formulaires sont ignorés : ils
  sont `OnPush` (par défaut en Angular 22) et leurs entrées n'ont pas changé, car `map` garde la même
  référence pour les tâches non modifiées. Mesure faite avec une sonde dans le template : un seul
  `TaskItem` redessiné. Piège : `ngDoCheck` est appelé sur **tous** les `TaskItem`, même ceux qui ne
  sont pas redessinés. Ce n'est pas un bon indicateur du rendu.

## L'astuce du `setTimeout`

```ts
compteur = 0;
demarrer() { setTimeout(() => this.compteur++, 1000); }   // la vue ne bouge pas
```

Sans Zone.js (application *zoneless*) et en `OnPush`, rien ne prévient Angular qu'une propriété
ordinaire a changé dans un `setTimeout`. Avec `compteur = signal(0)` et `compteur.update(n => n + 1)`,
le signal signale lui-même son changement et la vue se met à jour.
