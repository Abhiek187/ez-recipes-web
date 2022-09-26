import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { mockRecipe } from '../../models/recipe.mock';
import { RecipeComponent } from './recipe.component';

describe('RecipeComponent', () => {
  let recipeComponent: RecipeComponent;
  let fixture: ComponentFixture<RecipeComponent>;
  let rootElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipeComponent],
      imports: [
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatDividerModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeComponent);
    fixture.detectChanges();
    recipeComponent = fixture.componentInstance;
    recipeComponent.recipe = mockRecipe;
    rootElement = fixture.nativeElement;
    fixture.detectChanges();
  });

  const expectLinkToOpenInNewTab = (link: HTMLAnchorElement) => {
    // Check that the link opens in a new tab
    expect(link.target).toBe('_blank');
    expect(link.rel).toBe('noopener noreferrer');
  };

  it('should display all recipe information in the header', () => {
    // Check that the recipe header shows all relevant information
    expect(recipeComponent).toBeTruthy();

    // The heading should show the recipe name and URL
    const recipeName =
      rootElement.querySelector<HTMLHeadingElement>('.recipe-name');
    expect(recipeName?.textContent).toBe(recipeComponent.recipe!.name);
    const recipeLink =
      rootElement.querySelector<HTMLAnchorElement>('.recipe-link');
    expect(recipeLink).not.toBeNull();
    expect(recipeLink?.href).toBe(recipeComponent.recipe!.url);
    expectLinkToOpenInNewTab(recipeLink!);
  });

  it('should display all recipe information in the aside', () => {
    // Check that the recipe aside shows all relevant information
    // Check the recipe image and caption
    const recipeImage =
      rootElement.querySelector<HTMLImageElement>('.recipe-image');
    expect(recipeImage?.src).toBe(recipeComponent.recipe!.image);
    expect(recipeImage?.alt).toBe(recipeComponent.recipe!.name);
    const recipeCaption =
      rootElement.querySelector<HTMLElement>('.recipe-caption');
    expect(recipeCaption?.textContent).toContain(
      recipeComponent.recipe!.credit
    );
    const recipeCaptionLink =
      recipeCaption?.firstElementChild as HTMLAnchorElement;
    expect(recipeCaptionLink.href).toBe(recipeComponent.recipe!.sourceUrl);
    expectLinkToOpenInNewTab(recipeCaptionLink);

    // The recipe time should be in minutes
    const recipeTime =
      rootElement.querySelector<HTMLHeadingElement>('.recipe-time');
    expect(recipeTime?.textContent).toContain(
      `${recipeComponent.recipe!.time} minutes`
    );

    // The "I Made This!" and "Show Me Another Recipe!" buttons should be present
    const madeContainer =
      rootElement.querySelector<HTMLDivElement>('.made-container');
    expect(madeContainer?.textContent).toContain('I Made This!');
    const showRecipeContainer = rootElement.querySelector<HTMLDivElement>(
      '.show-recipe-container'
    );
    expect(showRecipeContainer?.textContent).toContain(
      'Show Me Another Recipe!'
    );

    // Check the nutrition label
    const nutritionCard =
      rootElement.querySelector<HTMLElement>('.nutrition-card');
    expect(nutritionCard?.textContent).toContain('Nutrition Facts');
    expect(nutritionCard?.textContent).toContain(
      recipeComponent.recipe!.healthScore
    );
    // Servings should be plural if > 1
    expect(nutritionCard?.textContent).toContain(
      `${recipeComponent.recipe!.servings} servings`
    );

    // Each nutrient should be displayed
    const nutritionGrid =
      nutritionCard?.querySelector<HTMLDivElement>('.nutrient-grid');
    for (const nutrient of recipeComponent.recipe!.nutrients) {
      expect(nutritionGrid?.textContent).toContain(nutrient.name);
      // The nutrient amount should be rounded to the nearest whole number
      const roundedAmount = Math.round(nutrient.amount);
      expect(nutritionGrid?.textContent).toContain(roundedAmount);
      expect(nutritionGrid?.textContent).toContain(nutrient.unit);
    }
  });

  it('should display all recipe information in the recipe section', () => {
    // Check that the recipe section shows all relevant information
    const recipeSummaryCard = rootElement.querySelector<HTMLElement>(
      '.recipe-summary-card'
    );
    expect(recipeSummaryCard?.textContent).toContain('Summary');
    expect(recipeSummaryCard?.innerHTML).toContain(
      recipeComponent.recipe!.summary
    );

    // All ingredients should appear
    const ingredientsCard = rootElement.querySelector<HTMLElement>(
      '.recipe-ingredients-card'
    );
    expect(ingredientsCard?.textContent).toContain('Ingredients');

    const ingredientGrid =
      ingredientsCard?.querySelector<HTMLDivElement>('.ingredient-grid');
    for (const ingredient of recipeComponent.recipe!.ingredients) {
      // The ingredient name should be in capitalized
      const capitalizedName = ingredient.name.replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
      expect(ingredientGrid?.textContent).toContain(capitalizedName);
      expect(ingredientGrid?.textContent).toContain(ingredient.amount);
      expect(ingredientGrid?.textContent).toContain(ingredient.unit);
    }
  });

  it('should display all recipe information in the main section', () => {
    // Check that the main recipe section shows all relevant information
    const stepsHeader =
      rootElement.querySelector<HTMLHeadingElement>('.steps-header');
    expect(stepsHeader?.textContent).toContain('Steps');

    for (const [
      instructionIndex,
      instruction,
    ] of recipeComponent.recipe!.instructions.entries()) {
      const instructionsContainer =
        rootElement.querySelectorAll<HTMLDivElement>('.instructions-container')[
          instructionIndex
        ];
      // Each instruction should have a name (even if it's blank)
      const instructionHeader =
        instructionsContainer.querySelector<HTMLHeadingElement>(
          '.instruction-header'
        );
      expect(instructionHeader?.textContent).toMatch(instruction.name);

      for (const [stepIndex, step] of instruction.steps.entries()) {
        const stepCard =
          instructionsContainer.querySelectorAll<HTMLElement>('.step-card')[
            stepIndex
          ];

        // The step container should contain the step number and directions
        const stepContainer =
          stepCard.querySelector<HTMLDivElement>('.step-container');
        expect(stepContainer?.textContent).toContain(step.number);
        expect(stepContainer?.textContent).toContain(step.step);

        // The ingredients container should contain the step's ingredients and their images
        for (const [
          ingredientIndex,
          ingredient,
        ] of step.ingredients.entries()) {
          const ingredientListItem = stepCard?.querySelectorAll<HTMLLIElement>(
            '.step-ingredients-list-item'
          )[ingredientIndex];
          const ingredientImage =
            ingredientListItem?.firstElementChild as HTMLImageElement;
          expect(ingredientImage.src).toBe(
            `https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`
          );
          expect(ingredientImage.alt).toBe(ingredient.name);
          expect(ingredientListItem?.textContent).toContain(ingredient.name);
        }

        // The equipment container should constain the step's equipment and their images
        for (const [equipmentIndex, equipment] of step.equipment.entries()) {
          const equipmentListItem = stepCard?.querySelectorAll<HTMLLIElement>(
            '.step-equipment-list-item'
          )[equipmentIndex];
          const equipmentImage =
            equipmentListItem?.firstElementChild as HTMLImageElement;
          expect(equipmentImage.src).toBe(
            `https://spoonacular.com/cdn/equipment_100x100/${equipment.image}`
          );
          expect(equipmentImage.alt).toBe(equipment.name);
          expect(equipmentListItem?.textContent).toContain(equipment.name);
        }
      }
    }
  });

  it('should display all recipe information in the footer', () => {
    // Check that the recipe footer gives credit to spoonacular
    const recipeFooter =
      rootElement.querySelector<HTMLElement>('.recipe-footer');
    const apiLink = recipeFooter?.firstElementChild as HTMLAnchorElement;
    expect(apiLink.textContent).toContain('spoonacular');
    expect(apiLink.href).toBe('https://spoonacular.com/food-api');
    expectLinkToOpenInNewTab(apiLink);
  });

  it('should show a spinner while loading', () => {
    // Check that the material spinner shows when isLoading is true
    recipeComponent.isLoading = true;
    fixture.detectChanges();
    expect(rootElement.querySelector('.progress-spinner')).not.toBeNull();
  });

  it('should load another recipe after pressing the button', fakeAsync(() => {
    // Check that the "Show Me Another Recipe!" button loads another recipe
    spyOn(recipeComponent, 'getRandomRecipe');

    const showRecipeButton = rootElement.querySelector<HTMLButtonElement>(
      '.show-recipe-button'
    );
    expect(showRecipeButton).not.toBeNull();
    showRecipeButton?.click();
    tick(); // wait for the async tasks to complete

    expect(recipeComponent.getRandomRecipe).toHaveBeenCalled();
  }));
});
