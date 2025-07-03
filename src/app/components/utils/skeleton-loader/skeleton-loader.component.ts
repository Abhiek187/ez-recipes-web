import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  imports: [],
  host: {
    '[style.width]': 'width()',
    '[style.height]': 'height()',
  },
  templateUrl: './skeleton-loader.component.html',
  styleUrl: './skeleton-loader.component.scss',
})
export class SkeletonLoaderComponent {
  readonly width = input.required<string>();
  readonly height = input.required<string>();
}
