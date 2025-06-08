import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

import { environment } from 'src/environments/environment';
import Term from '../models/term.model';
import { mockTerms } from '../models/term.mock';
import Constants from '../constants/constants';
import TermStore from '../models/term-store.model';
import handleError from '../helpers/handleError';

@Injectable({
  providedIn: 'root',
})
export class TermsService {
  private http = inject(HttpClient);
  private readonly isMocking = !environment.production && environment.mock;

  // API methods
  getTerms(): Observable<Term[]> {
    if (this.isMocking) {
      return of(mockTerms);
    }

    return this.http
      .get<Term[]>(`${environment.serverBaseUrl}${Constants.termsPath}`)
      .pipe(catchError(handleError));
  }

  // localStorage methods
  getCachedTerms(): Term[] | null {
    const termStoreStr = localStorage.getItem(Constants.LocalStorage.terms);
    if (termStoreStr === null) return null;
    const termStore: TermStore = JSON.parse(termStoreStr);

    // Replace the terms if they are expired
    if (Date.now() >= termStore.expireAt) return null;

    return termStore.terms;
  }

  saveTerms(terms: Term[]) {
    const termStore: TermStore = {
      terms,
      expireAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
    };
    const termStoreStr = JSON.stringify(termStore);
    localStorage.setItem(Constants.LocalStorage.terms, termStoreStr);
  }
}
