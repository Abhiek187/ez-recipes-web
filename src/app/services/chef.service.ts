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
  getChef(token: string): Observable<Chef> {
    if (this.isMocking) {
      this.chef.set(mockChef);
      return of(mockChef);
    }

    return this.http
      .get<Chef>(`${environment.serverBaseUrl}${Constants.chefsPath}`, {
        headers: this.authHeader(token),
      })
      .pipe(
        tap((chef) => {
          this.chef.set(chef);
        }),
        catchError(handleError)
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
        }),
        catchError(handleError)
      );
  }

  updateChef(
    fields: ChefUpdate,
    token?: string
  ): Observable<ChefEmailResponse> {
    if (this.isMocking) {
      return of(mockChefEmailResponse);
    }

    return this.http
      .patch<ChefEmailResponse>(
        `${environment.serverBaseUrl}${Constants.chefsPath}`,
        fields,
        {
          headers: {
            ...(token !== undefined && this.authHeader(token)),
          },
        }
      )
      .pipe(catchError(handleError));
  }

  deleteChef(token: string): Observable<null> {
    if (this.isMocking) {
      this.chef.set(undefined);
      return of(null);
    }

    return this.http
      .delete<null>(`${environment.serverBaseUrl}${Constants.chefsPath}`, {
        headers: this.authHeader(token),
      })
      .pipe(
        tap(() => {
          this.chef.set(undefined);
        }),
        catchError(handleError)
      );
  }

  verifyEmail(token: string): Observable<ChefEmailResponse> {
    if (this.isMocking) {
      return of(mockChefEmailResponse);
    }

    return this.http
      .post<ChefEmailResponse>(
        `${environment.serverBaseUrl}${Constants.chefsPath}/verify`,
        null, // no body
        { headers: this.authHeader(token) }
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
        }),
        catchError(handleError)
      );
  }

  logout(token: string): Observable<null> {
    if (this.isMocking) {
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
}
