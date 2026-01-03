import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

import { OAuthResponse } from 'src/app/models/profile.model';

@Component({
  selector: 'app-oauth-callback',
  imports: [MatProgressSpinnerModule],
  templateUrl: './oauth-callback.component.html',
  styleUrl: './oauth-callback.component.scss',
})
export class OauthCallbackComponent {
  private snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);

  constructor() {
    // Close this tab and pass the auth code to the parent tab
    const queryParams = this.route.snapshot.queryParamMap;
    const opener = window.opener as Window | null;

    if (opener !== null && queryParams.has('code')) {
      const oAuthResponse: OAuthResponse = {
        code: queryParams.get('code') ?? '',
        state: queryParams.get('state') ?? '',
      };
      opener.postMessage(oAuthResponse, window.location.origin);
      window.close();
    } else {
      this.snackBar.open(
        'Invalid OAuth callback. Please try signing in again.',
        'Dismiss'
      );
    }
  }
}
