import {
    afterNextRender,
    AfterContentChecked,
    AfterContentInit,
    AfterViewChecked,
    AfterViewInit,
    Component,
    DestroyRef,
    DoCheck,
    inject,
    input,
    OnChanges,
    OnDestroy,
    OnInit,
    output,
    SimpleChanges,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Task } from '../../models/task';
import { Done } from '../../shared/done';
import { TruncatePipe } from '../../shared/truncate-pipe';

/**
 * TP 4, objectif 5 : passer à true pour afficher les étapes du cycle de vie dans la
 * console. Désactivé depuis le TP 7 pour ne pas encombrer la sortie des tests.
 */
const TRACER_CYCLE_DE_VIE = false;

/** Numéro d'instance, pour distinguer les TaskItem dans la console. */
let instances = 0;

/**
 * TP 4 : une tâche de la liste.
 *
 * Composant « de présentation » : il reçoit sa tâche par une entrée et signale les
 * actions de l'utilisateur par des sorties. Il ne modifie jamais la tâche lui-même :
 * c'est le propriétaire des données (App, puis TaskStore au TP 5) qui le fait.
 * Les données descendent, les événements remontent.
 */
@Component({
    selector: 'app-task-item',
    imports: [Done, TruncatePipe, RouterLink],
    templateUrl: './task-item.html',
    styleUrl: './task-item.css',
})
export class TaskItem
    implements
        OnChanges,
        OnInit,
        DoCheck,
        AfterContentInit,
        AfterContentChecked,
        AfterViewInit,
        AfterViewChecked,
        OnDestroy
{
    /** input.required() : signal en lecture seule ; erreur si le parent oublie [task]. */
    readonly task = input.required<Task>();

    /** output() : émet l'identifiant de la tâche. Le parent écoute (toggled)="…". */
    readonly toggled = output<number>();
    readonly removed = output<number>();

    private readonly numero = ++instances;

    // ----- TP 4, objectif 5 : le cycle de vie ---------------------------------------
    // Ordre observé dans la console au chargement (3 tâches) :
    //   1. les 3 constructor (Angular crée d'abord tous les composants de la liste) ;
    //   2. pour chaque tâche : ngOnChanges → ngOnInit → ngDoCheck → ngAfterContentInit
    //      → ngAfterContentChecked → ngAfterViewInit → ngAfterViewChecked ;
    //   3. les 3 afterNextRender, une fois tout le rendu terminé.
    // Quand on coche une tâche : ngDoCheck, ngAfterContentChecked et ngAfterViewChecked
    // sur TOUTES les tâches (le parent est vérifié), mais ngOnChanges seulement sur la
    // tâche cochée, la seule dont l'entrée a changé.
    // À la suppression : ngOnDestroy, puis les callbacks de DestroyRef.

    constructor() {
        // Les entrées ne sont PAS encore disponibles ici : lire this.task() lèverait
        // l'erreur NG0950. Le constructeur sert à inject() et à enregistrer des callbacks.
        this.trace('constructor');

        // afterNextRender : une seule fois, après le premier rendu dans le DOM.
        // C'est l'endroit pour mesurer un élément ou donner le focus.
        afterNextRender(() => this.trace('afterNextRender (le DOM est prêt)'));

        // Alternative moderne à ngOnDestroy, utilisable hors de la classe.
        inject(DestroyRef).onDestroy(() => this.trace('DestroyRef.onDestroy'));
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Appelé aussi pour les entrées signal (input()). Au premier appel,
        // changes['task'].firstChange vaut true.
        this.trace(`ngOnChanges (${Object.keys(changes).join(', ')})`);
    }

    ngOnInit(): void {
        // Les entrées sont disponibles : c'est l'endroit historique pour initialiser.
        this.trace(`ngOnInit « ${this.task().title} »`);
    }

    ngDoCheck(): void {
        this.trace('ngDoCheck');
    }

    ngAfterContentInit(): void {
        this.trace('ngAfterContentInit');
    }

    ngAfterContentChecked(): void {
        this.trace('ngAfterContentChecked');
    }

    ngAfterViewInit(): void {
        this.trace('ngAfterViewInit');
    }

    ngAfterViewChecked(): void {
        this.trace('ngAfterViewChecked');
    }

    ngOnDestroy(): void {
        this.trace('ngOnDestroy');
    }

    private trace(etape: string): void {
        if (TRACER_CYCLE_DE_VIE) {
            console.log(`[TaskItem #${this.numero}] ${etape}`);
        }
    }
}
