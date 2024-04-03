import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

import Constants from 'src/app/constants/constants';
import { getRandomElement } from 'src/app/helpers/array';
import RecipeFilter from 'src/app/models/recipe-filter.model';
import Recipe, {
  CUISINES,
  MEAL_TYPES,
  SPICE_LEVELS,
} from 'src/app/models/recipe.model';
import { RecipeService } from 'src/app/services/recipe.service';

// Add null & undefined to all the object's values
type PartialNull<T> = {
  [P in keyof T]?: T[P] | null;
};

// Check that minCals doesn't exceed maxCals
const calorieRangeValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const minCals = control.get('minCals');
  const maxCals = control.get('maxCals');

  return minCals?.value !== null &&
    maxCals?.value !== null &&
    minCals?.value > maxCals?.value
    ? { range: true }
    : null;
};

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
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  filterFormGroup = new FormGroup(
    {
      query: new FormControl(''),
      minCals: new FormControl<number | null>(null, [
        Validators.min(0),
        Validators.max(2000),
      ]),
      maxCals: new FormControl<number | null>(null, [
        Validators.min(0),
        Validators.max(2000),
      ]),
      vegetarian: new FormControl(false),
      vegan: new FormControl(false),
      glutenFree: new FormControl(false),
      healthy: new FormControl(false),
      cheap: new FormControl(false),
      sustainable: new FormControl(false),
      spiceLevel: new FormControl([]),
      type: new FormControl([]),
      culture: new FormControl([]),
    },
    { validators: calorieRangeValidator }
  );
  readonly Errors = {
    min: 'Calories must be ≥ 0',
    max: 'Calories must be ≤ 2000',
    range: 'Max calories cannot exceed min calories',
    noResults: 'No recipes found',
  };

  isLoading = false;
  private defaultLoadingMessage = '';
  loadingMessage = this.defaultLoadingMessage;
  noRecipesFound = false;

  // Exclude unknown cases and sort for ease of reference
  readonly spiceLevels = SPICE_LEVELS.filter(
    (spiceLevel) => spiceLevel !== 'unknown'
  );
  readonly mealTypes = [...MEAL_TYPES].sort();
  readonly cuisines = [...CUISINES].sort();

  constructor(
    private recipeService: RecipeService,
    private snackBar: MatSnackBar
  ) {}

  onSubmit() {
    const recipeFilter = this.removeNullValues(this.filterFormGroup.value);
    console.log('Submitted recipe filter:', recipeFilter);
    this.isLoading = true;
    const timer = this.showLoadingMessages();

    this.recipeService.getRecipesWithFilter(recipeFilter).subscribe({
      next: (recipes: Recipe[]) => {
        this.isLoading = false;
        clearInterval(timer);
        console.log('Found recipes:', recipes);
        this.noRecipesFound = recipes.length === 0;
      },
      error: (error: Error) => {
        this.isLoading = false;
        clearInterval(timer);
        this.snackBar.open(error.message, 'Dismiss');
      },
    });
  }

  /* FormControls use null for missing values, but HttpParams doesn't except null values.
   * So, convert all null values to undefined (aka remove them).
   */
  removeNullValues(filter: PartialNull<RecipeFilter>): RecipeFilter {
    return Object.fromEntries(
      Object.entries(filter).filter(([, value]) => value !== null)
    );
  }

  showLoadingMessages() {
    this.loadingMessage = this.defaultLoadingMessage;

    return setInterval(() => {
      this.loadingMessage = getRandomElement(Constants.loadingMessages);
    }, 3000);
  }
}
