import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import Recipe from 'src/app/models/recipe.model';
import { RecipeService } from 'src/app/services/recipe.service';
import { RecipeRatingComponent } from '../recipe-rating/recipe-rating.component';

@Component({
  selector: 'app-recipe-card',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    RecipeRatingComponent,
  ],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.scss',
})
export class RecipeCardComponent implements OnInit {
  private recipeService = inject(RecipeService);
  private router = inject(Router);

  readonly recipe = input.required<Recipe>();
  calories?: Recipe['nutrients'][number];
  isFavorite = false;

  ngOnInit(): void {
    this.calories = this.recipe().nutrients.find(
      (nutrient) => nutrient.name === 'Calories'
    );
  }

  toggleFavoriteRecipe(event: MouseEvent) {
    // Don't trigger the card's click event
    event.stopPropagation();
    // Placeholder for the heart button
    this.isFavorite = !this.isFavorite;
  }

  onRate(rating: number) {
    console.log('clicked rating:', rating);
  }

  openRecipe() {
    const recipe = this.recipe();
    this.recipeService.setRecipe(recipe);
    console.log(recipe);
    this.router.navigate([`/recipe/${recipe.id}`]);
    // Scroll to the top so the recipe header can be viewed
    const sidenav = document.querySelector<HTMLElement>('.sidenav-content');
    sidenav?.scroll(0, 0);
  }
}
