import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isFavorite = false;
  isSmallScreen: boolean;
  navItems: string[] = ['Home'];
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

  toggleFavoriteRecipe() {
    // Placeholder for the heart button
    this.isFavorite = !this.isFavorite;
  }

  getRoute(title: string): string | undefined {
    // Get the route path with the matching title, returns undefined if the title isn't found
    return this.routerConfig.find((route) => route.title === title)?.path;
  }
}
