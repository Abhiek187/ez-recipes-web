import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from 'src/environments/environment';
import Term from '../models/term.model';
import { mockTerms } from '../models/term.mock';
import Constants from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class TermsService {
  constructor(private http: HttpClient) {}

  getTerms(): Observable<Term[]> {
    if (!environment.production && environment.mock) {
      return this.getMockTerms();
    }

    return this.http
      .get<Term[]>(`${environment.serverBaseUrl}${Constants.termsPath}`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  getMockTerms(): Observable<Term[]> {
    return new Observable((subscriber) => {
      subscriber.next(mockTerms);
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error(error);
    return throwError(() => new Error(error.message));
  }
}
