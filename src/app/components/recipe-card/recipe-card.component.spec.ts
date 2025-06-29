import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';

import { RecipeCardComponent } from './recipe-card.component';
import { mockRecipe } from 'src/app/models/recipe.mock';

describe('RecipeCardComponent', () => {
  let recipeCardComponent: RecipeCardComponent;
  let fixture: ComponentFixture<RecipeCardComponent>;
  let rootElement: HTMLElement;

  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RecipeCardComponent, RouterModule.forRoot([])],
      providers: [
        {
          provide: Router,
          useValue: mockRouter,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeCardComponent);
    recipeCardComponent = fixture.componentInstance;
    fixture.componentRef.setInput('recipe', mockRecipe); // input is required
    rootElement = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create a recipe card', () => {
    // All elements should be visible on the recipe card
    expect(recipeCardComponent).toBeTruthy();
    expect(recipeCardComponent.calories()).toEqual(
      mockRecipe.nutrients.find((nutrient) => nutrient.name === 'Calories')
    );

    const recipeCard = rootElement.querySelector<HTMLElement>('.recipe-card');
    expect(recipeCard).not.toBeNull();

    const recipeImage = recipeCard?.querySelector<HTMLImageElement>('img');
    expect(recipeImage?.src).toBe(mockRecipe.image);
    expect(recipeImage?.alt).toBe('');

    const recipeContent =
      recipeCard?.querySelector<HTMLElement>('.recipe-content');
    expect(recipeContent?.textContent).toContain(mockRecipe.name);
    expect(recipeContent?.textContent).toContain(
      `Time: ${mockRecipe.time} minutes`
    );
    expect(recipeContent?.textContent).toContain(
      `${Math.round(recipeCardComponent.calories()!.amount)} ${
        recipeCardComponent.calories()?.unit
      }`
    );
  });

  it('should toggle isFavorite', () => {
    // Check that isFavorite toggles when the heart button is clicked
    expect(recipeCardComponent.isFavorite()).toBeFalse();

    const favoriteButton = rootElement.querySelector<HTMLButtonElement>(
      '.recipe-favorite-icon'
    );
    favoriteButton?.click();
    fixture.detectChanges();
    expect(recipeCardComponent.isFavorite()).toBeTrue();

    favoriteButton?.click();
    fixture.detectChanges();
    expect(recipeCardComponent.isFavorite()).toBeFalse();
  });

  it('should open the selected recipe', () => {
    // Check that the correct recipe is set and navigated to
    const recipeCard = rootElement.querySelector<HTMLElement>('.recipe-card');
    recipeCard?.click();
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      `/recipe/${mockRecipe.id}`,
    ]);
  });
});
