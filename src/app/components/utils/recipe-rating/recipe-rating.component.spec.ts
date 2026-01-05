import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { RecipeRatingComponent } from './recipe-rating.component';

describe('RecipeRatingComponent', () => {
  let recipeRatingComponent: RecipeRatingComponent;
  let recipeRatingRef: ComponentRef<RecipeRatingComponent>;
  let fixture: ComponentFixture<RecipeRatingComponent>;
  let rootElement: HTMLElement;

  const initializeRecipeRating = async ({
    averageRating,
    totalRatings,
    myRating,
    hoveringStar,
  }: {
    averageRating: number | null;
    totalRatings: number;
    myRating?: number;
    hoveringStar?: number;
  }) => {
    recipeRatingRef.setInput('averageRating', averageRating);
    recipeRatingRef.setInput('totalRatings', totalRatings);
    recipeRatingRef.setInput('myRating', myRating);
    recipeRatingComponent.hoveringStar.set(hoveringStar);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeRatingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeRatingComponent);
    recipeRatingComponent = fixture.componentInstance;
    recipeRatingRef = fixture.componentRef;
    rootElement = fixture.nativeElement;
    // Don't call whenStable() until all required inputs are set
  });

  it('should create', () => {
    expect(recipeRatingComponent).toBeTruthy();
    expect(recipeRatingComponent.starRatingInputLabel(1)).toBe('Rate 1 star');
    expect(recipeRatingComponent.starRatingInputLabel(5)).toBe('Rate 5 stars');
  });

  it('should show a full star rating', async () => {
    // Given an average rating of 4
    await initializeRecipeRating({
      averageRating: 4,
      totalRatings: 1,
    });

    // Then the first 4 stars should be filled
    [1, 2, 3, 4].forEach((i) => {
      expect(recipeRatingComponent.starIcon(i)).toBe('star');
    });
    expect(recipeRatingComponent.starIcon(5)).toBe('star_outlined');

    expect(recipeRatingComponent.ratingLabel()).toBe(
      'Average rating: 4 out of 5 stars'
    );
  });

  it('should show a half-star rating', async () => {
    // Given an average rating of 2.5
    await initializeRecipeRating({
      averageRating: 2.5,
      totalRatings: 4,
    });

    // Then half a star should be filled
    expect(recipeRatingComponent.starIcon(1)).toBe('star');
    expect(recipeRatingComponent.starIcon(2)).toBe('star');
    expect(recipeRatingComponent.starIcon(3)).toBe('star_half');
    expect(recipeRatingComponent.starIcon(4)).toBe('star_outlined');
    expect(recipeRatingComponent.starIcon(5)).toBe('star_outlined');

    expect(recipeRatingComponent.ratingLabel()).toBe(
      'Average rating: 2.5 out of 5 stars'
    );
  });

  it('should round down a decimal rating', async () => {
    // Given an average rating of 26/6 (4.333)
    await initializeRecipeRating({
      averageRating: 26 / 6,
      totalRatings: 6,
    });

    // Then the rating should be rounded down
    [1, 2, 3, 4].forEach((i) => {
      expect(recipeRatingComponent.starIcon(i)).toBe('star');
    });
    expect(recipeRatingComponent.starIcon(5)).toBe('star_outlined');

    expect(recipeRatingComponent.ratingLabel()).toBe(
      'Average rating: 4.333333333333333 out of 5 stars'
    );
  });

  it('should round up a decimal rating', async () => {
    // Given an average rating of 28/6 (4.667)
    await initializeRecipeRating({
      averageRating: 28 / 6,
      totalRatings: 6,
    });

    // Then the rating should be rounded up
    [1, 2, 3, 4].forEach((i) => {
      expect(recipeRatingComponent.starIcon(i)).toBe('star');
    });
    expect(recipeRatingComponent.starIcon(5)).toBe('star_half');

    expect(recipeRatingComponent.ratingLabel()).toBe(
      'Average rating: 4.666666666666667 out of 5 stars'
    );
  });

  it('should omit the average rating if not available', async () => {
    // Given no ratings
    await initializeRecipeRating({
      averageRating: null,
      totalRatings: 0,
    });

    // Then no stars should be filled
    [1, 2, 3, 4].forEach((i) => {
      expect(recipeRatingComponent.starIcon(i)).toBe('star_outlined');
    });

    expect(recipeRatingComponent.ratingLabel()).toBe('No ratings available');
  });

  it('should display my rating if available', async () => {
    // Given a chef's rating
    await initializeRecipeRating({
      averageRating: 3,
      totalRatings: 2,
      myRating: 1,
    });

    // Then that should be shown instead of the average rating
    expect(recipeRatingComponent.starIcon(1)).toBe('star');
    [2, 3, 4, 5].forEach((i) => {
      expect(recipeRatingComponent.starIcon(i)).toBe('star_outlined');
    });

    expect(recipeRatingComponent.ratingLabel()).toBe(
      'Your rating: 1 out of 5 stars'
    );
  });

  it('should fill all stars to the left if hovering', async () => {
    // Given a hovered rating
    await initializeRecipeRating({
      averageRating: 3.5,
      totalRatings: 4,
      hoveringStar: 2,
    });

    // Then the first 2 stars should be filled
    [1, 2].forEach((i) => {
      expect(recipeRatingComponent.starIcon(i)).toBe('star');
    });
    [3, 4, 5].forEach((i) => {
      expect(recipeRatingComponent.starIcon(i)).toBe('star_outlined');
    });

    expect(recipeRatingComponent.ratingLabel()).toBe(
      'Average rating: 3.5 out of 5 stars'
    );
  });

  it('should send rating values for each star', async () => {
    // Given no ratings
    const rateEmitSpy = vi.spyOn(recipeRatingComponent.handleRate, 'emit');
    await initializeRecipeRating({
      averageRating: null,
      totalRatings: 0,
    });

    // When each star is clicked
    const stars =
      rootElement.querySelectorAll<HTMLButtonElement>('.rating-button');
    stars.forEach((star, star_i) => {
      star.click();
      // Then they should emit their rating value
      expect(rateEmitSpy).toHaveBeenCalledWith(star_i + 1);
    });
  });
});
