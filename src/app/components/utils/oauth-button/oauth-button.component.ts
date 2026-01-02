import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import Constants from 'src/app/constants/constants';
import { Provider } from 'src/app/models/profile.model';

@Component({
  selector: 'app-oauth-button',
  imports: [MatButtonModule],
  templateUrl: './oauth-button.component.html',
  styleUrl: './oauth-button.component.scss',
})
export class OauthButtonComponent {
  readonly provider = input.required<Provider>();
  readonly authUrl = input<string>();

  readonly providerStyle = computed(
    () => Constants.providerStyles[this.provider()]
  );

  startOAuthFlow(event: MouseEvent) {
    event.preventDefault();
    if (this.authUrl() === undefined) return;

    const newWindow = window.open(this.authUrl());

    if (newWindow === null || newWindow.closed) {
      alert(
        'Pop-ups are required to sign in a new tab. Please enable them to continue.'
      );
    }
  }
}
