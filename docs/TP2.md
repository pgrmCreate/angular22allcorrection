# TP 2 – Développer les premières fonctionnalités

Tag Git : `tp2`.

```powershell
ng g c tasks/task-list
ng g c tasks/task-add
ng g pipe shared/truncate
ng g directive shared/done
```

Le CLI 22 crée un dossier par composant (`tasks/task-list/task-list.ts`, `.html`, `.css`, `.spec.ts`),
le pipe `shared/truncate-pipe.ts` (classe `TruncatePipe`) et la directive `shared/done.ts`
(classe `Done`, sans suffixe `Directive`). Les fichiers `.spec.ts` générés pour `TaskList`, `TaskAdd`
et `Done` ont été supprimés : ils échouent dès qu'une entrée est obligatoire, et les tests sont l'objet
du TP 7 (on peut aussi générer avec `--skip-tests`).

## 1. Le tableau de tâches dans `App`

[app.ts](../src/app/app.ts) : `protected tasks: Task[] = [...TASKS_DEMO];`. Le type `Task` et les données
viennent de [models/task.ts](../src/app/models/task.ts), fourni avec le code de départ.

## 2. `TaskList` avec `@for` et `@empty`

[task-list.html](../src/app/tasks/task-list/task-list.html). `track task.id` est obligatoire.

**Comment `TaskList` reçoit-elle les tâches ?** L'énoncé dit que les données restent dans `App` et
qu'on les transmettra aux enfants au module 3. Il faut pourtant bien les faire passer pour que `TaskList`
les affiche : la correction utilise donc une entrée simple, `tasks = input.required<Task[]>()`, comme le
*property binding* `[task]="task"` vu au module 2. Le module 3 approfondit `input()` et `output()`.

## 3. `TaskAdd` avec une variable de template

[task-add.html](../src/app/tasks/task-add/task-add.html) : `<input #titre>` puis `ajouter(titre)`.
La touche Entrée fonctionne aussi grâce à `(keyup.enter)`. `TaskAdd` émet le titre avec la sortie
`added` ; `App` l'écoute avec `(added)="ajouter($event)"`.

**Piège OnPush** : en Angular 22, les composants sont en `OnPush` par défaut. Si `App` fait
`this.tasks.push(task)`, la référence du tableau ne change pas et `TaskList` n'est pas revérifiée :
la nouvelle tâche n'apparaît pas. Il faut créer un nouveau tableau : `this.tasks = [...this.tasks, task]`.

## 4. Le nombre de tâches restantes avec `@let`

```html
@let restantes = tasks().filter((t) => !t.completed).length;
```

Les fonctions fléchées sont acceptées dans les templates depuis Angular 21.2. Au TP 4, ce calcul
devient un `computed`, plus efficace (mémorisé) et testable.

## 5. Le pipe `truncate` et la directive `appDone`

- [truncate-pipe.ts](../src/app/shared/truncate-pipe.ts) : `{{ task.title | truncate: 30 }}`. Un pipe est
  pur par défaut : il n'est recalculé que si ses arguments changent.
- [done.ts](../src/app/shared/done.ts) : `<li [appDone]="task.completed">` pose la classe `done` grâce
  à la propriété `host` (qui remplace `@HostBinding`).

Le pipe et la directive doivent figurer dans les `imports` de `TaskList`. Sinon le build échoue :
« No pipe found with name 'truncate' », ou « Can't bind to 'appDone' since it isn't a known property of 'li' ».
