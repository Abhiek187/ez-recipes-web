import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { mockRecipe } from './models/recipe.mock';
import { NavbarComponent } from './navbar/navbar.component';
import { RecipeComponent } from './recipe/recipe.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let appComponent: AppComponent;
  let rootElement: HTMLElement;

  beforeEach(async () => {
    // Import all the necessary modules and components to test the app component
    await TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges(); // re-render the component
    appComponent = fixture.componentInstance;
    rootElement = fixture.nativeElement;
  });

  it('should create the app', () => {
    // Check that the component can render
    expect(appComponent).toBeTruthy();
  });

  it(`shouldn't show a recipe initially`, () => {
    // Check that the page initially shows the "Find me a recipe!" button
    const findRecipeButton = rootElement.querySelector<HTMLButtonElement>(
      '.find-recipe-button'
    );
    expect(findRecipeButton).not.toBeNull();
    expect(findRecipeButton?.textContent).toContain('Find me a recipe!');

    // The navbar should be visible
    expect(
      fixture.debugElement.query(By.directive(NavbarComponent))
    ).toBeDefined();

    // The spinner should be hidden
    expect(appComponent.isLoading).toBeFalse();
    expect(rootElement.querySelector('.progress-spinner')).toBeNull();

    // No recipe should appear
    expect(appComponent.recipe).toBeUndefined();
  });

  it('should load a random recipe after clicking the find recipe button', fakeAsync(() => {
    // Check that the getRandomRecipe method is called after clicking the find recipe button
    spyOn(appComponent, 'getRandomRecipe');

    const findRecipeButton = rootElement.querySelector<HTMLButtonElement>(
      '.find-recipe-button'
    );
    expect(findRecipeButton).not.toBeNull();
    findRecipeButton?.click();
    tick(); // wait for the async tasks to complete

    expect(appComponent.getRandomRecipe).toHaveBeenCalled();
  }));

  it('should show a spinner while loading', () => {
    // Check that the material spinner shows when isLoading is true
    appComponent.isLoading = true;
    fixture.detectChanges();
    expect(rootElement.querySelector('.progress-spinner')).not.toBeNull();
  });

  it('should show the recipe component if recipe is defined', () => {
    // Check that the app recipe component appears after loading a recipe
    appComponent.recipe = mockRecipe;
    fixture.detectChanges();
    // debugElement allows for more Angular-specific queries
    expect(
      fixture.debugElement.query(By.directive(RecipeComponent))
    ).toBeDefined();
  });
});
