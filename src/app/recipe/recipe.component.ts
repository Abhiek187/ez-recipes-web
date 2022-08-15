import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Recipe } from '../models/recipe.model';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent implements OnInit {
  @Input() recipe!: Recipe;
  @Output() loadRecipe = new EventEmitter();

  // Nutrients that should be bold on the nutrition label
  nutrientHeadings = ['Calories', 'Fat', 'Carbohydrates', 'Protein'];

  constructor() {}

  ngOnInit(): void {}

  onShowAnotherRecipe() {
    // Notify the app component to load another recipe
    this.loadRecipe.emit();
  }
}
