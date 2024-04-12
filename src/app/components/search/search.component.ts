import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule, Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import Constants from 'src/app/constants/constants';
import { getRandomElement, toArray } from 'src/app/helpers/array';
import RecipeFilter from 'src/app/models/recipe-filter.model';
import Recipe, {
  CUISINES,
  Cuisine,
  MEAL_TYPES,
  MealType,
  SPICE_LEVELS,
  SpiceLevel,
  isValidCuisine,
  isValidMealType,
  isValidSpiceLevel,
} from 'src/app/models/recipe.model';
import { RecipeService } from 'src/app/services/recipe.service';
import { RecipeCardComponent } from '../recipe-card/recipe-card.component';
import { isNumeric } from 'src/app/helpers/string';

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
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    RecipeCardComponent,
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
export class SearchComponent implements OnInit, OnDestroy {
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

  queryParamsSubscription?: Subscription;
  valueChangeSubscription?: Subscription;

  isLoading = false;
  private defaultLoadingMessage = '';
  loadingMessage = this.defaultLoadingMessage;
  noRecipesFound = false;
  recipes: Recipe[] = [];

  // Exclude unknown cases and sort for ease of reference
  readonly spiceLevels = SPICE_LEVELS.filter(
    (spiceLevel) => spiceLevel !== 'unknown'
  );
  readonly mealTypes = [...MEAL_TYPES].sort();
  readonly cuisines = [...CUISINES].sort();

  constructor(
    private recipeService: RecipeService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Initialize the form based on the query parameters
    this.queryParamsSubscription = this.route.queryParams.subscribe(
      (params) => {
        this.filterFormGroup.patchValue({
          ...params,
          // Parse all non-string values
          [FilterForm.minCals]: isNumeric(params.minCals)
            ? Number(params.minCals)
            : null,
          [FilterForm.maxCals]: isNumeric(params.maxCals)
            ? Number(params.maxCals)
            : null,
          [FilterForm.vegetarian]: params.vegetarian === 'true',
          [FilterForm.vegan]: params.vegan === 'true',
          [FilterForm.glutenFree]: params.glutenFree === 'true',
          [FilterForm.healthy]: params.healthy === 'true',
          [FilterForm.cheap]: params.cheap === 'true',
          [FilterForm.sustainable]: params.sustainable === 'true',
          // 0 = undefined, 1 = string, 2+ = array
          [FilterForm.spiceLevel]: toArray(params.spiceLevel).filter(
            (spiceLevel): spiceLevel is SpiceLevel =>
              isValidSpiceLevel(spiceLevel)
          ),
          [FilterForm.type]: toArray(params.type).filter(
            (spiceLevel): spiceLevel is MealType => isValidMealType(spiceLevel)
          ),
          [FilterForm.culture]: toArray(params.culture).filter(
            (spiceLevel): spiceLevel is Cuisine => isValidCuisine(spiceLevel)
          ),
        });
      }
    );

    this.valueChangeSubscription = this.filterFormGroup.valueChanges.subscribe(
      (filter) => {
        // Update the query params with the selected filters
        const urlTreePath = this.router
          .createUrlTree([], {
            queryParams: filter,
          })
          .toString();

        if (this.location.path() === urlTreePath) {
          // Don't add duplicate items to the browser's history
          this.location.replaceState(urlTreePath);
        } else {
          this.location.go(urlTreePath);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.queryParamsSubscription?.unsubscribe();
    this.valueChangeSubscription?.unsubscribe();
  }

  onSubmit() {
    const recipeFilter = this.removeNullValues(this.filterFormGroup.value);
    this.isLoading = true;
    const timer = this.showLoadingMessages();

    this.recipeService.getRecipesWithFilter(recipeFilter).subscribe({
      next: (recipes: Recipe[]) => {
        this.isLoading = false;
        clearInterval(timer);
        this.recipes = recipes;
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
