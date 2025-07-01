import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import Recipe, { RecipeUpdate } from 'src/app/models/recipe.model';
import { RecipeService } from 'src/app/services/recipe.service';
import { RecipeRatingComponent } from '../recipe-rating/recipe-rating.component';
import { ChefService } from 'src/app/services/chef.service';
import Constants from 'src/app/constants/constants';

@Component({
  selector: 'app-recipe-card',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RecipeRatingComponent,
  ],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.scss',
})
export class RecipeCardComponent {
  private recipeService = inject(RecipeService);
  private chefService = inject(ChefService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  readonly recipe = input.required<Recipe>();
  readonly calories = computed(() =>
    this.recipe().nutrients.find((nutrient) => nutrient.name === 'Calories')
  );
  chef = this.chefService.chef;
  isFavorite = computed(
    () =>
      this.chef()?.favoriteRecipes?.includes(this.recipe().id.toString()) ??
      false
  );

  toggleFavoriteRecipe(event: MouseEvent) {
    // Don't trigger the card's click event
    event.stopPropagation();

    const recipeUpdate: RecipeUpdate = {
      isFavorite: !this.isFavorite(),
    };
    const token =
      localStorage.getItem(Constants.LocalStorage.token) ?? undefined;

    this.recipeService
      .updateRecipe(this.recipe().id, recipeUpdate, token)
      .subscribe({
        next: ({ token }) => {
          const newFavoriteRecipes = this.isFavorite()
            ? this.chef()?.favoriteRecipes?.filter(
                (recipeId) => recipeId !== this.recipe().id.toString()
              )
            : this.chef()?.favoriteRecipes?.concat([
                this.recipe().id.toString(),
              ]);
          this.chef.update(
            (chef) =>
              chef && {
                ...chef,
                favoriteRecipes: newFavoriteRecipes ?? [],
              }
          );

          if (token !== undefined) {
            localStorage.setItem(Constants.LocalStorage.token, token);
          }
        },
        error: (error) => {
          this.snackBar.open(error.message, 'Dismiss');
        },
      });
  }

  onRate(rating: number) {
    const recipeId = this.recipe().id;
    const recipeUpdate: RecipeUpdate = {
      rating,
    };
    const token = localStorage.getItem(Constants.LocalStorage.token);

    if (this.chef() === undefined || token === null) {
      this.snackBar.open(
        'You must be signed in to rate this recipe',
        'Dismiss'
      );
      return;
    }

    this.recipeService.updateRecipe(recipeId, recipeUpdate, token).subscribe({
      next: ({ token }) => {
        this.chef.update(
          (chef) =>
            chef && {
              ...chef,
              ratings: {
                ...chef?.ratings,
                [recipeId]: rating,
              },
            }
        );

        this.recipeService
          .toggleFavoriteRecentRecipe(recipeId)
          .catch((error) => {
            console.error(
              'Failed to toggle isFavorite for recent recipe:',
              error.message
            );
          });

        if (token !== undefined) {
          localStorage.setItem(Constants.LocalStorage.token, token);
        }
      },
      error: (error) => {
        this.snackBar.open(error.message, 'Dismiss');
      },
    });
  }

  openRecipe() {
    const recipe = this.recipe();
    this.recipeService.recipe.set(recipe);
    this.router.navigate([`/recipe/${recipe.id}`]);
    // Scroll to the top so the recipe header can be viewed
    const sidenav = document.querySelector<HTMLElement>('.sidenav-content');
    sidenav?.scroll(0, 0);
  }
}
