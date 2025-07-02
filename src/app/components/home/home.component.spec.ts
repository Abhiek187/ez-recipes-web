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
import { mockRecipes } from 'src/app/models/recipe.mock';
import { mockTime } from 'src/app/models/term-store.mock';
import { RecentRecipe } from 'src/app/models/recipe.model';

describe('HomeComponent', () => {
  let homeComponent: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let rootElement: HTMLElement;

  const mockRecentRecipes = (value: RecentRecipe[]) => {
    spyOn(RecipeService.prototype, 'getRecentRecipes').and.returnValue(
      of(value) as unknown as DObservable
    );
    fixture.detectChanges();
  };

  beforeEach(async () => {
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
    expect(homeComponent.isLoading()).toBeFalse();
    expect(rootElement.querySelector('.progress-spinner')).toBeNull();
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
    homeComponent.isLoading.set(true);
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

  it("shouldn't show the recents section if there aren't any recent recipes", () => {
    mockRecentRecipes([]);

    const recentsSection =
      rootElement.querySelector<HTMLElement>('.recents-section');
    expect(recentsSection).toBeNull();
  });

  it('should show the recents section if there are recent recipes', () => {
    mockRecentRecipes(
      mockRecipes.map((recipe) => ({
        ...recipe,
        timestamp: mockTime,
        isFavorite: false,
      }))
    );

    const recentsSection =
      rootElement.querySelector<HTMLElement>('.recents-section');
    expect(recentsSection).not.toBeNull();
    expect(
      recentsSection?.querySelector<HTMLHeadingElement>('.recents-title')
        ?.textContent
    ).toBe('Recently Viewed');

    const recentsList =
      recentsSection?.querySelector<HTMLUListElement>('.recents-list');
    expect(recentsList).not.toBeNull();
    expect(recentsList?.childElementCount).toBe(mockRecipes.length);
  });
});
