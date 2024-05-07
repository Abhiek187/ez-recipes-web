import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

import Term from 'src/app/models/term.model';
import { TermsService } from 'src/app/services/terms.service';

@Component({
  selector: 'app-glossary',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatListModule],
  templateUrl: './glossary.component.html',
  styleUrl: './glossary.component.scss',
})
export class GlossaryComponent implements OnInit {
  terms: Term[] | null = null;

  constructor(private termsService: TermsService) {}

  ngOnInit(): void {
    this.terms = this.termsService.getCachedTerms();
    // Sort all the terms alphabetically for ease of reference
    this.terms?.sort((a, b) => {
      if (a.word < b.word) return -1;
      else if (a.word > b.word) return 1;
      else return 0;
    });
  }
}
