import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  imports: [RouterModule],
  templateUrl: './page-not-found.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './page-not-found.component.scss',
})
export class PageNotFoundComponent {}
