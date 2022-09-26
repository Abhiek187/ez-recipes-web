import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import Recipe from 'src/app/models/recipe.model';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isLoading = false;

  constructor(
    private recipeService: RecipeService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  getRandomRecipe() {
    // Show the progress spinner while the recipe is loading
    this.isLoading = true;

    // Show a random, low-effort recipe
    // TODO: replace the mock call with the API call in prod
    this.recipeService.getRandomRecipe().subscribe({
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
