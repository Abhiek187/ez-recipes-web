import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { vi } from 'vitest';

import { SearchComponent } from './search.component';
import Constants from 'src/app/constants/constants';
import { mockRecipes } from 'src/app/models/recipe.mock';

describe('SearchComponent', () => {
  let searchComponent: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let rootElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent, RouterModule.forRoot([])],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    fixture.detectChanges();
    searchComponent = fixture.componentInstance;
    rootElement = fixture.nativeElement;

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should show the filter form', () => {
    // Check that all the form elements are present
    expect(searchComponent).toBeTruthy();

    const queryField = rootElement.querySelector<HTMLElement>('.recipe-query');
    expect(queryField?.textContent).toContain('Query');
    const queryInput = queryField?.querySelector<HTMLInputElement>('input');
    // Ensure the input has all the necessary properties to be a search field
    expect(queryInput?.placeholder).toBe('food');
    expect(queryInput?.type).toBe('search');
    expect(queryInput?.inputMode).toBe('search');
    expect(queryInput?.autocapitalize).toBe('none');
    expect(queryInput?.autocomplete).toBe('off');
    expect(queryInput?.spellcheck).toBe(false);

    const caloriesRow =
      rootElement.querySelector<HTMLDivElement>('.calories-row');
    const calorieInputs =
      caloriesRow?.querySelectorAll<HTMLInputElement>('input');

    // Ensure the inputs only allow numeric inputs
    calorieInputs?.forEach((calorieInput) => {
      expect(calorieInput.type).toBe('number');
      expect(calorieInput.min).toBe('0');
      expect(calorieInput.max).toBe('2000');
      expect(calorieInput.pattern).toBe('\\d*');
      expect(calorieInput.inputMode).toBe('numeric');
    });

    const minCalField = calorieInputs?.item(0);
    const maxCalField = calorieInputs?.item(1);
    expect(minCalField?.placeholder).toBe('0');
    expect(maxCalField?.placeholder).toBe('2000');
    expect(caloriesRow?.textContent).toContain('≤ Calories ≤');
    expect(caloriesRow?.textContent).toContain('kcal');

    const checkboxRow = rootElement.querySelector<HTMLElement>('.checkbox-row');
    for (const checkboxLabel of [
      'Vegetarian',
      'Vegan',
      'Gluten-Free',
      'Healthy',
      'Cheap',
      'Sustainable',
    ]) {
      expect(checkboxRow?.textContent).toContain(checkboxLabel);
    }

    const dropdownRow = rootElement.querySelector<HTMLElement>('.dropdown-row');
    for (const dropdownLabel of ['Spice Level', 'Meal Type', 'Cuisine']) {
      expect(dropdownRow?.textContent).toContain(dropdownLabel);
    }

    const submitButton =
      rootElement.querySelector<HTMLButtonElement>('.submit-button');
    expect(submitButton?.textContent).toContain('Apply');
    expect(submitButton?.type).toBe('submit');

    // The form should be valid by default
    expect(submitButton?.disabled).toBe(false);
    expect(rootElement.querySelector('.progress-spinner')).toBeNull();
    expect(rootElement.querySelector('.no-results-error')).toBeNull();
    expect(rootElement.querySelector('.results-title')).toBeNull();
  });

  it('should start with a valid form', () => {
    // The form should be considered valid without any user input
    expect(searchComponent.filterFormGroup.value).toEqual({
      query: '',
      minCals: null,
      maxCals: null,
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      healthy: false,
      cheap: false,
      sustainable: false,
      rating: null,
      spiceLevel: [],
      type: [],
      culture: [],
      sort: null,
      asc: false,
    });
    expect(searchComponent.filterFormGroup.valid).toBe(true);

    expect(searchComponent.isLoading()).toBe(false);
    expect(searchComponent.loadingMessage()).toBe('');
    expect(searchComponent.noRecipesFound()).toBe(false);
  });

  it('should show an error if the calories are less than the min', () => {
    // Check that the min error is shown for both minCals and maxCals
    const form = searchComponent.filterFormGroup;
    form.controls.minCals.setValue(-1);
    fixture.detectChanges();

    expect(form.valid).toBe(false);
    expect(
      form.controls.minCals.hasError(searchComponent.filterFormErrorNames.min)
    ).toBe(true);
    const submitButton =
      rootElement.querySelector<HTMLButtonElement>('.submit-button');
    expect(submitButton?.disabled).toBe(true);

    form.reset();
    form.controls.maxCals.setValue(-1e-3);
    fixture.detectChanges();

    expect(form.valid).toBe(false);
    expect(
      form.controls.maxCals.hasError(searchComponent.filterFormErrorNames.min)
    ).toBe(true);
    expect(submitButton?.disabled).toBe(true);

    form.reset();
    fixture.detectChanges();
    expect(form.valid).toBe(true);
    expect(submitButton?.disabled).toBe(false);
  });

  it('should show an error if the calories are greater than the max', () => {
    // Check that the max error is shown for both minCals and maxCals
    const form = searchComponent.filterFormGroup;
    form.controls.minCals.setValue(2001);
    fixture.detectChanges();

    expect(form.valid).toBe(false);
    expect(
      form.controls.minCals.hasError(searchComponent.filterFormErrorNames.max)
    ).toBe(true);
    const submitButton =
      rootElement.querySelector<HTMLButtonElement>('.submit-button');
    expect(submitButton?.disabled).toBe(true);

    form.reset();
    form.controls.maxCals.setValue(3.1e3);
    fixture.detectChanges();

    expect(form.valid).toBe(false);
    expect(
      form.controls.maxCals.hasError(searchComponent.filterFormErrorNames.max)
    ).toBe(true);
    expect(submitButton?.disabled).toBe(true);

    form.reset();
    fixture.detectChanges();
    expect(form.valid).toBe(true);
    expect(submitButton?.disabled).toBe(false);
  });

  it('should show an error if min calories > max calories', () => {
    // Check that the range error is shown
    const form = searchComponent.filterFormGroup;
    form.controls.minCals.setValue(800);
    form.controls.maxCals.setValue(500);
    fixture.detectChanges();

    expect(form.valid).toBe(false);
    expect(form.hasError(searchComponent.filterFormErrorNames.range)).toBe(
      true
    );
    const submitButton =
      rootElement.querySelector<HTMLButtonElement>('.submit-button');
    expect(submitButton?.disabled).toBe(true);

    form.controls.maxCals.setValue(null);
    fixture.detectChanges();
    expect(form.valid).toBe(true);
    expect(submitButton?.disabled).toBe(false);
  });

  it('shows multiple calorie errors at the same time', () => {
    // Check if multiple errors appear at the same time
    const form = searchComponent.filterFormGroup;
    form.controls.minCals.setValue(3000);
    form.controls.maxCals.setValue(-1);
    fixture.detectChanges();

    expect(form.valid).toBe(false);
    expect(form.hasError(searchComponent.filterFormErrorNames.range)).toBe(
      true
    );
    expect(
      form.controls.minCals.hasError(searchComponent.filterFormErrorNames.max)
    ).toBe(true);
    expect(
      form.controls.maxCals.hasError(searchComponent.filterFormErrorNames.min)
    ).toBe(true);
    const submitButton =
      rootElement.querySelector<HTMLButtonElement>('.submit-button');
    expect(submitButton?.disabled).toBe(true);
  });

  it('should accept valid inputs from all fields', () => {
    // Check that interacting with all the form fields results in a valid form
    const form = searchComponent.filterFormGroup;
    form.setValue({
      query: 'salad',
      minCals: 400,
      maxCals: 900,
      vegetarian: true,
      vegan: false,
      glutenFree: true,
      healthy: true,
      cheap: false,
      sustainable: false,
      rating: 4,
      spiceLevel: ['none', 'mild'],
      type: ['antipasti', 'antipasto', 'appetizer'],
      culture: ['Mediterranean'],
      sort: 'calories',
      asc: true,
    });
    fixture.detectChanges();

    expect(form.valid).toBe(true);
    const submitButton =
      rootElement.querySelector<HTMLButtonElement>('.submit-button');
    expect(submitButton?.disabled).toBe(false);
  });

  it('should show a spinner while loading', () => {
    // Check that the material spinner shows when isLoading is true
    searchComponent.isLoading.set(true);
    fixture.detectChanges();

    expect(rootElement.querySelector('.progress-spinner')).not.toBeNull();
    expect(rootElement.querySelector('.loading-message')).not.toBeNull();
    // The submit button should be disabled
    expect(
      rootElement.querySelector<HTMLButtonElement>('.submit-button')?.disabled
    ).toBe(true);
  });

  it('should show an error if no recipes were found', () => {
    // Check that the noRecipesFound error appears
    searchComponent.noRecipesFound.set(true);
    fixture.detectChanges();

    const noResultsError =
      rootElement.querySelector<HTMLParagraphElement>('.no-results-error');
    expect(noResultsError).not.toBeNull();
    expect(noResultsError?.textContent).toContain(
      searchComponent.Errors.noResults
    );
    expect(rootElement.querySelector('.results-title')).toBeNull();
  });

  it('should load recipes after submitting the initial form', fakeAsync(() => {
    // By default, the form should be valid
    vi.spyOn(searchComponent, 'onSubmit');

    const submitButton =
      rootElement.querySelector<HTMLButtonElement>('.submit-button');
    expect(submitButton).not.toBeNull();
    expect(submitButton?.disabled).toBe(false);
    submitButton?.click();
    tick();

    expect(searchComponent.onSubmit).toHaveBeenCalled();
  }));

  it('should remove null filter values', () => {
    // Check that removeNullValues() removes null values from a recipe filter
    const filter = {
      query: 'cake',
      minCals: null,
      maxCals: 1000,
    };
    const nonNullFilter = searchComponent.removeNullValues(filter);
    expect(nonNullFilter).toEqual({
      query: filter.query,
      maxCals: filter.maxCals,
    });
  });

  it('should show a random message while loading', () => {
    // The loading message should start blank, then show a random message after some time
    searchComponent.showLoadingMessages();
    expect(searchComponent.loadingMessage()).toBe('');
    vi.advanceTimersByTime(3000);
    expect(Constants.loadingMessages).toContain(
      searchComponent.loadingMessage()
    );
  });

  it('shows results if there are recipes', () => {
    // The results section should show if there's at least one recipe
    searchComponent.recipes.set(mockRecipes);
    fixture.detectChanges();

    const resultsTitle =
      rootElement.querySelector<HTMLHeadingElement>('.results-title');
    expect(resultsTitle).not.toBeNull();
    expect(resultsTitle?.textContent).toBe('Results');
    const resultsList =
      rootElement.querySelector<HTMLUListElement>('.results-list');
    expect(resultsList).not.toBeNull();
    expect(resultsList?.childElementCount).toBe(mockRecipes.length);
  });

  it('sorts the results by the specified field and direction', () => {
    const form = searchComponent.filterFormGroup;
    form.controls.sort.setValue('calories');
    form.controls.asc.setValue(true);
    fixture.detectChanges();

    expect(form.valid).toBe(true);
    const submitButton =
      rootElement.querySelector<HTMLButtonElement>('.submit-button');
    expect(submitButton?.disabled).toBe(false);

    const sortDirectionButton = rootElement.querySelector<HTMLButtonElement>(
      '.sort-direction-button'
    );
    expect(sortDirectionButton).not.toBeNull();
    sortDirectionButton?.click();
    fixture.detectChanges();

    expect(form.controls.asc.value).toBe(false);
    sortDirectionButton?.click();
    fixture.detectChanges();
    expect(form.controls.asc.value).toBe(true);
  });
});
