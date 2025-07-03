import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import Constants from 'src/app/constants/constants';
import { getRandomElement } from 'src/app/helpers/array';
import Recipe from 'src/app/models/recipe.model';
import { RecipeService } from 'src/app/services/recipe.service';
import { RecipeCardComponent } from '../utils/recipe-card/recipe-card.component';
import { RecipeCardLoaderComponent } from '../utils/recipe-card-loader/recipe-card-loader.component';

@Component({
  selector: 'app-home',
  imports: [
    MatButtonModule,
    MatDividerModule,
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
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  isLoading = signal(false);
  private readonly defaultLoadingMessage = '';
  loadingMessage = signal(this.defaultLoadingMessage);
  recentRecipes = signal<Recipe[]>([]);

  ngOnInit(): void {
    // Get all the recent recipes from IndexedDB
    this.recipeService.getRecentRecipes().subscribe({
      next: (recipes: Recipe[]) => {
        this.recentRecipes.set(recipes);
      },
      error: (error: Error) => {
        this.snackBar.open(error.message, 'Dismiss');
      },
    });
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
}
