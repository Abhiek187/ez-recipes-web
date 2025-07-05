import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { finalize, materialize, zip } from 'rxjs';

import Constants from 'src/app/constants/constants';
import { getRandomElement } from 'src/app/helpers/array';
import Recipe from 'src/app/models/recipe.model';
import { RecipeService } from 'src/app/services/recipe.service';
import { RecipeCardComponent } from '../utils/recipe-card/recipe-card.component';
import { RecipeCardLoaderComponent } from '../utils/recipe-card-loader/recipe-card-loader.component';
import { ChefService } from 'src/app/services/chef.service';

@Component({
  selector: 'app-home',
  imports: [
    MatButtonModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    RecipeCardComponent,
    RecipeCardLoaderComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private recipeService = inject(RecipeService);
  private chefService = inject(ChefService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  isLoading = signal(false);
  private readonly defaultLoadingMessage = '';
  loadingMessage = signal(this.defaultLoadingMessage);
  recentRecipesLocal = signal<Recipe[]>([]);
  isLoggedIn = computed(() => this.chefService.chef() !== undefined);

  private didExpandFavorites = signal(false);
  favoriteRecipes = signal<(Recipe | undefined)[]>([]);
  private didExpandRecents = signal(false);
  recentRecipesRemote = signal<(Recipe | undefined)[]>([]);
  private didExpandRatings = signal(false);
  ratedRecipes = signal<(Recipe | undefined)[]>([]);

  ngOnInit(): void {
    // Get all the recent recipes from IndexedDB
    this.recipeService.getRecentRecipes().subscribe({
      next: (recipes: Recipe[]) => {
        this.recentRecipesLocal.set(recipes);
      },
      error: (error: Error) => {
        this.snackBar.open(error.message, 'Dismiss');
      },
    });

    if (!this.isLoggedIn()) {
      const token = localStorage.getItem(Constants.LocalStorage.token);
      if (token === null) return;
      this.chefService.getChef(token).subscribe();
    }
  }

  getRandomRecipe() {
    // Show the progress spinner while the recipe is loading
    this.isLoading.set(true);
    const timer = this.showLoadingMessages();

    // Show a random, low-effort recipe
    this.recipeService
      .getRandomRecipe()
      // Cancel all pending requests to avoid unintentional navigation
      .pipe(
        // destroyRef is required if called outside a constructor
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
          clearInterval(timer);
        })
      )
      .subscribe({
        next: (recipe: Recipe) => {
          this.router.navigate([`/recipe/${recipe.id}`]);
        },
        error: (error: Error) => {
          // Show a snackbar explaining that an error occurred
          this.snackBar.open(error.message, 'Dismiss');
        },
      });
  }

  showLoadingMessages() {
    // Don't show any messages initially if the recipe loads quickly
    this.loadingMessage.set(this.defaultLoadingMessage);

    return setInterval(() => {
      this.loadingMessage.set(getRandomElement(Constants.loadingMessages));
    }, 3000);
  }

  onExpandFavorites() {
    // Only fetch the recipes once per load
    if (this.isLoggedIn() && !this.didExpandFavorites()) {
      this.didExpandFavorites.set(true);

      const chef = this.chefService.chef();
      const recipeIds = chef?.favoriteRecipes ?? [];
      this.favoriteRecipes.set(recipeIds.map(() => undefined)); // undefined == loading

      // Fetch all recipes in parallel
      // forkJoin == Promise.all, zip+materialize == Promise.allSettled
      zip(
        recipeIds.map((recipeId) =>
          this.recipeService.getRecipeById(recipeId).pipe(materialize())
        )
      )
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (notifications) => {
            const newFavoriteRecipes = this.favoriteRecipes();

            for (const [
              index,
              { kind, value, error },
            ] of notifications.entries()) {
              // N == next, E == error, C == complete
              if (kind === 'N') {
                newFavoriteRecipes[index] = value;
              } else if (kind === 'E') {
                console.warn(
                  `Failed to get recipe ${recipeIds[index]}:`,
                  error.message
                );
              }
            }

            // Remove all recipes that failed to load
            this.favoriteRecipes.set(
              newFavoriteRecipes.filter((recipe) => recipe !== undefined)
            );
          },
          error: (error) => {
            console.error('Failed to get all favorite recipes:', error.message);
          },
        });
    }
  }

  onExpandRecents() {
    if (this.isLoggedIn() && !this.didExpandRecents()) {
      this.didExpandRecents.set(true);

      const chef = this.chefService.chef();
      // Sort the recipe IDs by most recent timestamp
      const recipeIds = Object.entries(chef?.recentRecipes ?? {})
        .toSorted(([, time1], [, time2]) => time2.localeCompare(time1))
        .map(([recipeId]) => recipeId);
      this.recentRecipesRemote.set(recipeIds.map(() => undefined));

      zip(
        recipeIds.map((recipeId) =>
          this.recipeService.getRecipeById(recipeId).pipe(materialize())
        )
      )
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (notifications) => {
            const newRecentRecipes = this.recentRecipesRemote();

            for (const [
              index,
              { kind, value, error },
            ] of notifications.entries()) {
              if (kind === 'N') {
                newRecentRecipes[index] = value;
              } else if (kind === 'E') {
                console.warn(
                  `Failed to get recipe ${recipeIds[index]}:`,
                  error.message
                );
              }
            }

            this.recentRecipesRemote.set(
              newRecentRecipes.filter((recipe) => recipe !== undefined)
            );
          },
          error: (error) => {
            console.error('Failed to get all recent recipes:', error.message);
          },
        });
    }
  }

  onExpandRatings() {
    if (this.isLoggedIn() && !this.didExpandRatings()) {
      this.didExpandRatings.set(true);

      const chef = this.chefService.chef();
      const recipeIds = Object.keys(chef?.ratings ?? {});
      this.ratedRecipes.set(recipeIds.map(() => undefined));

      zip(
        recipeIds.map((recipeId) =>
          this.recipeService.getRecipeById(recipeId).pipe(materialize())
        )
      )
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (notifications) => {
            const newRatedRecipes = this.ratedRecipes();

            for (const [
              index,
              { kind, value, error },
            ] of notifications.entries()) {
              if (kind === 'N') {
                newRatedRecipes[index] = value;
              } else if (kind === 'E') {
                console.warn(
                  `Failed to get recipe ${recipeIds[index]}:`,
                  error.message
                );
              }
            }

            this.ratedRecipes.set(
              newRatedRecipes.filter((recipe) => recipe !== undefined)
            );
          },
          error: (error) => {
            console.error('Failed to get all rated recipes:', error.message);
          },
        });
    }
  }
}
