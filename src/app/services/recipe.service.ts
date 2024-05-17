import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { liveQuery } from 'dexie';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';

import Recipe from '../models/recipe.model';
import { environment } from 'src/environments/environment';
import { mockRecipe, mockRecipes } from '../models/recipe.mock';
import RecipeError from '../models/recipe-error.model';
import Constants from '../constants/constants';
import RecipeFilter from '../models/recipe-filter.model';
import recipeFilterParams from './recipe-filter-params';
import recentRecipesDB from '../helpers/recent-recipes-db';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  // Store the recipe object in the service so other components can reference it and observe changes
  private recipe = new BehaviorSubject<Recipe | null>(null);
  // Turn on to test loading & error messages
  private mockLoading = false;
  private mockError = false;

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

  // API methods
  getRecipesWithFilter(filter: RecipeFilter): Observable<Recipe[]> {
    if (!environment.production && environment.mock) {
      return this.getMockRecipes();
    }

    return this.http
      .get<Recipe[]>(`${environment.serverBaseUrl}${Constants.recipesPath}`, {
        params: recipeFilterParams(filter),
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  getRandomRecipe(): Observable<Recipe> {
    // Mock the network calls for easier debugging & no quotas
    if (!environment.production && environment.mock) {
      return this.getMockRecipe();
    }

    return (
      this.http
        .get<Recipe>(
          `${environment.serverBaseUrl}${Constants.recipesPath}/random`
        )
        // Need to bind "this" so "this" in handleError points to RecipeService, instead of undefined
        .pipe(catchError(this.handleError.bind(this)))
    );
  }

  getRecipeById(id: string): Observable<Recipe> {
    if (!environment.production && environment.mock) {
      return this.getMockRecipe();
    }

    return this.http
      .get<Recipe>(`${environment.serverBaseUrl}${Constants.recipesPath}/${id}`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  // Load a sample recipe to avoid hitting the API while testing the UI
  getMockRecipe(): Observable<Recipe> {
    return new Observable((subscriber) => {
      setTimeout(
        () => {
          this.mockError
            ? subscriber.error(Error('A mock error occurred.'))
            : subscriber.next(mockRecipe);
          subscriber.complete();
        },
        this.mockLoading ? 10_000 : 0
      );
    });
  }

  getMockRecipes(): Observable<Recipe[]> {
    return new Observable((subscriber) => {
      setTimeout(
        () => {
          this.mockError
            ? subscriber.error(Error('A mock error occurred.'))
            : subscriber.next(mockRecipes);
          subscriber.complete();
        },
        this.mockLoading ? 10_000 : 0
      );
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error(error);
    let errorMessage = '';

    if (error.status === 0) {
      // An unknown server-side or network issue occurred
      errorMessage =
        'An unexpected error occurred. The server may be down or there may be network issues. Please try again later.';
    } else if (this.isRecipeError(error.error)) {
      // Use the error property sent by the server
      // error.error is the raw HTTP response body
      errorMessage = error.error.error; // lol
    } else {
      // Use the built-in error message for all other kinds of errors
      errorMessage = error.message;
    }

    // Return an observable with a user-facing error message.
    return throwError(() => new Error(errorMessage));
  }

  // Type guard to check if the server returned a valid error response
  private isRecipeError(error: unknown): error is RecipeError {
    // Assert that error is an object: https://stackoverflow.com/a/8511350
    if (typeof error !== 'object' || Array.isArray(error) || error === null) {
      return false;
    }

    return Object.prototype.hasOwnProperty.call(error, 'error');
  }

  // IndexedDB methods
  getRecentRecipes() {
    // Sort all the recipes by their timestamp in descending order
    // dexie's Observable type isn't the same as rxjs's Observable type
    return liveQuery(() =>
      recentRecipesDB.recipes
        .orderBy(Constants.recentRecipesDB.indexes.timestamp)
        .reverse()
        .toArray()
    );
  }

  async saveRecentRecipe(recipe: Recipe) {
    await recentRecipesDB.transaction(
      'rw',
      recentRecipesDB.recipes,
      async () => {
        // If the recipe already exists in the table, replace the timestamp with the current time
        const recipesUpdated = await recentRecipesDB.recipes.update(recipe.id, {
          timestamp: Date.now(),
        });
        // 0 = key doesn't exist, 1 = key exists
        if (recipesUpdated === 1) return Promise.resolve();

        // If there are too many recipes, delete the oldest recipe
        const recipeCount = await recentRecipesDB.recipes.count();

        if (recipeCount >= Constants.recentRecipesDB.max) {
          const oldestRecipe = await recentRecipesDB.recipes
            .orderBy(Constants.recentRecipesDB.indexes.timestamp)
            .first();
          await recentRecipesDB.recipes.delete(oldestRecipe!.id);
        }

        await recentRecipesDB.recipes.add({
          ...recipe,
          timestamp: Date.now(),
        });
      }
    );
  }
}
