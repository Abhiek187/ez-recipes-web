import { Component } from '@angular/core';
import { Recipe } from 'ez-recipes-server/models/Recipe';
import { RecipeService } from './recipe.service';

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
    this.recipeService.getRandomRecipe().subscribe((recipe: Recipe) => {
      this.recipe = recipe;
    });
  }
}
