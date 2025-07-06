import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';

import {
  Chef,
  ChefEmailResponse,
  ChefUpdate,
  ChefUpdateType,
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

    const token = localStorage.getItem(Constants.LocalStorage.token);
    if (token === null) {
      return this.noTokenFound();
    }

    return this.http
      .get<Chef>(`${environment.serverBaseUrl}${Constants.chefsPath}`, {
        headers: this.authHeader(token),
      })
      .pipe(
        tap((chef) => {
          localStorage.setItem(Constants.LocalStorage.token, chef.token);
          this.chef.set(chef);
        }),
        catchError((error) => {
          localStorage.removeItem(Constants.LocalStorage.token);
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
        credentials
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
          localStorage.setItem(Constants.LocalStorage.token, token);
        }),
        catchError(handleError)
      );
  }

  updateChef(fields: ChefUpdate): Observable<ChefEmailResponse> {
    if (this.isMocking) {
      return of(mockChefEmailResponse);
    }

    const token = localStorage.getItem(Constants.LocalStorage.token);
    if (
      token === null &&
      (fields.type !== ChefUpdateType.Password || fields.password !== undefined)
    ) {
      return this.noTokenFound();
    }

    return this.http
      .patch<ChefEmailResponse>(
        `${environment.serverBaseUrl}${Constants.chefsPath}`,
        fields,
        {
          headers: {
            ...(token !== null && this.authHeader(token)),
          },
        }
      )
      .pipe(
        tap(({ token }) => {
          if (token !== undefined && fields.type !== ChefUpdateType.Password) {
            localStorage.setItem(Constants.LocalStorage.token, token);
          } else if (
            token !== undefined &&
            fields.type === ChefUpdateType.Password
          ) {
            // The token will be revoked, so sign out the user
            localStorage.removeItem(Constants.LocalStorage.token);
          }
        }),
        catchError(handleError)
      );
  }

  deleteChef(): Observable<null> {
    if (this.isMocking) {
      this.chef.set(undefined);
      return of(null);
    }

    const token = localStorage.getItem(Constants.LocalStorage.token);
    if (token === null) {
      return this.noTokenFound();
    }

    return this.http
      .delete<null>(`${environment.serverBaseUrl}${Constants.chefsPath}`, {
        headers: this.authHeader(token),
      })
      .pipe(
        tap(() => {
          localStorage.removeItem(Constants.LocalStorage.token);
          this.chef.set(undefined);
        }),
        catchError(handleError)
      );
  }

  verifyEmail(): Observable<ChefEmailResponse> {
    if (this.isMocking) {
      return of(mockChefEmailResponse);
    }

    const token = localStorage.getItem(Constants.LocalStorage.token);
    if (token === null) {
      return this.noTokenFound();
    }

    return this.http
      .post<ChefEmailResponse>(
        `${environment.serverBaseUrl}${Constants.chefsPath}/verify`,
        null, // no body
        { headers: this.authHeader(token) }
      )
      .pipe(
        tap(({ token }) => {
          if (token !== undefined) {
            localStorage.setItem(Constants.LocalStorage.token, token);
          }
        }),
        catchError(handleError)
      );
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    if (this.isMocking) {
      this.chef.set(mockChef);
      return of(mockLoginResponse());
    }

    return this.http
      .post<LoginResponse>(
        `${environment.serverBaseUrl}${Constants.chefsPath}/login`,
        credentials
      )
      .pipe(
        tap(({ uid, token, emailVerified }) => {
          localStorage.setItem(Constants.LocalStorage.token, token);
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

    const token = localStorage.getItem(Constants.LocalStorage.token);
    if (token === null) {
      // Assume the user should be signed out since there's no auth token
      localStorage.removeItem(Constants.LocalStorage.token);
      this.chef.set(undefined);
      return of(null);
    }

    return this.http
      .post<null>(
        `${environment.serverBaseUrl}${Constants.chefsPath}/logout`,
        null,
        {
          headers: this.authHeader(token),
        }
      )
      .pipe(
        tap(() => {
          localStorage.removeItem(Constants.LocalStorage.token);
          this.chef.set(undefined);
        }),
        catchError(handleError)
      );
  }

  // Helpers
  private authHeader(token: string) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  private noTokenFound() {
    return throwError(() => new Error(Constants.noTokenFound));
  }
}
