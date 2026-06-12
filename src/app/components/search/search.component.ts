import { Location } from '@angular/common';
import {
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  form,
  FormField,
  max,
  min,
  SchemaPathTree,
  validate,
} from '@angular/forms/signals';
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
import RecipeFilter, {
  isValidSortField,
  RECIPE_SORT_FIELDS,
} from 'src/app/models/recipe-filter.model';
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
import { LabelPipe } from '../../pipes/label.pipe';

// Form fields should be non-nullable
type RecipeFilterForm = Omit<Required<RecipeFilter>, 'token' | 'sort'> & {
  sort: NonNullable<RecipeFilter['sort']> | '';
};

// Check that minCals doesn't exceed maxCals
const calorieRange = (schema: SchemaPathTree<RecipeFilterForm>) => {
  validate(schema, (context) => {
    const minCals = context.valueOf(schema.minCals);
    const maxCals = context.valueOf(schema.maxCals);

    if (minCals > maxCals) {
      return {
        kind: 'range',
        message: 'Max calories cannot exceed min calories',
      };
    }

    return null;
  });
};

@Component({
  selector: 'app-search',
  imports: [
    FormField,
    LabelPipe,
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
})
export class SearchComponent implements OnInit, OnDestroy {
  private recipeService = inject(RecipeService);
  private snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private destroyRef = inject(DestroyRef);

  isLoading = signal(false);
  private readonly defaultLoadingMessage = '';
  loadingMessage = signal(this.defaultLoadingMessage);
  noRecipesFound = signal(false);
  recipes = signal<Recipe[]>([]);
  lastToken = signal<string | null>(null);
  private filterModel = signal<RecipeFilterForm>({
    query: '',
    minCals: NaN,
    maxCals: NaN,
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    healthy: false,
    cheap: false,
    sustainable: false,
    rating: NaN,
    spiceLevel: [],
    type: [],
    culture: [],
    sort: '',
    asc: false,
  });

  filterForm = form(this.filterModel, (schemaPath) => {
    const { minCals, maxCals, rating } = schemaPath;

    min(minCals, 0, { message: 'Calories must be ≥ 0' });
    max(minCals, 2000, { message: 'Calories must be ≤ 2000' });
    min(maxCals, 0, { message: 'Calories must be ≥ 0' });
    max(maxCals, 2000, { message: 'Calories must be ≤ 2000' });
    calorieRange(schemaPath);

    min(rating, 1);
    max(rating, 5);
  });
  readonly scrollListener = this.onScroll.bind(this);

  readonly RATINGS = Array.from({ length: 5 }, (_, i) => i + 1);
  // Exclude unknown cases and sort for ease of reference
  readonly spiceLevels = SPICE_LEVELS.filter(
    (spiceLevel) => spiceLevel !== 'unknown',
  );
  readonly mealTypes = [...MEAL_TYPES].sort();
  readonly cuisines = [...CUISINES].sort();
  readonly SORT_FIELDS = [...RECIPE_SORT_FIELDS].sort();

  constructor() {
    // Initialize the form based on the query parameters
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.filterForm().value.set({
        ...params,
        query: params.query ?? '',
        // Parse all non-string values
        minCals: isNumeric(params.minCals) ? Number(params.minCals) : NaN,
        maxCals: isNumeric(params.maxCals) ? Number(params.maxCals) : NaN,
        vegetarian: params.vegetarian === 'true',
        vegan: params.vegan === 'true',
        glutenFree: params.glutenFree === 'true',
        healthy: params.healthy === 'true',
        cheap: params.cheap === 'true',
        sustainable: params.sustainable === 'true',
        rating:
          isNumeric(params.rating) &&
          Number(params.rating) >= 1 &&
          Number(params.rating) <= 5
            ? Number(params.rating)
            : NaN,
        // 0 = undefined, 1 = string, 2+ = array
        spiceLevel: toArray(params.spiceLevel).filter(
          (spiceLevel): spiceLevel is SpiceLevel =>
            isValidSpiceLevel(spiceLevel),
        ),
        type: toArray(params.type).filter(
          (spiceLevel): spiceLevel is MealType => isValidMealType(spiceLevel),
        ),
        culture: toArray(params.culture).filter(
          (spiceLevel): spiceLevel is Cuisine => isValidCuisine(spiceLevel),
        ),
        sort: isValidSortField(params.sort) ? params.sort : '',
        asc: params.asc === 'true',
      });
    });

    effect(() => {
      // Update the query params with the selected filters
      const urlTreePath = this.router
        .createUrlTree([], {
          queryParams: this.filterForm().value(),
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

  toggleSortDirection(event: MouseEvent) {
    // Don't submit the form if the sort field isn't specified
    if (this.filterForm.sort().value().length === 0) {
      event.preventDefault();
    }

    this.filterForm.asc().value.update((asc) => !asc);
  }

  private searchRecipes(paginate: boolean) {
    const recipeFilter = this.removeDefaultValues({
      ...this.filterForm().value(),
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
        }),
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

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    this.searchRecipes(false);
  }

  // Convert all default values to undefined (aka remove them)
  removeDefaultValues(filter: RecipeFilterForm): RecipeFilter {
    return Object.fromEntries(
      Object.entries(filter).filter(
        ([, value]) =>
          (typeof value === 'boolean' && value) ||
          (typeof value === 'number' && !Number.isNaN(value)) ||
          ((typeof value === 'string' || Array.isArray(value)) &&
            value.length > 0),
      ),
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
