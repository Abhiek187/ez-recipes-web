import { Location } from '@angular/common';
import {
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { finalize } from 'rxjs';

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
import { RecipeCardComponent } from '../utils/recipe-card/recipe-card.component';
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
  rating: 'rating',
  spiceLevel: 'spiceLevel',
  type: 'type',
  culture: 'culture',
} as const;
const FilterFormError = {
  min: 'min',
  max: 'max',
  range: 'range',
  noResults: 'noResults',
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
    ? { [FilterFormError.range]: true }
    : null;
};

@Component({
  selector: 'app-search',
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    ReactiveFormsModule,
    RecipeCardComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit, OnDestroy {
  private recipeService = inject(RecipeService);
  private snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private destroyRef = inject(DestroyRef);

  filterFormNames = FilterForm;
  filterFormErrorNames = FilterFormError;
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
      [FilterForm.rating]: new FormControl<number | null>(null, [
        Validators.min(1),
        Validators.max(5),
      ]),
      [FilterForm.spiceLevel]: new FormControl<SpiceLevel[]>([]),
      [FilterForm.type]: new FormControl<MealType[]>([]),
      [FilterForm.culture]: new FormControl<Cuisine[]>([]),
    },
    { validators: calorieRangeValidator }
  );
  readonly Errors = {
    [FilterFormError.min]: 'Calories must be ≥ 0',
    [FilterFormError.max]: 'Calories must be ≤ 2000',
    [FilterFormError.range]: 'Max calories cannot exceed min calories',
    [FilterFormError.noResults]: 'No recipes found',
  };
  readonly scrollListener = this.onScroll.bind(this);

  isLoading = signal(false);
  private readonly defaultLoadingMessage = '';
  loadingMessage = signal(this.defaultLoadingMessage);
  noRecipesFound = signal(false);
  recipes = signal<Recipe[]>([]);
  lastToken = signal<string | null>(null);

  readonly RATINGS = Array.from({ length: 5 }, (_, i) => i + 1);
  // Exclude unknown cases and sort for ease of reference
  readonly spiceLevels = SPICE_LEVELS.filter(
    (spiceLevel) => spiceLevel !== 'unknown'
  );
  readonly mealTypes = [...MEAL_TYPES].sort();
  readonly cuisines = [...CUISINES].sort();

  constructor() {
    // Initialize the form based on the query parameters
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
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
        [FilterForm.rating]:
          isNumeric(params.rating) &&
          Number(params.rating) >= 1 &&
          Number(params.rating) <= 5
            ? Number(params.rating)
            : null,
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
    });

    this.filterFormGroup.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((filter) => {
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
      });
  }

  ngOnInit(): void {
    // HostListener doesn't work since useCapture needs to be true
    // https://stackoverflow.com/a/54005290
    window.addEventListener('scroll', this.scrollListener, true);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollListener, true);
  }

  private searchRecipes(paginate: boolean) {
    const recipeFilter = this.removeNullValues({
      ...this.filterFormGroup.value,
      ...(paginate && { token: this.lastToken() }),
    });
    this.isLoading.set(true);
    const timer = !paginate ? this.showLoadingMessages() : undefined;

    this.recipeService
      .getRecipesWithFilter(recipeFilter)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
          clearInterval(timer);
        })
      )
      .subscribe({
        next: (recipes: Recipe[]) => {
          // Append results if paginating, replace otherwise
          this.recipes.set(paginate ? this.recipes().concat(recipes) : recipes);
          // Don't show an error if there are no more paginated results
          this.noRecipesFound.set(!paginate && recipes.length === 0);

          const lastRecipe = recipes.at(-1);
          if (lastRecipe !== undefined) {
            this.lastToken.set(lastRecipe.token ?? lastRecipe._id ?? null);
          } else {
            // Prevent subsequent calls if there are no more results
            this.lastToken.set(null);
          }
        },
        error: (error: Error) => {
          this.snackBar.open(error.message, 'Dismiss');
        },
      });
  }

  onSubmit() {
    this.searchRecipes(false);
  }

  /* FormControls use null for missing values, but HttpParams doesn't accept null values.
   * So, convert all null values to undefined (aka remove them).
   */
  removeNullValues(filter: PartialNull<RecipeFilter>): RecipeFilter {
    return Object.fromEntries(
      Object.entries(filter).filter(([, value]) => value !== null)
    );
  }

  showLoadingMessages() {
    this.loadingMessage.set(this.defaultLoadingMessage);

    return setInterval(() => {
      this.loadingMessage.set(getRandomElement(Constants.loadingMessages));
    }, 3000);
  }

  onScroll(event: Event) {
    const target = event.target as HTMLElement | null;
    if (target === null) return;

    // Check if the user scrolled to the bottom and try loading additional results
    // Prevent multiple requests from running at once
    if (
      target.offsetHeight + Math.ceil(target.scrollTop) >=
        target.scrollHeight &&
      this.lastToken() !== null &&
      !this.isLoading()
    ) {
      this.searchRecipes(true);
    }
  }
}
