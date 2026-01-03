import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';

import Constants from 'src/app/constants/constants';
import { OAuthResponse, Provider } from 'src/app/models/profile.model';
import { ChefService } from 'src/app/services/chef.service';
import { profileRoutes, routes } from 'src/app/app-routing.module';

@Component({
  selector: 'app-oauth-button',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  host: {
    '(window:message)': 'onMessage($event)',
  },
  templateUrl: './oauth-button.component.html',
  styleUrl: './oauth-button.component.scss',
})
export class OauthButtonComponent implements OnInit {
  private iconRegistry = inject(MatIconRegistry);
  private sanitizer = inject(DomSanitizer);
  private snackBar = inject(MatSnackBar);
  private chefService = inject(ChefService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly provider = input.required<Provider>();
  readonly authUrl = input<string>();

  isLoading = signal(false);

  readonly providerStyle = computed(
    () => Constants.providerStyles[this.provider()]
  );
  readonly providerIcon = computed(() => this.providerStyle().label);
  /* Keep track of which provider we're signing into
   * so the right oauth-button responds on redirect
   */
  readonly providerState = computed<string | null>(() => {
    if (this.authUrl() === undefined) return null;
    const authUrl = new URL(this.authUrl() ?? '');
    return authUrl.searchParams.get('state');
  });

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
      this.snackBar.open(
        'Pop-ups are required to sign in a new tab. Please enable them to continue.',
        'Dismiss'
      );
    }
  }

  onMessage(event: MessageEvent<OAuthResponse>) {
    // Discard messages that don't come from the OAuth flow
    if (event.origin !== window.location.origin) return;
    const authState = event.data?.state;
    if (this.providerState() === null || authState !== this.providerState())
      return;

    // Extract the authorization code from the redirect and then exchange it for an ID token
    const authCode = event.data?.code;
    if (typeof authCode !== 'string') {
      this.snackBar.open('No auth code received', 'Dismiss');
      return;
    }

    this.isLoading.set(true);
    const oAuthRequest: Parameters<typeof this.chefService.loginWithOAuth>[0] =
      {
        code: authCode,
        providerId: this.provider(),
      };
    this.chefService
      .loginWithOAuth(oAuthRequest)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: ({ email, emailVerified }) => {
          // Check if the user signed up, but didn't verify their email yet
          if (!emailVerified) {
            // Don't update the chef's verified status until they click the redirect link
            this.chefService.verifyEmail().subscribe();
            this.router.navigate([profileRoutes.verifyEmail.path], {
              state: { email },
            });
          } else {
            // If a redirect URL is present in the query params, navigate to it
            // Otherwise, navigate to the profile page
            const redirectUrl = this.route.snapshot.queryParamMap.get('next');
            if (redirectUrl !== null) {
              this.router.navigateByUrl(redirectUrl, {
                // Several pages require the chef's email
                state: { email },
              });
            } else {
              this.router.navigate([routes.profile.path]);
            }
          }
        },
        error: (error) => {
          this.snackBar.open(error.message, 'Dismiss');
        },
      });
  }
}
