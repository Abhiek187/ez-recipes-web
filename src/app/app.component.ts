import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private swUpdate: SwUpdate, private snackBar: MatSnackBar) {
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
}
