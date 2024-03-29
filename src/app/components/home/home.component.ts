import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import Constants from 'src/app/constants/constants';
import { getRandomElement } from 'src/app/helpers/array';
import Recipe from 'src/app/models/recipe.model';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isLoading = false;
  private defaultLoadingMessage = '';
  loadingMessage = this.defaultLoadingMessage;

  constructor(
    private recipeService: RecipeService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  getRandomRecipe() {
    // Show the progress spinner while the recipe is loading
    this.isLoading = true;
    const timer = this.showLoadingMessages();

    // Show a random, low-effort recipe
    this.recipeService.getRandomRecipe().subscribe({
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
