import { Component, computed, inject, input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import Constants from 'src/app/constants/constants';
import { Provider } from 'src/app/models/profile.model';

@Component({
  selector: 'app-oauth-button',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './oauth-button.component.html',
  styleUrl: './oauth-button.component.scss',
})
export class OauthButtonComponent implements OnInit {
  private iconRegistry = inject(MatIconRegistry);
  private sanitizer = inject(DomSanitizer);

  readonly provider = input.required<Provider>();
  readonly authUrl = input<string>();

  readonly providerStyle = computed(
    () => Constants.providerStyles[this.provider()]
  );
  readonly providerIcon = computed(() => this.providerStyle().label);

  ngOnInit(): void {
    // Add all the SVGs inline so they can be stylized
    this.iconRegistry.addSvgIcon(
      this.providerIcon(),
      this.sanitizer.bypassSecurityTrustResourceUrl(
        `assets/${this.providerStyle().icon}`
      )
    );
  }

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
