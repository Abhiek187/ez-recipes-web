import 'fake-indexeddb';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from 'src/environments/environment';
import { mockRecipe, mockRecipes } from '../models/recipe.mock';
import Recipe from '../models/recipe.model';
import { RecipeService } from './recipe.service';
import Constants from '../constants/constants';
import RecipeFilter from '../models/recipe-filter.model';
import recipeFilterParams from './recipe-filter-params';

describe('RecipeService', () => {
  let recipeService: RecipeService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    recipeService = TestBed.inject(RecipeService);

    // Inject the http service and test controller for each test
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(recipeService).toBeTruthy();
  });

  it('should not be mocked', () => {
    // Make sure network calls aren't mocked in production
    expect(environment.mock).withContext('Turn off debug mode!').toBeFalse();
  });

  it('should fetch a random recipe', () => {
    // Check that the getRandomRecipe method returns a mock recipe
    // Make an HTTP GET request
    const testUrl = `${Constants.recipesPath}/random`;
    httpClient.get<Recipe>(testUrl).subscribe((data) =>
      // When observable resolves, result should match test data
      expect(data).toBe(mockRecipe)
    );

    // The following `expectOne()` will match the request's URL.
    // If no requests or multiple requests matched that URL
    // `expectOne()` would throw.
    const req = httpTestingController.expectOne(testUrl);

    // Assert that the request is a GET.
    expect(req.request.method).toBe('GET');

    // Respond with mock data, causing Observable to resolve.
    // Subscribe callback asserts that correct data was returned.
    req.flush(mockRecipe);
  });

  it('should return an error if the random recipe API fails', () => {
    // Check that getRandomRecipe returns an error if the request failed
    // Create mock ProgressEvent with type `error`, raised when something goes wrong
    // at network level. e.g. Connection timeout, DNS error, offline, etc.
    const testUrl = `${Constants.recipesPath}/random`;
    const mockError = new ProgressEvent('error');

    httpClient.get<Recipe>(testUrl).subscribe({
      next: () => fail('should have failed with the network error'),
      error: (error: HttpErrorResponse) => {
        expect(error.error).toBe(mockError);
      },
    });

    const req = httpTestingController.expectOne(testUrl);

    // Respond with mock error
    req.error(mockError);
  });

  it('should fetch a recipe by ID', () => {
    // Check that get recipe by ID returns a mock recipe
    const id = 0;
    const testUrl = `${Constants.recipesPath}/${id}`;

    httpClient
      .get<Recipe>(testUrl)
      .subscribe((data) => expect(data).toBe(mockRecipe));

    const req = httpTestingController.expectOne(testUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockRecipe);
  });

  it('should return an error if the recipe ID API fails', () => {
    // Check that getRandomRecipe returns an error if the request failed
    const id = 0;
    const testUrl = `${Constants.recipesPath}/${id}`;
    const mockError = new ProgressEvent('error');

    httpClient.get<Recipe>(testUrl).subscribe({
      next: () => fail('should have failed with the network error'),
      error: (error: HttpErrorResponse) => {
        expect(error.error).toBe(mockError);
      },
    });

    const req = httpTestingController.expectOne(testUrl);
    req.error(mockError);
  });

  it('should fetch recipes by filter', () => {
    // Check that getRecipesWithFilter returns an array of mock recipes
    const testUrl = Constants.recipesPath;
    const testFilter: RecipeFilter = {
      query: 'vegan nuggets',
      minCals: 100,
      maxCals: 1000,
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      healthy: false,
      cheap: false,
      sustainable: false,
      spiceLevel: ['none', 'mild'],
      type: ['snack', 'lunch'],
      culture: ['American', 'British'],
    };

    httpClient
      .get<Recipe[]>(testUrl, {
        params: recipeFilterParams(testFilter),
      })
      .subscribe((data) => expect(data).toBe(mockRecipes));

    // The query params should be serialized properly
    const req = httpTestingController.expectOne(
      `${testUrl}?query=${encodeURIComponent(testFilter.query!)}&min-cals=${
        testFilter.minCals
      }&max-cals=${
        testFilter.maxCals
      }&vegetarian=&vegan=&gluten-free=&${testFilter.spiceLevel
        ?.map((spiceLevel) => `spice-level=${spiceLevel}`)
        .join('&')}&${testFilter.type
        ?.map((mealType) => `type=${encodeURIComponent(mealType)}`)
        .join('&')}&${testFilter.culture
        ?.map((cuisine) => `culture=${encodeURIComponent(cuisine)}`)
        .join('&')}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockRecipes);
  });

  it('should return an error if the filter recipe API fails', () => {
    // Check that getRandomRecipe returns an error if the request failed
    const testUrl = Constants.recipesPath;
    const testFilter: RecipeFilter = {};
    const mockError = new ProgressEvent('error');

    httpClient
      .get<Recipe[]>(testUrl, {
        params: recipeFilterParams(testFilter),
      })
      .subscribe({
        next: () => fail('should have failed with the network error'),
        error: (error: HttpErrorResponse) => {
          expect(error.error).toBe(mockError);
        },
      });

    const req = httpTestingController.expectOne(testUrl);
    req.error(mockError);
  });

  it('should return a mock recipe', (done) => {
    // Check that getMockRecipe returns a mock recipe
    recipeService.getMockRecipe().subscribe((data) => {
      expect(data).toBe(mockRecipe);
      done();
    });
  });

  it('should return mock recipes', (done) => {
    // Check that getMockRecipes returns multiple mock recipes
    recipeService.getMockRecipes().subscribe((data) => {
      expect(data).toBe(mockRecipes);
      done();
    });
  });

  it('should set a recipe', () => {
    // Check that the setRecipe method sets the recipe variable to the passed in recipe
    recipeService.setRecipe(mockRecipe);

    recipeService.onRecipeChange().subscribe((recipe: Recipe | null) => {
      expect(recipe).toBe(mockRecipe);
    });
  });

  it('should reset a recipe', () => {
    // Check that the resetRecipe method sets the recipe variable to null
    recipeService.setRecipe(mockRecipe);
    recipeService.resetRecipe();

    recipeService.onRecipeChange().subscribe((recipe: Recipe | null) => {
      expect(recipe).toBeNull();
    });
  });
});
