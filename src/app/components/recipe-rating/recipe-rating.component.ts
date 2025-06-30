import { CommonModule } from '@angular/common';
import { Component, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ShorthandPipe } from '../../pipes/shorthand.pipe';

@Component({
  selector: 'app-recipe-rating',
  imports: [CommonModule, MatButtonModule, MatIconModule, ShorthandPipe],
  templateUrl: './recipe-rating.component.html',
  styleUrl: './recipe-rating.component.scss',
})
export class RecipeRatingComponent {
  readonly averageRating = input.required<number | null>();
  readonly totalRatings = input.required<number>();
  readonly myRating = input<number>();
  readonly enabled = input(true);
  readonly handleRate = output<number>();

  hoveringStar = signal<number | undefined>(undefined);

  readonly RATINGS = Array.from({ length: 5 }, (_, i) => i + 1);

  starIcon(i: number) {
    // In the hovering state, always fill the stars to the left and keep the right stars empty
    const hoveringStarState = this.hoveringStar();
    if (hoveringStarState !== undefined) {
      return i <= hoveringStarState ? 'star' : 'star_outlined';
    }

    // If the user has rated the recipe, show their rating instead of the average
    // If there are no ratings, show all empty stars
    const starRating = this.myRating() ?? this.averageRating() ?? 0;
    const stars = Math.round(starRating);

    if (i < stars || (i === stars && starRating >= stars)) {
      return 'star';
    } else if (i === stars && starRating < stars) {
      return 'star_half';
    } else {
      return 'star_outlined';
    }
  }

  ratingLabel() {
    if (this.myRating() !== undefined) {
      return `Your rating: ${this.myRating()} out of 5 stars`;
    } else if (this.averageRating() !== null) {
      return `Average rating: ${this.averageRating()} out of 5 stars`;
    } else {
      return 'No ratings available';
    }
  }

  starRatingInputLabel(stars: number) {
    return `Rate ${stars} ${stars === 1 ? 'star' : 'stars'}`;
  }

  onClick(event: MouseEvent, star_i: number) {
    event.stopPropagation();
    this.handleRate.emit(star_i);
  }

  onHoverStart(star_i: number) {
    this.hoveringStar.set(star_i);
  }

  onHoverEnd() {
    this.hoveringStar.set(undefined);
  }
}
