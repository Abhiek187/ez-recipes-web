import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';

import Recipe from '../models/recipe.model';
import { environment } from 'src/environments/environment';
import { mockRecipe } from '../models/recipe.mock';
import RecipeError from '../models/recipe-error.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  // Store the recipe object in the service so other components can reference it and observe changes
  private recipe = new BehaviorSubject<Recipe | null>(null);

  constructor(private http: HttpClient) {}

  onRecipeChange(): Observable<Recipe | null> {
    return this.recipe.asObservable();
  }

  setRecipe(nextRecipe: Recipe) {
    this.recipe.next(nextRecipe);
  }

  resetRecipe() {
    this.recipe.next(null);
  }

  getRandomRecipe(): Observable<Recipe> {
    // Mock the network calls for easier debugging & no quotas
    if (!environment.production && environment.mock) {
      return this.getMockRecipe();
    }

    return this.http
      .get<Recipe>(`${environment.recipeBaseUrl}/random`)
      .pipe(catchError(this.handleError));
  }

  getRecipeById(id: string): Observable<Recipe> {
    if (!environment.production && environment.mock) {
      return this.getMockRecipe();
    }

    return this.http
      .get<Recipe>(`${environment.recipeBaseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Load a sample recipe to avoid hitting the API while testing the UI
  getMockRecipe(): Observable<Recipe> {
    return new Observable((subscriber) => {
      subscriber.next(mockRecipe);
      subscriber.complete();
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error(error);
    let errorMessage = '';

    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage =
        'An unexpected error occurred. The server may be down or there may be network issues. Please try again later.';
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      const errorResponse = error.error as RecipeError;
      errorMessage = errorResponse.error; // error.error.error (lol)
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error(errorMessage));
  }
}
