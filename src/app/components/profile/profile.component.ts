import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { Router, RouterModule } from '@angular/router';

import { mockChef } from 'src/app/models/profile.mock';
import { AuthState } from 'src/app/models/profile.model';
import { profileRoutes } from 'src/app/app-routing.module';

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
export class ProfileComponent {
  private router = inject(Router);

  AuthState = AuthState;
  authState = AuthState.Loading;
  chef = mockChef;
  profileRoutes = profileRoutes;

  readonly totalRecipesFavorited = this.chef.favoriteRecipes.length;
  readonly totalRecipesViewed = Object.keys(this.chef.recentRecipes).length;
  readonly totalRecipesRated = Object.keys(this.chef.ratings).length;

  logout() {
    console.log('Logout');
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
