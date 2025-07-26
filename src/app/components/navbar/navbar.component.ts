import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Component,
  Type,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { RecipeComponent } from '../recipe/recipe.component';
import { routes } from 'src/app/app-routing.module';
import { ChefService } from 'src/app/services/chef.service';
import { RecipeUpdate } from 'src/app/models/recipe.model';
import { RecipeService } from 'src/app/services/recipe.service';
import Constants from 'src/app/constants/constants';
import Theme from 'src/app/models/theme.model';

@Component({
  selector: 'app-navbar',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private titleService = inject(Title);
  private snackBar = inject(MatSnackBar);
  private recipeService = inject(RecipeService);
  private chefService = inject(ChefService);

  // Detect breakpoint changes so the template can respond
  isSmallScreen = signal(this.breakpointObserver.isMatched(Breakpoints.XSmall));
  // Navigation links to show in the sidenav
  readonly navItems = [
    routes.home,
    routes.search,
    routes.glossary,
    routes.profile,
  ];

  recipe = this.recipeService.recipe;
  chef = this.chefService.chef;

  isRecipePage = signal(false);
  isFavorite = computed(() =>
    this.recipe() === null
      ? false
      : this.chef()?.favoriteRecipes?.includes(this.recipe()!.id.toString()) ??
        false
  );
  isDarkMode = signal(
    localStorage.getItem(Constants.LocalStorage.theme) === Theme.Dark
  );

  constructor() {
    this.breakpointObserver
      .observe(Breakpoints.XSmall)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.isSmallScreen.set(
          this.breakpointObserver.isMatched(Breakpoints.XSmall)
        );
      });

    /** Signals don't update to localStorage changes,
     * need to update signal first, then update localStorage
     */
    effect(() => {
      localStorage.setItem(
        Constants.LocalStorage.theme,
        this.isDarkMode() ? Theme.Dark : Theme.Light
      );
    });
  }

  onRouterOutletActivate(event: Type<Component>) {
    // Check if the recipe component is shown in the router outlet
    this.isRecipePage.set(event instanceof RecipeComponent);
  }

  toggleTheme() {
    this.isDarkMode.update((currentTheme) => !currentTheme);
  }

  toggleFavoriteRecipe() {
    const recipeId = this.recipe()?.id;
    if (recipeId === undefined) return;
    const recipeUpdate: RecipeUpdate = {
      isFavorite: !this.isFavorite(),
    };

    this.recipeService.updateRecipe(recipeId, recipeUpdate).subscribe({
      next: () => {
        const newFavoriteRecipes = this.isFavorite()
          ? this.chef()?.favoriteRecipes?.filter(
              (id) => id !== recipeId.toString()
            )
          : this.chef()?.favoriteRecipes?.concat([recipeId.toString()]);
        this.chef.update(
          (chef) =>
            chef && {
              ...chef,
              favoriteRecipes: newFavoriteRecipes ?? [],
            }
        );

        this.recipeService
          .toggleFavoriteRecentRecipe(recipeId)
          .catch((error) => {
            console.error(
              'Failed to toggle isFavorite for recent recipe:',
              error.message
            );
          });
      },
      error: (error) => {
        this.snackBar.open(error.message, 'Dismiss');
      },
    });
  }

  async shareRecipe() {
    if (navigator.share !== undefined) {
      // Show the platform-specific share menu
      try {
        await navigator.share({
          title: this.titleService.getTitle(),
          text: 'Check out this low-effort recipe!',
          url: location.href, // this.router.url only returns the path, not the full URL
        });
      } catch (error) {
        console.error('Error sharing:', error);
        this.snackBar.open(`Error sharing: ${error}`, 'Dismiss');
      }
    } else if (navigator.clipboard !== undefined) {
      // Copy the recipe URL to the clipboard for sharing
      try {
        await navigator.clipboard.writeText(location.href);
        this.snackBar.open(
          'Copied the recipe URL to your clipboard!',
          undefined,
          {
            duration: 2000,
          }
        );
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        this.snackBar.open(`Error copying to clipboard: ${error}`, 'Dismiss');
      }
    } else {
      // Show the user the recipe URL to copy and share
      prompt('Share this recipe with your friends!', location.href);
    }
  }
}
