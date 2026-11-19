/** Une tâche, au format de l'API JSONPlaceholder (/todos). */
export interface Task {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

/** L'auteur d'une tâche (/users/:id). */
export interface User {
  id: number;
  name: string;
  email: string;
}

/** Données de départ pour les TP 2 à 5, avant l'appel à l'API. */
export const TASKS_DEMO: Task[] = [
  { id: 1, userId: 1, title: 'Installer Angular CLI 22', completed: true },
  { id: 2, userId: 1, title: 'Créer le composant TaskList', completed: false },
  { id: 3, userId: 2, title: 'Ajouter le formulaire des membres', completed: false },
];
