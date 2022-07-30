import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../models/recipe.model';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent implements OnInit {
  @Input() recipe!: Recipe;

  // Nutrients that should be bold on the nutrition label
  nutrientHeadings = ['Calories', 'Fat', 'Carbohydrates', 'Protein'];

  constructor() {}

  ngOnInit(): void {}
}
