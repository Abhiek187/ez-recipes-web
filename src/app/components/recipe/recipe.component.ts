import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Recipe } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent implements OnInit, OnDestroy {
  recipe: Recipe | null = null;
  isLoading = false;
  recipeChangeSubscription?: Subscription;

  // Nutrients that should be bold on the nutrition label
  nutrientHeadings = ['Calories', 'Fat', 'Carbohydrates', 'Protein'];

  constructor(
    private recipeService: RecipeService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    /* If the user wants to find a random recipe, the home page should handle fetching the recipe
     * and passing it to the recipe component. If the user navigates to the recipe page directly,
     * the recipe component should fetch the recipe instead.
     *
     * This allows the URL to remain constant, for ease of shareability.
     */
    const recipeId = this.route.snapshot.paramMap.get('id');

    this.recipeChangeSubscription = this.recipeService
      .onRecipeChange()
      .subscribe((recipe: Recipe | null) => {
        this.recipe = recipe;

        /* If the ID of the recipe passed in doesn't match the recipe ID in the URL, get the recipe
         * from the URL param. (This shouldn't happen normally.)
         */
        if (this.recipe === null || this.recipe.id.toString() !== recipeId) {
          if (recipeId !== null) {
            this.getRecipe(recipeId);
          } else {
            // No recipe ID was found (shouldn't happen normally)
          }
        }
      });
  }

  ngOnDestroy(): void {
    /* Clear the recipe when leaving this page. This way, if the user navigates to another recipe
     * page, the correct recipe is fetched. Otherwise, the home page can continue fetching the
     * correct recipe.
     */
    this.recipeChangeSubscription?.unsubscribe();
    this.recipeService.resetRecipe();
  }

  getRecipe(id: string) {
    // Get a recipe by ID
    this.isLoading = true;

    this.recipeService.getMockRecipe().subscribe({
      next: (recipe: Recipe) => {
        this.isLoading = false;
        this.recipeService.setRecipe(recipe);
        console.log(recipe);
      },
      error: (error: Error) => {
        this.isLoading = false;
        this.snackBar.open(error.message, 'Dismiss');
      },
    });
  }

  getRandomRecipe() {
    // Show the progress spinner while the recipe is loading
    this.isLoading = true;

    // Show a random, low-effort recipe
    // TODO: replace the mock call with the API call in prod
    this.recipeService.getMockRecipe().subscribe({
      next: (recipe: Recipe) => {
        this.isLoading = false;
        this.recipeService.setRecipe(recipe);
        console.log(recipe);
        this.router.navigate([`/recipe/${recipe.id}`]);
      },
      error: (error: Error) => {
        // Show a snackbar explaining that an error occurred
        this.isLoading = false;
        this.snackBar.open(error.message, 'Dismiss');
      },
    });
  }
}
