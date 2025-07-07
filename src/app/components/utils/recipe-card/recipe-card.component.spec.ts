import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';

import { RecipeCardComponent } from './recipe-card.component';
import { mockRecipe, mockToken } from 'src/app/models/recipe.mock';
import { mockChef } from 'src/app/models/profile.mock';
import { RecipeService } from 'src/app/services/recipe.service';

describe('RecipeCardComponent', () => {
  let recipeCardComponent: RecipeCardComponent;
  let fixture: ComponentFixture<RecipeCardComponent>;
  let rootElement: HTMLElement;

  let mockRouter: jasmine.SpyObj<Router>;
  let mockRecipeService: jasmine.SpyObj<RecipeService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRecipeService = jasmine.createSpyObj(
      'RecipeService',
      ['updateRecipe'],
      {
        recipe: signal(mockRecipe),
      }
    );

    await TestBed.configureTestingModule({
      imports: [RecipeCardComponent, RouterModule.forRoot([])],
      providers: [
        {
          provide: Router,
          useValue: mockRouter,
        },
        {
          provide: RecipeService,
          useValue: mockRecipeService,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    const localStorageProto = Object.getPrototypeOf(localStorage);
    spyOn(localStorageProto, 'getItem').and.returnValue(mockChef.token);
    spyOn(localStorageProto, 'setItem').and.callFake(() => undefined);
    spyOn(localStorageProto, 'removeItem').and.callFake(() => undefined);

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

  it('should disable the favorite button if unauthenticated', () => {
    recipeCardComponent.chef.set(undefined);
    fixture.detectChanges();

    const favoriteButton = rootElement.querySelector<HTMLButtonElement>(
      '.recipe-favorite-icon'
    );
    expect(favoriteButton?.disabled).toBeTrue();
    expect(recipeCardComponent.isFavorite()).toBeFalse();
  });

  it('should toggle isFavorite', () => {
    // Check that isFavorite toggles when the heart button is clicked
    recipeCardComponent.chef.set(mockChef);
    fixture.detectChanges();
    expect(recipeCardComponent.isFavorite()).toBeFalse();

    const favoriteButton = rootElement.querySelector<HTMLButtonElement>(
      '.recipe-favorite-icon'
    );
    mockRecipeService.updateRecipe.and.returnValue(of(mockToken));
    favoriteButton?.click();
    fixture.detectChanges();
    expect(mockRecipeService.updateRecipe).toHaveBeenCalledWith(mockRecipe.id, {
      isFavorite: true,
    });
    expect(recipeCardComponent.chef()?.favoriteRecipes).toContain(
      mockRecipe.id.toString()
    );
    expect(recipeCardComponent.isFavorite()).toBeTrue();

    favoriteButton?.click();
    fixture.detectChanges();
    expect(mockRecipeService.updateRecipe).toHaveBeenCalledWith(mockRecipe.id, {
      isFavorite: false,
    });
    expect(recipeCardComponent.chef()?.favoriteRecipes).not.toContain(
      mockRecipe.id.toString()
    );
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
