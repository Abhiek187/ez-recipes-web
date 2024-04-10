import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import Recipe from 'src/app/models/recipe.model';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.scss',
})
export class RecipeCardComponent implements OnInit {
  @Input({ required: true }) recipe!: Recipe;
  calories?: Recipe['nutrients'][number];
  isFavorite = false;

  constructor(private recipeService: RecipeService, private router: Router) {}

  ngOnInit(): void {
    this.calories = this.recipe.nutrients.find(
      (nutrient) => nutrient.name === 'Calories'
    );
  }

  toggleFavoriteRecipe(event: MouseEvent) {
    // Don't trigger the card's click event
    event.stopPropagation();
    // Placeholder for the heart button
    this.isFavorite = !this.isFavorite;
  }

  openRecipe() {
    this.recipeService.setRecipe(this.recipe);
    console.log(this.recipe);
    this.router.navigate([`/recipe/${this.recipe.id}`]);
  }
}
