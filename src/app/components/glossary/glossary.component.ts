import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';

import Term from 'src/app/models/term.model';
import { TermsService } from 'src/app/services/terms.service';

@Component({
  selector: 'app-glossary',
  imports: [MatDividerModule, MatListModule, MatProgressSpinnerModule],
  templateUrl: './glossary.component.html',
  styleUrl: './glossary.component.scss',
})
export class GlossaryComponent implements OnInit {
  private termsService = inject(TermsService);
  private destroyRef = inject(DestroyRef);

  private terms = signal<Term[]>([]);
  isLoading = signal(false);

  // Sort all the terms alphabetically for ease of reference
  sortedTerms = computed(() =>
    this.terms().toSorted((a, b) => a.word.localeCompare(b.word)),
  );

  ngOnInit(): void {
    const cachedTerms = this.termsService.getCachedTerms();
    if (cachedTerms !== null) {
      this.terms.set(cachedTerms);
      return;
    }

    this.isLoading.set(true);
    this.termsService
      .getTerms()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: (terms) => {
          this.termsService.saveTerms(terms);
          this.terms.set(terms);
        },
        // No need to handle errors besides logging
      });
  }
}
