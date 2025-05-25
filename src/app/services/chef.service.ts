import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';

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

@Injectable({
  providedIn: 'root',
})
export class ChefService {
  private http = inject(HttpClient);
  private readonly isMocking = !environment.production && environment.mock;

  // API methods
  getChef(token: string): Observable<Chef> {
    if (this.isMocking) {
      return of(mockChef);
    }

    return this.http
      .get<Chef>(`${environment.serverBaseUrl}${Constants.chefsPath}`, {
        headers: this.authHeader(token),
      })
      .pipe(catchError(this.handleError.bind(this)));
  }

  createChef(credentials: LoginCredentials): Observable<LoginResponse> {
    if (this.isMocking) {
      return of(mockLoginResponse());
    }

    return this.http
      .post<LoginResponse>(
        `${environment.serverBaseUrl}${Constants.chefsPath}`,
        credentials
      )
      .pipe(catchError(this.handleError.bind(this)));
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
      .pipe(catchError(this.handleError.bind(this)));
  }

  deleteChef(token: string): Observable<null> {
    if (this.isMocking) {
      return of(null);
    }

    return this.http
      .delete<null>(`${environment.serverBaseUrl}${Constants.chefsPath}`, {
        headers: this.authHeader(token),
      })
      .pipe(catchError(this.handleError.bind(this)));
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
      .pipe(catchError(this.handleError.bind(this)));
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    if (this.isMocking) {
      return of(mockLoginResponse());
    }

    return this.http
      .post<LoginResponse>(
        `${environment.serverBaseUrl}${Constants.chefsPath}/login`,
        credentials
      )
      .pipe(catchError(this.handleError.bind(this)));
  }

  logout(token: string): Observable<null> {
    if (this.isMocking) {
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
      .pipe(catchError(this.handleError.bind(this)));
  }

  // Helpers
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error(error);
    return throwError(() => new Error(error.message));
  }

  private authHeader(token: string) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
}
