import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, Type, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { RecipeComponent } from '../recipe/recipe.component';
import { routes } from 'src/app/app-routing.module';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
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
export class NavbarComponent implements OnInit, OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);
  private titleService = inject(Title);
  private snackBar = inject(MatSnackBar);

  isSmallScreen: boolean;
  // Navigation links to show in the sidenav
  navItems = [routes.home, routes.search, routes.glossary];

  isRecipePage = false;
  isFavorite = false;
  breakpointSubscription?: Subscription;

  constructor() {
    // Detect breakpoint changes so the template can respond
    this.isSmallScreen = this.breakpointObserver.isMatched(Breakpoints.XSmall);
  }

  ngOnInit(): void {
    this.breakpointSubscription = this.breakpointObserver
      .observe(Breakpoints.XSmall)
      .subscribe(() => {
        this.isSmallScreen = this.breakpointObserver.isMatched(
          Breakpoints.XSmall
        );
      });
  }

  ngOnDestroy(): void {
    this.breakpointSubscription?.unsubscribe();
  }

  onRouterOutletActivate(event: Type<Component>) {
    // Check if the recipe component is shown in the router outlet
    this.isRecipePage = event instanceof RecipeComponent;
  }

  toggleFavoriteRecipe() {
    // Placeholder for the heart button
    this.isFavorite = !this.isFavorite;
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
