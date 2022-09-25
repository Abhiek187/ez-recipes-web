import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { mockRecipe } from '../models/recipe.mock';
import { Recipe } from '../models/recipe.model';
import { RecipeService } from './recipe.service';

describe('RecipeService', () => {
  let recipeService: RecipeService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  const testUrl = '/api/recipes/random';

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

  it('should fetch a random recipe', () => {
    // Check that the getRandomRecipe method returns a mock recipe
    // Make an HTTP GET request
    httpClient.get<Recipe>(testUrl).subscribe((data) =>
      // When observable resolves, result should match test data
      expect(data).toBe(mockRecipe)
    );

    // The following `expectOne()` will match the request's URL.
    // If no requests or multiple requests matched that URL
    // `expectOne()` would throw.
    const req = httpTestingController.expectOne(testUrl);

    // Assert that the request is a GET.
    expect(req.request.method).toEqual('GET');

    // Respond with mock data, causing Observable to resolve.
    // Subscribe callback asserts that correct data was returned.
    req.flush(mockRecipe);
  });

  it('should return an error if the recipe API fails', () => {
    // Check that getRandomRecipe returns an error if the request failed
    // Create mock ProgressEvent with type `error`, raised when something goes wrong
    // at network level. e.g. Connection timeout, DNS error, offline, etc.
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

  it('should return a mock recipe', () => {
    // Check that getMockRecipe returns a mock recipe
    recipeService.getMockRecipe().subscribe((data) => {
      expect(data).toBe(mockRecipe);
    });
  });
});
