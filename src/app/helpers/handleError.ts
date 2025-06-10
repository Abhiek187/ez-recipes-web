import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import RecipeError from '../models/recipe-error.model';

// Type guard to check if the server returned a valid error response
const isRecipeError = (error: unknown): error is RecipeError => {
  // Assert that error is an object: https://stackoverflow.com/a/8511350
  if (typeof error !== 'object' || Array.isArray(error) || error === null) {
    return false;
  }

  return Object.hasOwn(error, 'error');
};

/**
 * Convert an HTTP error response to a user-friendly error message
 * @param error the error response from an API
 * @returns an Observable that throws an error with the message
 */
const handleError = (error: HttpErrorResponse): Observable<never> => {
  console.error(error);
  let errorMessage = '';

  if (error.status === 0) {
    // An unknown server-side or network issue occurred
    errorMessage =
      'An unexpected error occurred. The server may be down or there may be network issues. Please try again later.';
  } else if (isRecipeError(error.error)) {
    // Use the error property sent by the server
    // error.error is the raw HTTP response body
    errorMessage = error.error.error; // lol
  } else {
    // Use the built-in error message for all other kinds of errors
    errorMessage = error.message;
  }

  // Return an observable with a user-facing error message.
  return throwError(() => new Error(errorMessage));
};

export default handleError;
