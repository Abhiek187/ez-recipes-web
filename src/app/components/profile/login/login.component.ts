import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { form, FormField, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import { ChefService } from 'src/app/services/chef.service';
import { LoginCredentials, Provider } from 'src/app/models/profile.model';
import { profileRoutes, routes } from 'src/app/app-routing.module';
import { OauthButtonComponent } from '../../utils/oauth-button/oauth-button.component';
import { PasskeyButtonComponent } from '../../utils/passkey-button/passkey-button.component';

@Component({
  selector: 'app-login',
  imports: [
    FormField,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    OauthButtonComponent,
    PasskeyButtonComponent,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private chefService = inject(ChefService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  profileRoutes = profileRoutes;
  allProviders = Object.values(Provider);

  showPassword = signal(false);
  isLoading = signal(false);
  isStepUp = signal(false);
  authUrls = signal<Partial<Record<Provider, string>>>({});
  private loginModel = signal({
    username: '',
    password: '',
  });

  loginForm = form(this.loginModel, ({ username, password }) => {
    required(username, { message: `Error: username is required` });
    required(password, { message: `Error: password is required` });
  });

  ngOnInit(): void {
    const isStepUp =
      this.router.lastSuccessfulNavigation()?.extras?.state?.stepUp;
    if (typeof isStepUp === 'boolean') {
      this.isStepUp.set(isStepUp);
    }

    this.chefService
      .getAuthUrls()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (authUrls) => {
          this.authUrls.set(
            Object.fromEntries(
              authUrls.map(({ providerId, authUrl }) => [providerId, authUrl]),
            ),
          );
        },
        error: (error) => {
          this.snackBar.open(error.message, 'Dismiss');
          this.authUrls.set({});
        },
      });
  }

  togglePasswordVisibility(event: MouseEvent) {
    event.preventDefault(); // don't submit the form
    this.showPassword.set(!this.showPassword());
  }

  login(event: SubmitEvent) {
    event.preventDefault();
    this.isLoading.set(true);
    const { username, password } = this.loginForm().value();
    const loginCredentials: LoginCredentials = {
      email: username,
      password,
    };

    this.chefService
      .login(loginCredentials)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: ({ emailVerified }) => {
          this.onLoginSuccess(emailVerified, username);
        },
        error: (error) => {
          this.snackBar.open(error.message, 'Dismiss');
        },
      });
  }

  onLoginSuccess(emailVerified: boolean, email?: string | null) {
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
  }
}
