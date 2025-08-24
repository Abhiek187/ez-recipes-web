import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';

import {
  Chef,
  ChefEmailResponse,
  ChefUpdate,
  LoginCredentials,
  LoginResponse,
} from '../models/profile.model';
import { environment } from 'src/environments/environment';
import Constants from '../constants/constants';
import {
  mockChef,
  mockChefEmailResponse,
  mockLoginResponse,
} from '../models/profile.mock';
import handleError from '../helpers/handleError';

@Injectable({
  providedIn: 'root',
})
export class ChefService {
  private http = inject(HttpClient);
  private readonly isMocking = !environment.production && environment.mock;

  readonly chef = signal<Chef | undefined>(undefined);

  // API methods
  getChef(): Observable<Chef> {
    if (this.isMocking) {
      this.chef.set(mockChef);
      return of(mockChef);
    }

    return this.http
      .get<Chef>(`${environment.serverBaseUrl}${Constants.chefsPath}`, {
        // Required so the browser can send & store cookies
        withCredentials: true,
      })
      .pipe(
        tap((chef) => {
          this.chef.set(chef.emailVerified ? chef : undefined);
        }),
        catchError((error) => {
          return handleError(error);
        })
      );
  }

  createChef(credentials: LoginCredentials): Observable<LoginResponse> {
    if (this.isMocking) {
      this.chef.set(mockChef);
      return of(mockLoginResponse());
    }

    return this.http
      .post<LoginResponse>(
        `${environment.serverBaseUrl}${Constants.chefsPath}`,
        credentials,
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap(({ uid, token, emailVerified }) => {
          this.chef.set({
            uid,
            email: credentials.email,
            emailVerified,
            ratings: {},
            recentRecipes: {},
            favoriteRecipes: [],
            token,
          });
        }),
        catchError(handleError)
      );
  }

  updateChef(fields: ChefUpdate): Observable<ChefEmailResponse> {
    if (this.isMocking) {
      return of(mockChefEmailResponse);
    }

    return this.http
      .patch<ChefEmailResponse>(
        `${environment.serverBaseUrl}${Constants.chefsPath}`,
        fields,
        {
          withCredentials: true,
        }
      )
      .pipe(catchError(handleError));
  }

  deleteChef(): Observable<null> {
    if (this.isMocking) {
      this.chef.set(undefined);
      return of(null);
    }

    return this.http
      .delete<null>(`${environment.serverBaseUrl}${Constants.chefsPath}`, {
        withCredentials: true,
      })
      .pipe(
        tap(() => {
          this.chef.set(undefined);
        }),
        catchError(handleError)
      );
  }

  verifyEmail(): Observable<ChefEmailResponse> {
    if (this.isMocking) {
      return of(mockChefEmailResponse);
    }

    return this.http
      .post<ChefEmailResponse>(
        `${environment.serverBaseUrl}${Constants.chefsPath}/verify`,
        null, // no body
        { withCredentials: true }
      )
      .pipe(catchError(handleError));
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    if (this.isMocking) {
      this.chef.set(mockChef);
      return of(mockLoginResponse());
    }

    return this.http
      .post<LoginResponse>(
        `${environment.serverBaseUrl}${Constants.chefsPath}/login`,
        credentials,
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap(({ uid, token, emailVerified }) => {
          this.chef.set({
            uid,
            email: credentials.email,
            emailVerified,
            ratings: {},
            recentRecipes: {},
            favoriteRecipes: [],
            token,
          });
        }),
        catchError(handleError)
      );
  }

  logout(): Observable<null> {
    if (this.isMocking) {
      this.chef.set(undefined);
      return of(null);
    }

    return this.http
      .post<null>(
        `${environment.serverBaseUrl}${Constants.chefsPath}/logout`,
        null,
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap(() => {
          this.chef.set(undefined);
        }),
        catchError(handleError)
      );
  }
}
