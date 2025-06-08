import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { mockChef } from 'src/app/models/profile.mock';
import { AuthState, ProfileAction } from 'src/app/models/profile.model';
import { profileRoutes, routes } from 'src/app/app-routing.module';
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
    MatRadioModule,
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
  authState = AuthState.Loading;
  chef = mockChef;
  profileRoutes = profileRoutes;

  readonly totalRecipesFavorited = this.chef.favoriteRecipes.length;
  readonly totalRecipesViewed = Object.keys(this.chef.recentRecipes).length;
  readonly totalRecipesRated = Object.keys(this.chef.ratings).length;

  ngOnInit(): void {
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
      this.chefService.logout(token);
    }
    // Assume the user should be signed out since there's no auth token
    localStorage.removeItem(Constants.LocalStorage.token);
    this.router.navigate([routes.profile.path]);
  }

  changeEmail() {
    this.router.navigate([profileRoutes.updateEmail.path]);
  }

  changePassword() {
    this.router.navigate([profileRoutes.updatePassword.path]);
  }

  deleteAccount() {
    this.router.navigate([profileRoutes.deleteAccount.path]);
  }
}
