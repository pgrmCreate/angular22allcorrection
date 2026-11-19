import { InjectionToken } from '@angular/core';

/** Adresse de l'API utilisée au TP 6. */
export const API_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => 'https://jsonplaceholder.typicode.com',
});
