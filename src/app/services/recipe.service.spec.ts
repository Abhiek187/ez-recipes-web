import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { environment } from 'src/environments/environment';
import { mockRecipe, mockRecipes, mockToken } from '../models/recipe.mock';
import Recipe, { RecentRecipe, RecipeUpdate } from '../models/recipe.model';
import { RecipeService } from './recipe.service';
import Constants from '../constants/constants';
import RecipeFilter from '../models/recipe-filter.model';
import recipeFilterParams from './recipe-filter-params';
import recentRecipesDB from '../helpers/recent-recipes-db';
import { mockChef } from '../models/profile.mock';

describe('RecipeService', () => {
  let recipeService: RecipeService;
  let httpTestingController: HttpTestingController;

  const baseUrl = `${environment.serverBaseUrl}${Constants.recipesPath}`;
  // Create mock ProgressEvent with type `error`, raised when something goes wrong
  // at network level. e.g. Connection timeout, DNS error, offline, etc.
  const mockError = new ProgressEvent('error');
  const mockErrorMessage =
    'An unexpected error occurred. The server may be down or there may be network issues. Please try again later.';
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

    // Inject the http test controller for each test
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

  it('should fetch a random recipe', async () => {
    // Check that the getRandomRecipe method returns a mock recipe
    // Make an HTTP GET request
    const recipePromise = firstValueFrom(recipeService.getRandomRecipe());

    // The following `expectOne()` will match the request's URL.
    // If no requests or multiple requests matched that URL
    // `expectOne()` would throw.
    const req = httpTestingController.expectOne({
      // Assert that the request is a GET.
      method: 'GET',
      url: `${baseUrl}/random`,
    });

    // Respond with mock data, causing Observable to resolve.
    // Subscribe callback asserts that correct data was returned.
    req.flush(mockRecipe);

    // When observable resolves, result should match test data
    await expectAsync(recipePromise).toBeResolvedTo(mockRecipe);
  });

  it('should return an error if the random recipe API fails', async () => {
    // Check that getRandomRecipe returns an error if the request failed
    const chefPromise = firstValueFrom(recipeService.getRandomRecipe());

    const req = httpTestingController.expectOne({
      method: 'GET',
      url: `${baseUrl}/random`,
    });

    // Respond with mock error
    req.error(mockError);

    await expectAsync(chefPromise).toBeRejectedWithError(mockErrorMessage);
  });

  it('should fetch a recipe by ID', async () => {
    // Check that get recipe by ID returns a mock recipe
    const id = '0';
    const recipePromise = firstValueFrom(recipeService.getRecipeById(id));

    const req = httpTestingController.expectOne({
      method: 'GET',
      url: `${baseUrl}/${id}`,
    });
    req.flush(mockRecipe);

    await expectAsync(recipePromise).toBeResolvedTo(mockRecipe);
  });

  it('should return an error if the recipe ID API fails', async () => {
    // Check that getRandomRecipe returns an error if the request failed
    const id = '0';
    const recipePromise = firstValueFrom(recipeService.getRecipeById(id));

    const req = httpTestingController.expectOne({
      method: 'GET',
      url: `${baseUrl}/${id}`,
    });
    req.error(mockError);

    await expectAsync(recipePromise).toBeRejectedWithError(mockErrorMessage);
  });

  it('should fetch recipes by filter', async () => {
    // Check that getRecipesWithFilter returns an array of mock recipes
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
    const recipePromise = firstValueFrom(
      recipeService.getRecipesWithFilter(testFilter)
    );

    const req = httpTestingController.expectOne({
      method: 'GET',
      // The query params should be serialized properly
      url: `${baseUrl}?query=${encodeURIComponent(
        testFilter.query!
      )}&min-cals=${testFilter.minCals}&max-cals=${
        testFilter.maxCals
      }&vegetarian=&vegan=&gluten-free=&rating=${
        testFilter.rating
      }&${testFilter.spiceLevel
        ?.map((spiceLevel) => `spice-level=${spiceLevel}`)
        .join('&')}&${testFilter.type
        ?.map((mealType) => `type=${encodeURIComponent(mealType)}`)
        .join('&')}&${testFilter.culture
        ?.map((cuisine) => `culture=${encodeURIComponent(cuisine)}`)
        .join('&')}`,
    });
    expect(req.request.params.toString()).toBe(
      recipeFilterParams(testFilter).toString()
    );
    req.flush(mockRecipes);

    await expectAsync(recipePromise).toBeResolvedTo(mockRecipes);
  });

  it('should return an error if the filter recipe API fails', async () => {
    // Check that getRandomRecipe returns an error if the request failed
    const testFilter: RecipeFilter = {};
    const recipePromise = firstValueFrom(
      recipeService.getRecipesWithFilter(testFilter)
    );

    const req = httpTestingController.expectOne({
      method: 'GET',
      url: baseUrl,
    });
    req.error(mockError);

    await expectAsync(recipePromise).toBeRejectedWithError(mockErrorMessage);
  });

  it('should update a recipe', async () => {
    // Check that updateRecipe returns a mock token
    const id = 0;
    const fields: RecipeUpdate = {
      rating: 5,
      view: true,
      isFavorite: true,
    };
    const recipePromise = firstValueFrom(
      recipeService.updateRecipe(id, fields, mockChef.token)
    );

    const req = httpTestingController.expectOne({
      method: 'PATCH',
      url: `${baseUrl}/${id}`,
    });
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${mockChef.token}`
    );
    expect(req.request.body).toBe(fields);
    req.flush(mockToken);

    await expectAsync(recipePromise).toBeResolvedTo(mockToken);
  });

  it('should update a recipe without a token', async () => {
    // Check that updateRecipe returns a mock token even without a token
    const id = 0;
    const fields: RecipeUpdate = {
      view: true,
    };
    const recipePromise = firstValueFrom(
      recipeService.updateRecipe(id, fields)
    );

    const req = httpTestingController.expectOne({
      method: 'PATCH',
      url: `${baseUrl}/${id}`,
    });
    expect(req.request.headers.get('Authorization')).toBeNull();
    expect(req.request.body).toBe(fields);
    req.flush({});

    await expectAsync(recipePromise).toBeResolvedTo({});
  });

  it('should return an error if the update recipe API fails', async () => {
    // Check that updateRecipe returns an error if the request failed
    const id = 0;
    const fields: RecipeUpdate = {
      isFavorite: false,
    };
    const recipePromise = firstValueFrom(
      recipeService.updateRecipe(id, fields)
    );

    const req = httpTestingController.expectOne({
      method: 'PATCH',
      url: `${baseUrl}/${id}`,
    });
    expect(req.request.headers.get('Authorization')).toBeNull();
    expect(req.request.body).toBe(fields);
    req.error(mockError);

    await expectAsync(recipePromise).toBeRejectedWithError(mockErrorMessage);
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
