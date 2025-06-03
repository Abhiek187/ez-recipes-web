
import { Component, OnInit, inject } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

import Term from 'src/app/models/term.model';
import { TermsService } from 'src/app/services/terms.service';

@Component({
  selector: 'app-glossary',
  imports: [MatDividerModule, MatListModule],
  templateUrl: './glossary.component.html',
  styleUrl: './glossary.component.scss',
})
export class GlossaryComponent implements OnInit {
  private termsService = inject(TermsService);

  terms?: Term[];

  ngOnInit(): void {
    this.terms = this.termsService.getCachedTerms()?.toSorted((a, b) => {
      // Sort all the terms alphabetically for ease of reference
      if (a.word < b.word) return -1;
      else if (a.word > b.word) return 1;
      else return 0;
    });
  }
}
