import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { AuthState, ProfileAction } from 'src/app/models/profile.model';
import { profileRoutes } from 'src/app/app-routing.module';
import Constants from 'src/app/constants/constants';
import { ChefService } from 'src/app/services/chef.service';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private chefService = inject(ChefService);
  private snackBar = inject(MatSnackBar);

  AuthState = AuthState;
  authState = signal(AuthState.Loading);
  chef = this.chefService.chef;
  profileRoutes = profileRoutes;

  readonly totalRecipesFavorited = computed(
    () => this.chef()?.favoriteRecipes.length ?? 0
  );
  readonly totalRecipesViewed = computed(
    () => Object.keys(this.chef()?.recentRecipes ?? {}).length
  );
  readonly totalRecipesRated = computed(
    () => Object.keys(this.chef()?.ratings ?? {}).length
  );

  ngOnInit(): void {
    // Check if the user is authenticated every time the profile tab is launched
    const token = localStorage.getItem(Constants.LocalStorage.token);

    if (token === null) {
      this.authState.set(AuthState.Unauthenticated);
    } else if (
      this.totalRecipesFavorited() > 0 ||
      this.totalRecipesViewed() > 0 ||
      this.totalRecipesRated() > 0
    ) {
      // If redirected from the login page, the chef's recipe stats still need to be fetched
      this.authState.set(AuthState.Authenticated);
    } else {
      this.chefService.getChef(token).subscribe({
        next: (chefResponse) => {
          localStorage.setItem(
            Constants.LocalStorage.token,
            chefResponse.token
          );
          this.authState.set(
            chefResponse.emailVerified
              ? AuthState.Authenticated
              : AuthState.Unauthenticated
          );
        },
        error: (error) => {
          localStorage.removeItem(Constants.LocalStorage.token);
          this.authState.set(AuthState.Unauthenticated);
          this.snackBar.open(error.message, 'Dismiss');
        },
      });
    }

    const action = this.route.snapshot.queryParamMap.get('action');

    switch (action) {
      case ProfileAction.VerifyEmail:
        this.snackBar.open('Email verified successfully!', 'Dismiss');
        break;
      case ProfileAction.ChangeEmail:
        this.snackBar.open(
          'Email updated successfully! Please sign in again.',
          'Dismiss'
        );
        break;
      case ProfileAction.ResetPassword:
        this.snackBar.open(
          'Password updated successfully! Please sign in again.',
          'Dismiss'
        );
    }
  }

  logout() {
    const token = localStorage.getItem(Constants.LocalStorage.token);
    if (token !== null) {
      // subscribe is required to call the API without getting the result
      this.chefService.logout(token).subscribe();
    }
    // Assume the user should be signed out since there's no auth token
    localStorage.removeItem(Constants.LocalStorage.token);
    this.authState.set(AuthState.Unauthenticated);
  }

  changeEmail() {
    this.router.navigate([profileRoutes.updateEmail.path]);
  }

  changePassword() {
    this.router.navigate([profileRoutes.updatePassword.path], {
      state: {
        email: this.chef()?.email,
      },
    });
  }

  deleteAccount() {
    this.router.navigate([profileRoutes.deleteAccount.path], {
      state: {
        email: this.chef()?.email,
      },
    });
  }
}
