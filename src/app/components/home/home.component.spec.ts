import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Observable as DObservable } from 'dexie';
import { of } from 'rxjs';

import { NavbarComponent } from '../navbar/navbar.component';
import { HomeComponent } from './home.component';
import Constants from 'src/app/constants/constants';
import { RecipeService } from 'src/app/services/recipe.service';
import { mockRecipe, mockRecipes } from 'src/app/models/recipe.mock';
import { mockTime } from 'src/app/models/term-store.mock';
import { RecentRecipe } from 'src/app/models/recipe.model';
import { ChefService } from 'src/app/services/chef.service';
import { mockChef } from 'src/app/models/profile.mock';

describe('HomeComponent', () => {
  let homeComponent: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let rootElement: HTMLElement;
  let chefService: ChefService;

  const mockRecentRecipes = (value: RecentRecipe[]) => {
    spyOn(RecipeService.prototype, 'getRecentRecipes').and.returnValue(
      of(value) as unknown as DObservable
    );
    fixture.detectChanges();
  };

  beforeEach(async () => {
    spyOn(ChefService.prototype, 'getChef').and.returnValue(of(mockChef));

    // Import all the necessary modules and components to test the app component
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    homeComponent = fixture.componentInstance;
    rootElement = fixture.nativeElement;
    chefService = TestBed.inject(ChefService);

    // Create a fake timer to mock setInterval & setTimeout
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create the app', () => {
    // Check that the component can render
    fixture.detectChanges(); // re-render the component
    expect(homeComponent).toBeTruthy();
  });

  it(`shouldn't show a recipe initially`, () => {
    // Check that the page initially shows the "Find Me a Recipe!" button
    fixture.detectChanges();
    const findRecipeButton = rootElement.querySelector<HTMLButtonElement>(
      '.find-recipe-button'
    );
    expect(findRecipeButton).not.toBeNull();
    expect(findRecipeButton?.textContent).toContain('Find Me a Recipe!');

    // The navbar should be visible
    expect(
      fixture.debugElement.query(By.directive(NavbarComponent))
    ).toBeDefined();

    // The spinner should be hidden
    expect(homeComponent.isLoadingRecipe()).toBeFalse();
    expect(rootElement.querySelector('.progress-spinner')).toBeNull();

    // All the accordions should be present
    const favoritesAccordion = rootElement.querySelector(
      '.favorites-accordion'
    );
    expect(favoritesAccordion).toBeDefined();
    expect(favoritesAccordion?.textContent).toContain('Favorites');

    const recentsAccordion = rootElement.querySelector('.recents-accordion');
    expect(recentsAccordion).toBeDefined();
    expect(recentsAccordion?.textContent).toContain('Recently Viewed');

    const ratingsAccordion = rootElement.querySelector('.ratings-accordion');
    expect(ratingsAccordion).toBeDefined();
    expect(ratingsAccordion?.textContent).toContain('Ratings');
  });

  it('should load a random recipe after clicking the find recipe button', fakeAsync(() => {
    // Check that the getRandomRecipe method is called after clicking the find recipe button
    fixture.detectChanges();
    spyOn(homeComponent, 'getRandomRecipe');

    const findRecipeButton = rootElement.querySelector<HTMLButtonElement>(
      '.find-recipe-button'
    );
    expect(findRecipeButton).not.toBeNull();
    findRecipeButton?.click();
    tick(); // wait for the async tasks to complete

    expect(homeComponent.getRandomRecipe).toHaveBeenCalled();
  }));

  it('should show a spinner while loading', () => {
    // Check that the material spinner shows when isLoading is true
    homeComponent.isLoadingRecipe.set(true);
    fixture.detectChanges();

    expect(rootElement.querySelector('.progress-spinner')).not.toBeNull();
    expect(rootElement.querySelector('.loading-message')).not.toBeNull();
    // The find recipe button should be disabled
    expect(
      rootElement.querySelector<HTMLButtonElement>('.find-recipe-button')
        ?.disabled
    ).toBeTrue();
  });

  it('should show a random message while loading', () => {
    // The loading message should start blank, then show a random message after some time
    fixture.detectChanges();
    homeComponent.showLoadingMessages();
    expect(homeComponent.loadingMessage()).toBe('');
    jasmine.clock().tick(3000);
    expect(Constants.loadingMessages).toContain(homeComponent.loadingMessage());
  });

  it('should show the sign in message if the user is unauthenticated', () => {
    chefService.chef.set(undefined);
    fixture.detectChanges();

    const favoritesAccordion = rootElement.querySelector(
      '.favorites-accordion'
    );
    expect(favoritesAccordion?.textContent).toContain(
      'Sign in to view your saved recipes'
    );
    const ratingsAccordion = rootElement.querySelector('.ratings-accordion');
    expect(ratingsAccordion?.textContent).toContain(
      'Sign in to view your saved recipes'
    );
  });

  it("should show no recipes found if there aren't any recent recipes", () => {
    chefService.chef.set(undefined);
    mockRecentRecipes([]);

    const recentsAccordion =
      rootElement.querySelector<HTMLElement>('.recents-accordion');
    expect(recentsAccordion?.textContent).toContain('No recipes found');
  });

  it('should show locally stored recipes if there are recent recipes and the user is unauthenticated', () => {
    chefService.chef.set(undefined);
    mockRecentRecipes(
      mockRecipes.map((recipe) => ({
        ...recipe,
        timestamp: mockTime,
        isFavorite: false,
      }))
    );

    const recentsAccordion =
      rootElement.querySelector<HTMLElement>('.recents-accordion');
    const recentsList =
      recentsAccordion?.querySelector<HTMLUListElement>('.recipe-card-list');
    expect(recentsList).not.toBeNull();
    expect(recentsList?.childElementCount).toBe(mockRecipes.length);
  });

  it("should show no recipes found if the user is authenticated but hasn't saved any recipe", () => {
    chefService.chef.set({
      ...mockChef,
      favoriteRecipes: [],
      recentRecipes: {},
      ratings: {},
    });
    homeComponent.onExpandFavorites();
    homeComponent.onExpandRecents();
    homeComponent.onExpandRatings();
    fixture.detectChanges();

    const favoritesAccordion = rootElement.querySelector(
      '.favorites-accordion'
    );
    expect(favoritesAccordion?.textContent).toContain('No recipes found');

    const recentsAccordion = rootElement.querySelector('.recents-accordion');
    expect(recentsAccordion?.textContent).toContain('No recipes found');

    const ratingsAccordion = rootElement.querySelector('.ratings-accordion');
    expect(ratingsAccordion?.textContent).toContain('No recipes found');
  });

  it('should populate all the accordions if authenticated', () => {
    spyOn(RecipeService.prototype, 'getRecipeById').and.returnValue(
      of(mockRecipe)
    );
    chefService.chef.set(mockChef);
    homeComponent.onExpandFavorites();
    homeComponent.onExpandRecents();
    homeComponent.onExpandRatings();
    fixture.detectChanges();

    const favoritesAccordion = rootElement.querySelector(
      '.favorites-accordion'
    );
    const favoritesList =
      favoritesAccordion?.querySelector<HTMLUListElement>('.recipe-card-list');
    expect(favoritesList?.childElementCount).toBe(
      mockChef.favoriteRecipes.length
    );

    const recentsAccordion = rootElement.querySelector('.recents-accordion');
    const recentsList =
      recentsAccordion?.querySelector<HTMLUListElement>('.recipe-card-list');
    expect(recentsList?.childElementCount).toBe(
      Object.keys(mockChef.recentRecipes).length
    );

    const ratingsAccordion = rootElement.querySelector('.ratings-accordion');
    const ratingsList =
      ratingsAccordion?.querySelector<HTMLUListElement>('.recipe-card-list');
    expect(ratingsList?.childElementCount).toBe(
      Object.keys(mockChef.ratings).length
    );
  });
});
