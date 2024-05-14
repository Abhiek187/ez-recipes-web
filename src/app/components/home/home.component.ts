import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import Constants from 'src/app/constants/constants';
import { getRandomElement } from 'src/app/helpers/array';
import Recipe from 'src/app/models/recipe.model';
import { RecipeService } from 'src/app/services/recipe.service';
import { RecipeCardComponent } from '../recipe-card/recipe-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    RecipeCardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoading = false;
  private defaultLoadingMessage = '';
  loadingMessage = this.defaultLoadingMessage;
  recipeServiceSubscription?: Subscription;
  recentRecipes: Recipe[] = [];

  constructor(
    private recipeService: RecipeService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get all the recent recipes from IndexedDB
    this.recipeService.getRecentRecipes().subscribe({
      next: (recipes: Recipe[]) => {
        this.recentRecipes = recipes;
      },
      error: (error: Error) => {
        this.snackBar.open(error.message, 'Dismiss');
      },
    });
  }

  ngOnDestroy(): void {
    // Cancel all pending requests to avoid unintentional navigation
    this.recipeServiceSubscription?.unsubscribe();
  }

  getRandomRecipe() {
    // Show the progress spinner while the recipe is loading
    this.isLoading = true;
    const timer = this.showLoadingMessages();

    // Show a random, low-effort recipe
    this.recipeServiceSubscription = this.recipeService
      .getRandomRecipe()
      .subscribe({
        next: (recipe: Recipe) => {
          this.isLoading = false;
          clearInterval(timer);
          this.recipeService.setRecipe(recipe);
          console.log(recipe);
          this.router.navigate([`/recipe/${recipe.id}`]);
        },
        error: (error: Error) => {
          // Show a snackbar explaining that an error occurred
          this.isLoading = false;
          clearInterval(timer);
          this.snackBar.open(error.message, 'Dismiss');
        },
      });
  }

  showLoadingMessages() {
    // Don't show any messages initially if the recipe loads quickly
    this.loadingMessage = this.defaultLoadingMessage;

    return setInterval(() => {
      this.loadingMessage = getRandomElement(Constants.loadingMessages);
    }, 3000);
  }
}
