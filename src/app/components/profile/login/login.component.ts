import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import { ChefService } from 'src/app/services/chef.service';
import { LoginCredentials } from 'src/app/models/profile.model';
import { profileRoutes, routes } from 'src/app/app-routing.module';
import Constants from 'src/app/constants/constants';

@Component({
  selector: 'app-login',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private chefService = inject(ChefService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  profileRoutes = profileRoutes;

  showPassword = signal(false);
  isLoading = signal(false);

  readonly formControls = {
    username: 'username',
    password: 'password',
  } as const;
  formGroup = new FormGroup({
    [this.formControls.username]: new FormControl('', [Validators.required]),
    [this.formControls.password]: new FormControl('', [Validators.required]),
  });
  readonly errors = {
    required: (field: string) => `Error: ${field} is required`,
  } as const;

  togglePasswordVisibility(event: MouseEvent) {
    event.preventDefault(); // don't submit the form
    this.showPassword.set(!this.showPassword());
  }

  login() {
    this.isLoading.set(true);
    const { username, password } = this.formGroup.value;
    const loginCredentials: LoginCredentials = {
      email: username ?? '',
      password: password ?? '',
    };

    this.chefService
      .login(loginCredentials)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: ({ token, emailVerified }) => {
          localStorage.setItem(Constants.LocalStorage.token, token);

          // Check if the user signed up, but didn't verify their email yet
          if (!emailVerified) {
            // Don't update the chef's verified status until they click the redirect link
            this.chefService.verifyEmail(token).subscribe();
            this.router.navigate([profileRoutes.verifyEmail.path], {
              state: { email: username },
            });
          } else {
            // If a redirect URL is present in the query params, navigate to it
            // Otherwise, navigate to the profile page
            const redirectUrl = this.route.snapshot.queryParamMap.get('next');
            if (redirectUrl !== null) {
              this.router.navigateByUrl(redirectUrl, {
                // Several pages require the chef's email
                state: { email: username },
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
