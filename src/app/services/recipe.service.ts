import { HttpClient } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import { liveQuery } from 'dexie';
import { catchError, Observable, tap } from 'rxjs';

import Recipe, { RecipeUpdate, Token } from '../models/recipe.model';
import { environment } from 'src/environments/environment';
import { mockRecipe, mockRecipes, mockToken } from '../models/recipe.mock';
import Constants from '../constants/constants';
import RecipeFilter from '../models/recipe-filter.model';
import recipeFilterParams from './recipe-filter-params';
import recentRecipesDB from '../helpers/recent-recipes-db';
import handleError from '../helpers/handleError';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private http = inject(HttpClient);
  private readonly isMocking = !environment.production && environment.mock;

  // Store the recipe object in the service so other components can reference it and observe changes
  recipe = signal<Recipe | null>(null);
  // Turn on to test loading & error messages
  private mockLoading = false;
  private mockError = false;

  constructor() {
    effect(() => {
      // Log recipes fetched
      if (this.recipe() !== null) {
        console.log(this.recipe());
      }
    });
  }

  // API methods
  getRecipesWithFilter(filter: RecipeFilter): Observable<Recipe[]> {
    if (this.isMocking) {
      return this.getMockRecipes();
    }

    return this.http
      .get<Recipe[]>(`${environment.serverBaseUrl}${Constants.recipesPath}`, {
        params: recipeFilterParams(filter),
      })
      .pipe(catchError(handleError));
  }

  getRandomRecipe(): Observable<Recipe> {
    // Mock the network calls for easier debugging & no quotas
    if (this.isMocking) {
      return this.getMockRecipe();
    }

    return this.http
      .get<Recipe>(
        `${environment.serverBaseUrl}${Constants.recipesPath}/random`
      )
      .pipe(
        tap((recipe) => {
          this.recipe.set(recipe);
        }),
        catchError(handleError)
      );
  }

  getRecipeById(id: string): Observable<Recipe> {
    if (this.isMocking) {
      return this.getMockRecipe();
    }

    return this.http
      .get<Recipe>(`${environment.serverBaseUrl}${Constants.recipesPath}/${id}`)
      .pipe(
        tap((recipe) => {
          this.recipe.set(recipe);
        }),
        catchError(handleError)
      );
  }

  updateRecipe(
    id: number,
    fields: RecipeUpdate,
    token?: string
  ): Observable<Token> {
    if (this.isMocking) {
      return this.getMockToken();
    }

    return this.http
      .patch<Token>(
        `${environment.serverBaseUrl}${Constants.recipesPath}/${id}`,
        fields,
        {
          headers: {
            ...(token !== undefined && this.authHeader(token)),
          },
        }
      )
      .pipe(catchError(handleError));
  }

  // Load a sample recipe to avoid hitting the API while testing the UI
  getMockRecipe(): Observable<Recipe> {
    return new Observable((subscriber) => {
      setTimeout(
        () => {
          if (this.mockError) {
            subscriber.error(Error('A mock error occurred.'));
          } else {
            this.recipe.set(mockRecipe);
            subscriber.next(mockRecipe);
          }

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
          if (this.mockError) {
            subscriber.error(Error('A mock error occurred.'));
          } else {
            subscriber.next(mockRecipes);
          }

          subscriber.complete();
        },
        this.mockLoading ? 10_000 : 0
      );
    });
  }

  getMockToken(): Observable<Token> {
    return new Observable((subscriber) => {
      setTimeout(
        () => {
          if (this.mockError) {
            subscriber.error(Error('A mock error occurred.'));
          } else {
            subscriber.next(mockToken);
          }

          subscriber.complete();
        },
        this.mockLoading ? 10_000 : 0
      );
    });
  }

  private authHeader(token: string) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  // IndexedDB methods
  getRecentRecipes() {
    // Sort all the recipes by their timestamp in descending order
    // dexie's Observable type isn't the same as rxjs's Observable type
    return liveQuery(() =>
      recentRecipesDB.recipes
        .orderBy(Constants.recentRecipesDB.config.at(-1)!.indexes.timestamp)
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
            .orderBy(Constants.recentRecipesDB.config.at(-1)!.indexes.timestamp)
            .first();
          await recentRecipesDB.recipes.delete(oldestRecipe!.id);
        }

        await recentRecipesDB.recipes.add({
          ...recipe,
          timestamp: Date.now(),
          isFavorite: false,
        });
      }
    );
  }
}
