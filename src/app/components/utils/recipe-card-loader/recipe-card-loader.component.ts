import { Component } from '@angular/core';

import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-recipe-card-loader',
  imports: [SkeletonLoaderComponent],
  templateUrl: './recipe-card-loader.component.html',
  styleUrl: './recipe-card-loader.component.scss',
})
export class RecipeCardLoaderComponent {}
