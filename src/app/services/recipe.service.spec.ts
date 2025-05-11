import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from 'src/environments/environment';
import { mockRecipe, mockRecipes, mockToken } from '../models/recipe.mock';
import Recipe, {
  RecentRecipe,
  RecipeUpdate,
  Token,
} from '../models/recipe.model';
import { RecipeService } from './recipe.service';
import Constants from '../constants/constants';
import RecipeFilter from '../models/recipe-filter.model';
import recipeFilterParams from './recipe-filter-params';
import recentRecipesDB from '../helpers/recent-recipes-db';

describe('RecipeService', () => {
  let recipeService: RecipeService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  const mockRecipesWithTimestamp: RecentRecipe[] = mockRecipes.map(
    (recipe, index) => ({
      ...recipe,
      timestamp: index,
      isFavorite: false,
    })
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    recipeService = TestBed.inject(RecipeService);

    // Inject the http service and test controller for each test
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(async () => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
    // Clear the fake table between tests
    await recentRecipesDB.recipes.clear();
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
      rating: 3,
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
      }&max-cals=${testFilter.maxCals}&vegetarian=&vegan=&gluten-free=&rating=${
        testFilter.rating
      }&${testFilter.spiceLevel
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

  it('should update a recipe', () => {
    // Check that updateRecipe returns a mock token
    const id = 0;
    const testUrl = `${Constants.recipesPath}/${id}`;
    const recipeUpdate: RecipeUpdate = {
      rating: 5,
      view: true,
      isFavorite: true,
    };

    httpClient
      .patch<Token>(testUrl, recipeUpdate, {
        headers: {
          Authorization: mockToken.token ?? '',
        },
      })
      .subscribe((data) => expect(data).toBe(mockToken));

    const req = httpTestingController.expectOne(testUrl);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(recipeUpdate);
    expect(req.request.headers.get('Authorization')).toBe(
      mockToken.token ?? ''
    );
    req.flush(mockToken);
  });

  it('should return an error if the update recipe API fails', () => {
    // Check that updateRecipe returns an error if the request failed
    const id = 0;
    const testUrl = `${Constants.recipesPath}/${id}`;
    const recipeUpdate: RecipeUpdate = {
      rating: 5,
      view: true,
      isFavorite: true,
    };
    const mockError = new ProgressEvent('error');

    httpClient.patch<Token>(testUrl, recipeUpdate).subscribe({
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

  it('should return a mock token', (done) => {
    // Check that getMockToken returns a mock token
    recipeService.getMockToken().subscribe((data) => {
      expect(data).toBe(mockToken);
      done();
    });
  });

  it('should set a recipe', (done) => {
    // Check that the setRecipe method sets the recipe variable to the passed in recipe
    recipeService.setRecipe(mockRecipe);

    recipeService.onRecipeChange().subscribe((recipe: Recipe | null) => {
      expect(recipe).toBe(mockRecipe);
      done();
    });
  });

  it('should reset a recipe', (done) => {
    // Check that the resetRecipe method sets the recipe variable to null
    recipeService.setRecipe(mockRecipe);
    recipeService.resetRecipe();

    recipeService.onRecipeChange().subscribe((recipe: Recipe | null) => {
      expect(recipe).toBeNull();
      done();
    });
  });

  it("should return an empty array if there are't any recent recipes", (done) => {
    const subscription = recipeService
      .getRecentRecipes()
      .subscribe((recipes) => {
        expect(recipes).toEqual([]);
        subscription.unsubscribe(); // ensure done() isn't called more than once
        done();
      });
  });

  it('should sort recent recipes in descending order', (done) => {
    const subscription = recipeService
      .getRecentRecipes()
      .subscribe((recipes) => {
        if (recipes.length === 0) {
          recentRecipesDB.recipes.bulkAdd(mockRecipesWithTimestamp);
          // Trigger liveQuery
        } else {
          expect(recipes).toEqual(mockRecipesWithTimestamp.toReversed());
          subscription.unsubscribe();
          done();
        }
      });
  });

  it("should add a recent recipe if there's enough space", async () => {
    await recentRecipesDB.recipes.bulkAdd(mockRecipesWithTimestamp.slice(1));
    await recipeService.saveRecentRecipe(mockRecipesWithTimestamp[0]);

    const recipeCount = await recentRecipesDB.recipes.count();
    expect(recipeCount).toBe(mockRecipesWithTimestamp.length);
  });

  it('should update a recent recipe if it already exists', async () => {
    await recentRecipesDB.recipes.bulkAdd(mockRecipesWithTimestamp);
    await recipeService.saveRecentRecipe(mockRecipesWithTimestamp[0]);

    const recipeCount = await recentRecipesDB.recipes.count();
    expect(recipeCount).toBe(mockRecipesWithTimestamp.length);
  });

  it('should replace the oldest recipe if there are too many recent recipes', async () => {
    await recentRecipesDB.recipes.bulkAdd(
      [...Array(Constants.recentRecipesDB.max).keys()].map((index) => ({
        ...mockRecipesWithTimestamp[0],
        id: index,
      }))
    );
    await recipeService.saveRecentRecipe(mockRecipesWithTimestamp[1]);

    const recipeCount = await recentRecipesDB.recipes.count();
    expect(recipeCount).toBe(Constants.recentRecipesDB.max);
  });
});
