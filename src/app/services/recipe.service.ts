import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { mockRecipe } from '../models/recipe.mock';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  constructor(private http: HttpClient) {}

  getRandomRecipe(): Observable<Recipe> {
    return this.http
      .get<Recipe>(environment.recipeApiUrl)
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
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
