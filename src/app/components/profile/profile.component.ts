import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { RouterModule } from '@angular/router';

import { mockChef } from 'src/app/models/profile.mock';
import { AuthState } from 'src/app/models/profile.model';

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
  AuthState = AuthState;
  authState = AuthState.Loading;
  chef = mockChef;

  readonly totalRecipesFavorited = this.chef.favoriteRecipes.length;
  readonly totalRecipesViewed = Object.keys(this.chef.recentRecipes).length;
  readonly totalRecipesRated = Object.keys(this.chef.ratings).length;

  logout() {
    console.log('Logout');
  }

  changeEmail() {
    console.log('Change email');
  }

  changePassword() {
    console.log('Change password');
  }

  deleteAccount() {
    console.log('Delete account');
  }
}
