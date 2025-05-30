import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import Recipe from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { TermsService } from 'src/app/services/terms.service';

@Component({
  selector: 'app-recipe',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.scss',
})
export class RecipeComponent implements OnInit, OnDestroy {
  private recipeService = inject(RecipeService);
  private snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private titleService = inject(Title);
  private termsService = inject(TermsService);

  recipe: Recipe | null = null;
  isLoading = false;
  dictionary?: { [word: string]: string };

  recipeChangeSubscription?: Subscription;
  routerSubscription?: Subscription;
  getRecipeSubscription?: Subscription;

  // Nutrients that should be bold on the nutrition label
  nutrientHeadings = ['Calories', 'Fat', 'Carbohydrates', 'Protein'];

  ngOnInit(): void {
    /* If the user wants to find a random recipe, the home page should handle fetching the recipe
     * and passing it to the recipe component. If the user navigates to the recipe page directly,
     * the recipe component should fetch the recipe instead.
     *
     * This allows the URL to remain constant, for ease of shareability.
     */
    this.recipeChangeSubscription = this.recipeService
      .onRecipeChange()
      .subscribe((recipe: Recipe | null) => {
        this.updateRecipe(recipe);
        const recipeId = this.route.snapshot.paramMap.get('id');

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

    // Respond to navigating forward and backward by loading the correct recipe
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (
        event instanceof NavigationStart &&
        event.navigationTrigger === 'popstate'
      ) {
        // Ignore if not navigating to a recipe URL
        if (/^\/recipe\/\d+$/.test(event.url)) {
          const [recipeId] = event.url.split('/').slice(-1);
          this.getRecipe(recipeId);
        }
      }
    });

    const terms = this.termsService.getCachedTerms();
    // Make it easier to lookup words and their definitions (O(n) time instead of O(n^2) time)
    this.dictionary = terms?.reduce<{
      [word: string]: string;
    }>((dict, term) => {
      dict[term.word] = term.definition;
      return dict;
    }, {});
  }

  ngOnDestroy(): void {
    /* Clear the recipe when leaving this page. This way, if the user navigates to another recipe
     * page, the correct recipe is fetched. Otherwise, the home page can continue fetching the
     * correct recipe.
     */
    this.recipeChangeSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
    this.recipeService.resetRecipe();
    this.getRecipeSubscription?.unsubscribe();
  }

  updateRecipe(recipe: Recipe | null) {
    // Helper method to perform common actions after updating the recipe property
    this.recipe = recipe;
    const prefix = 'EZ Recipes | ';
    this.titleService.setTitle(
      prefix +
        (this.recipe?.name ??
          (this.isLoading ? 'Loading...' : 'Recipe Not Found'))
    );

    if (recipe !== null) {
      this.recipeService.saveRecentRecipe(recipe).catch((error: Error) => {
        console.error('Failed to save recipe to recents:', error.message);
      });
    }
  }

  getRecipe(id: string) {
    // Get a recipe by ID
    this.isLoading = true;

    this.getRecipeSubscription = this.recipeService
      .getRecipeById(id)
      .subscribe({
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

  addPreparation() {
    // Placeholder for the "I Made This!" button
    this.snackBar.open('Nice! Hope it was tasty!', undefined, {
      duration: 2000, // automatically dismiss after 2 seconds
    });
  }

  getRandomRecipe() {
    // Show the progress spinner while the recipe is loading
    this.isLoading = true;

    // Show a random, low-effort recipe
    this.getRecipeSubscription = this.recipeService
      .getRandomRecipe()
      .subscribe({
        next: (recipe: Recipe) => {
          this.isLoading = false;
          this.updateRecipe(recipe);
          console.log(recipe);
          // Change the URL without reloading the component
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
