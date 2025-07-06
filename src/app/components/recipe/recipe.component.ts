import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
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
import { finalize } from 'rxjs';

import Recipe, { RecipeUpdate } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { TermsService } from 'src/app/services/terms.service';
import { ShorthandPipe } from '../../pipes/shorthand.pipe';
import { RecipeRatingComponent } from '../utils/recipe-rating/recipe-rating.component';
import { ChefService } from 'src/app/services/chef.service';

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
    RecipeRatingComponent,
    ShorthandPipe,
  ],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.scss',
})
export class RecipeComponent implements OnInit, OnDestroy {
  private recipeService = inject(RecipeService);
  private chefService = inject(ChefService);
  private snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private titleService = inject(Title);
  private termsService = inject(TermsService);
  private destroyRef = inject(DestroyRef);

  recipe = this.recipeService.recipe;
  chef = this.chefService.chef;
  isLoading = signal(false);
  dictionary = signal<{ [word: string]: string } | undefined>(undefined);

  // Nutrients that should be bold on the nutrition label
  readonly nutrientHeadings = ['Calories', 'Fat', 'Carbohydrates', 'Protein'];

  constructor() {
    /* If the user wants to find a random recipe, the home page should handle fetching the recipe
     * and passing it to the recipe component. If the user navigates to the recipe page directly,
     * the recipe component should fetch the recipe instead.
     *
     * This allows the URL to remain constant, for ease of shareability.
     *
     * toObservable = effect for specific signals
     * toObservable/effect can only be called in a constructor, not in ngOnInit
     */
    toObservable(this.recipe)
      .pipe(takeUntilDestroyed())
      .subscribe((recipe: Recipe | null) => {
        this.updateRecipe(recipe);
        const recipeId = this.route.snapshot.paramMap.get('id');

        /* If the ID of the recipe passed in doesn't match the recipe ID in the URL, get the recipe
         * from the URL param. (This shouldn't happen normally.)
         */
        if (recipe === null || recipe?.id?.toString() !== recipeId) {
          if (recipeId !== null) {
            this.getRecipe(recipeId);
          } else {
            // No recipe ID was found (shouldn't happen normally)
          }
        }
      });

    // Respond to navigating forward and backward by loading the correct recipe
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
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
  }

  ngOnInit(): void {
    const terms = this.termsService.getCachedTerms();
    // Make it easier to lookup words and their definitions (O(n) time instead of O(n^2) time)
    this.dictionary.set(
      terms?.reduce<{
        [word: string]: string;
      }>((dict, term) => {
        dict[term.word] = term.definition;
        return dict;
      }, {})
    );
  }

  ngOnDestroy(): void {
    /* Clear the recipe when leaving this page. This way, if the user navigates to another recipe
     * page, the correct recipe is fetched. Otherwise, the home page can continue fetching the
     * correct recipe.
     */
    this.recipeService.recipe.set(null);
  }

  private updateRecipe(recipe: Recipe | null) {
    // Helper method to perform common actions after updating the recipe property
    const prefix = 'EZ Recipes | ';
    this.titleService.setTitle(
      prefix +
        (recipe?.name ?? (this.isLoading() ? 'Loading...' : 'Recipe Not Found'))
    );

    if (recipe !== null) {
      // If logged in, save recipe to chef's profile. Otherwise, save to temporary storage.
      this.recipeService.saveRecentRecipe(recipe).catch((error: Error) => {
        console.error('Failed to save recipe to recents:', error.message);
      });
      this.updateRecipeViews(recipe);
    }
  }

  private updateRecipeViews(recipe: Recipe) {
    // Recipe view updates can occur in the background without impacting the UX
    const recipeUpdate: RecipeUpdate = {
      view: true,
    };

    this.recipeService.updateRecipe(recipe.id, recipeUpdate).subscribe({
      next: () => {
        this.chefService.chef.update(
          (chef) =>
            chef && {
              ...chef,
              recentRecipes: {
                ...chef?.recentRecipes,
                [recipe.id]: new Date().toISOString(),
              },
            }
        );
      },
      error: (error) => {
        console.error(
          `Failed to update the recipe view count: ${error.message}`
        );
      },
    });
  }

  private getRecipe(id: string) {
    // Get a recipe by ID
    this.isLoading.set(true);

    this.recipeService
      .getRecipeById(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        error: (error: Error) => {
          this.snackBar.open(error.message, 'Dismiss');
        },
      });
  }

  onRate(rating: number) {
    const recipeId = this.recipe()?.id;
    const recipeUpdate: RecipeUpdate = {
      rating,
    };

    if (this.chef() === undefined || recipeId === undefined) {
      this.snackBar.open(
        'You must be signed in to rate this recipe',
        'Dismiss'
      );
      return;
    }

    this.recipeService
      .updateRecipe(recipeId, recipeUpdate)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.chefService.chef.update(
            (chef) =>
              chef && {
                ...chef,
                ratings: {
                  ...chef?.ratings,
                  [recipeId]: rating,
                },
              }
          );
        },
        error: (error) => {
          this.snackBar.open(error.message, 'Dismiss');
        },
      });
  }

  getRandomRecipe() {
    // Show the progress spinner while the recipe is loading
    this.isLoading.set(true);

    // Show a random, low-effort recipe
    this.recipeService
      .getRandomRecipe()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (recipe: Recipe) => {
          // Change the URL without reloading the component
          this.router.navigate([`/recipe/${recipe.id}`]);
        },
        error: (error: Error) => {
          // Show a snackbar explaining that an error occurred
          this.snackBar.open(error.message, 'Dismiss');
        },
      });
  }
}
