import { Component, OnInit, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

import { NavbarComponent } from './components/navbar/navbar.component';
import { TermsService } from './services/terms.service';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private swUpdate = inject(SwUpdate);
  private snackBar = inject(MatSnackBar);
  private termsService = inject(TermsService);

  constructor() {
    // Notify the user if a new version of the PWA is available
    this.swUpdate.versionUpdates
      .pipe(
        filter(
          (event): event is VersionReadyEvent => event.type === 'VERSION_READY'
        )
      )
      .subscribe(() => {
        const snackBarRef = this.snackBar.open(
          'A new version is available!',
          'Reload',
          {
            duration: 10_000, // allow the user to optionally decline
          }
        );
        snackBarRef.onAction().subscribe(() => {
          window.location.reload();
        });
      });

    // Notify the user if they're forced to refresh to fetch the latest version
    this.swUpdate.unrecoverable.subscribe((event) => {
      const snackBarRef = this.snackBar.open(
        `An error occurred that we cannot recover from: ${event.reason} Please reload the page.`,
        'Reload'
      );
      snackBarRef.onAction().subscribe(() => {
        window.location.reload();
      });
    });
  }

  ngOnInit(): void {
    // Check if terms need to be cached
    const savedTerms = this.termsService.getCachedTerms();

    if (savedTerms === null) {
      this.termsService.getTerms().subscribe({
        next: (terms) => {
          this.termsService.saveTerms(terms);
        },
        // No need to handle errors besides logging
      });
    }
  }
}
