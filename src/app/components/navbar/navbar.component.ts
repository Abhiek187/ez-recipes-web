import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgIf, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatNavList, MatListItem } from '@angular/material/list';
import {
  MatSidenavContainer,
  MatSidenav,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbar } from '@angular/material/toolbar';
import { Title } from '@angular/platform-browser';
import { Router, Routes, RouterLink, RouterOutlet } from '@angular/router';

import { RecipeComponent } from '../recipe/recipe.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatToolbar,
    MatIconButton,
    MatIcon,
    NgIf,
    MatSidenavContainer,
    MatSidenav,
    MatNavList,
    NgFor,
    MatListItem,
    RouterLink,
    MatSidenavContent,
    RouterOutlet,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isSmallScreen: boolean;
  navItems: string[] = ['Home']; // navigation links to show in the sidenav

  routerConfig: Routes;
  isRecipePage = false;
  isFavorite = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private titleService: Title,
    private snackBar: MatSnackBar
  ) {
    // Detect breakpoint changes so the template can respond
    this.isSmallScreen = this.breakpointObserver.isMatched(Breakpoints.XSmall);
    this.routerConfig = this.router.config;
  }

  ngOnInit(): void {}

  onRouterOutletActivate(event: any) {
    // Check if the recipe component is shown in the router outlet
    this.isRecipePage = event instanceof RecipeComponent;
  }

  getRoute(title: string): string | undefined {
    // Get the route path with the matching title, returns undefined if the title isn't found
    return this.routerConfig.find((route) => route.title === title)?.path;
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
