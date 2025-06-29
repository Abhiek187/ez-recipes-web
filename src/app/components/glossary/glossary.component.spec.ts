import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlossaryComponent } from './glossary.component';
import { TermsService } from 'src/app/services/terms.service';
import { mockTerms } from 'src/app/models/term.mock';

describe('GlossaryComponent', () => {
  let glossaryComponent: GlossaryComponent;
  let fixture: ComponentFixture<GlossaryComponent>;
  let rootElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlossaryComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GlossaryComponent);
    glossaryComponent = fixture.componentInstance;
    spyOn(TermsService.prototype, 'getCachedTerms').and.returnValue(mockTerms);
    rootElement = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should show all the terms', () => {
    expect(glossaryComponent).toBeTruthy();
    expect(glossaryComponent.terms()).not.toBeNull();

    for (const term of mockTerms) {
      expect(rootElement.textContent).toContain(term.word);
      expect(rootElement.textContent).toContain(term.definition);
    }
  });
});
