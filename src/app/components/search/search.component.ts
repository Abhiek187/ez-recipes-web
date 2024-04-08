import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
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
  Cuisine,
  MEAL_TYPES,
  MealType,
  SPICE_LEVELS,
  SpiceLevel,
} from 'src/app/models/recipe.model';
import { RecipeService } from 'src/app/services/recipe.service';

// Add null & undefined to all the object's values
type PartialNull<T> = {
  [P in keyof T]?: T[P] | null;
};

// FormControl names will need to be referenced in the component, template, and test
const FilterForm = {
  query: 'query',
  minCals: 'minCals',
  maxCals: 'maxCals',
  vegetarian: 'vegetarian',
  vegan: 'vegan',
  glutenFree: 'glutenFree',
  healthy: 'healthy',
  cheap: 'cheap',
  sustainable: 'sustainable',
  spiceLevel: 'spiceLevel',
  type: 'type',
  culture: 'culture',
} as const;

// Check that minCals doesn't exceed maxCals
const calorieRangeValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const minCals = control.get(FilterForm.minCals);
  const maxCals = control.get(FilterForm.maxCals);

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
  animations: [
    trigger('showHide', [
      state(
        'show',
        style({
          height: '25px',
          opacity: 1,
        })
      ),
      state(
        'hide',
        style({
          height: '0px',
          opacity: 0,
        })
      ),
      transition('show => hide', [animate('0.2s ease-in-out')]),
      transition('hide => show', [animate('0.2s ease-in-out')]),
    ]),
  ],
})
export class SearchComponent {
  filterFormNames = FilterForm;
  filterFormGroup = new FormGroup(
    {
      [FilterForm.query]: new FormControl(''),
      [FilterForm.minCals]: new FormControl<number | null>(null, [
        Validators.min(0),
        Validators.max(2000),
      ]),
      [FilterForm.maxCals]: new FormControl<number | null>(null, [
        Validators.min(0),
        Validators.max(2000),
      ]),
      [FilterForm.vegetarian]: new FormControl(false),
      [FilterForm.vegan]: new FormControl(false),
      [FilterForm.glutenFree]: new FormControl(false),
      [FilterForm.healthy]: new FormControl(false),
      [FilterForm.cheap]: new FormControl(false),
      [FilterForm.sustainable]: new FormControl(false),
      [FilterForm.spiceLevel]: new FormControl<SpiceLevel[]>([]),
      [FilterForm.type]: new FormControl<MealType[]>([]),
      [FilterForm.culture]: new FormControl<Cuisine[]>([]),
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
