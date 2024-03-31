import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import {
  CUISINES,
  MEAL_TYPES,
  SPICE_LEVELS,
} from 'src/app/models/recipe.model';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  filterFormGroup = new FormGroup({
    query: new FormControl(''),
    minCals: new FormControl(0, [Validators.min(0), Validators.max(2000)]),
    maxCals: new FormControl(0, [Validators.min(0), Validators.max(2000)]),
    vegetarian: new FormControl(false),
    vegan: new FormControl(false),
    glutenFree: new FormControl(false),
    healthy: new FormControl(false),
    cheap: new FormControl(false),
    sustainable: new FormControl(false),
    spiceLevel: new FormControl([]),
    type: new FormControl([]),
    culture: new FormControl([]),
  });

  // Exclude unknown cases and sort for ease of reference
  readonly spiceLevels = SPICE_LEVELS.filter(
    (spiceLevel) => spiceLevel !== 'unknown'
  );
  readonly mealTypes = [...MEAL_TYPES].sort();
  readonly cuisines = [...CUISINES].sort();

  constructor(private recipeService: RecipeService) {}

  onSubmit() {
    const recipeFilter = { ...this.filterFormGroup.value };
    console.log('Submitted recipe filter:', recipeFilter);
    //this.recipeService.getRecipesWithFilter(recipeFilter);
  }
}
