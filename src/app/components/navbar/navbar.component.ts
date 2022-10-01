import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  private _isFavorite = false;
  heartIcon = 'favorite_border';

  isSmallScreen: boolean;
  navItems: string[] = ['Home'];
  routerConfig: Routes;

  get isFavorite(): boolean {
    return this._isFavorite;
  }

  set isFavorite(value: boolean) {
    // Update the material icon to match the corresponding boolean value
    this._isFavorite = value;
    this.heartIcon = this._isFavorite ? 'favorite' : 'favorite_border';
  }

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

  toggleFavoriteRecipe() {
    // Placeholder for the heart button
    this.isFavorite = !this.isFavorite;
  }

  getRoute(title: string): string | undefined {
    // Get the route path with the matching title, returns undefined if the title isn't found
    return this.routerConfig.find((route) => route.title === title)?.path;
  }
}
