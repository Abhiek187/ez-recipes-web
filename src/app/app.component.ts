import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Recipe } from './models/recipe.model';
import { RecipeService } from './services/recipe.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  recipe?: Recipe;
  isLoading = false;

  constructor(
    private recipeService: RecipeService,
    private snackBar: MatSnackBar
  ) {}

  getRandomRecipe() {
    // Show the progress spinner while the recipe is loading
    this.isLoading = true;

    // Show a random, low-effort recipe
    // TODO: replace the mock call with the API call in prod
    this.recipeService.getMockRecipe().subscribe({
      next: (recipe: Recipe) => {
        this.recipe = recipe;
        console.log(recipe);
      },
      error: (error: string) => {
        // Show a snackbar explaining that an error occurred
        this.snackBar.open(error, 'Dismiss');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
