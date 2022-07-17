import { Component } from '@angular/core';
import { Recipe } from './models/recipe.model';
import { RecipeService } from './services/recipe.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  recipe?: Recipe;

  constructor(private recipeService: RecipeService) {}

  getRandomRecipe() {
    // Show a random, low-effort recipe
    // TODO: replace the mock call with the API call in prod
    this.recipeService.getMockRecipe().subscribe((recipe: Recipe) => {
      this.recipe = recipe;
      console.log(recipe);
    });
  }
}
