import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { AppComponent } from './app.component';
import { TermsService } from './services/terms.service';
import { mockTerms } from './models/term.mock';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let appComponent: AppComponent;

  beforeEach(async () => {
    // Import all the necessary modules and components to test the app component
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: false }),
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    appComponent = fixture.componentInstance;

    vi.spyOn(TermsService.prototype, 'getTerms').mockReturnValue(of(mockTerms));
  });

  it('should create the app', () => {
    // Check that the component can render
    vi.spyOn(TermsService.prototype, 'getCachedTerms').mockReturnValue(
      mockTerms
    );
    // Re-render the component after setting up mocks
    fixture.detectChanges();

    expect(appComponent).toBeTruthy();
    expect(TermsService.prototype.getCachedTerms).toHaveBeenCalled();
    expect(TermsService.prototype.getTerms).not.toHaveBeenCalled();
  });

  it("should fetch all the terms if they're not saved", () => {
    vi.spyOn(TermsService.prototype, 'getCachedTerms').mockReturnValue(null);
    fixture.detectChanges();

    expect(TermsService.prototype.getCachedTerms).toHaveBeenCalled();
    expect(TermsService.prototype.getTerms).toHaveBeenCalled();
  });
});
