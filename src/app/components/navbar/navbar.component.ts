import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';

import { RecipeComponent } from '../recipe/recipe.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isRecipePage = false;
  isFavorite = false;
  isSmallScreen: boolean;
  navItems: string[] = ['Home']; // navigation links to show in the sidenav
  routerConfig: Routes;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    // Detect breakpoint changes so the template can respond
    this.isSmallScreen =
      this.breakpointObserver.isMatched('(max-width: 599px)');
    this.routerConfig = this.router.config;
  }

  ngOnInit(): void {}

  onRouterOutletActivate(event: any) {
    // Check if the recipe component is shown in the router outlet
    this.isRecipePage = event instanceof RecipeComponent;
  }

  toggleFavoriteRecipe() {
    // Placeholder for the heart button
    this.isFavorite = !this.isFavorite;
  }

  getRoute(title: string): string | undefined {
    // Get the route path with the matching title, returns undefined if the title isn't found
    return this.routerConfig.find((route) => route.title === title)?.path;
  }
}
