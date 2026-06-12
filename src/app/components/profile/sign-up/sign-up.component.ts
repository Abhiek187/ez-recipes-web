import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  email,
  form,
  FormField,
  minLength,
  required,
  SchemaPathTree,
  validate,
} from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import { profileRoutes, routes } from 'src/app/app-routing.module';
import Constants from 'src/app/constants/constants';
import { LoginCredentials } from 'src/app/models/profile.model';
import { ChefService } from 'src/app/services/chef.service';

// Check if the passwords match
const passwordsMatch = (
  schema: SchemaPathTree<{
    email: string;
    password: string;
    passwordConfirm: string;
  }>,
) => {
  // This is required to make mat-error visible under the confirm password field
  validate(schema.passwordConfirm, (context) => {
    const password = context.valueOf(schema.password);
    const passwordConfirm = context.value();

    if (password !== passwordConfirm) {
      return {
        kind: 'passwordMismatch',
        message: 'Error: Passwords do not match',
      };
    }

    return null;
  });
};

@Component({
  selector: 'app-sign-up',
  imports: [
    FormField,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  private chefService = inject(ChefService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  profileRoutes = profileRoutes;

  showPassword = signal(false);
  showPasswordConfirm = signal(false);
  isLoading = signal(false);
  private signUpModel = signal({
    email: '',
    password: '',
    passwordConfirm: '',
  });

  signUpForm = form(this.signUpModel, (schemaPath) => {
    const { email: _email, password, passwordConfirm } = schemaPath;
    required(_email, { message: 'Error: email is required' });
    email(_email, { message: 'Error: Invalid email' }); // more relaxed than the server's RFC 5322 validation check

    required(password, { message: 'Error: password is required' });
    minLength(password, Constants.passwordMinLength, {
      message: `Error: Password must be at least ${Constants.passwordMinLength} characters long`,
    });

    required(passwordConfirm, {
      message: 'Error: passwordConfirm is required',
    });
    passwordsMatch(schemaPath);
  });

  togglePasswordVisibility(event: MouseEvent) {
    event.preventDefault();
    this.showPassword.set(!this.showPassword());
  }

  togglePasswordConfirmVisibility(event: MouseEvent) {
    event.preventDefault();
    this.showPasswordConfirm.set(!this.showPasswordConfirm());
  }

  signUp(event: SubmitEvent) {
    event.preventDefault();
    this.isLoading.set(true);
    const { email, password } = this.signUpForm().value();
    const loginCredentials: LoginCredentials = {
      email,
      password,
    };

    this.chefService
      .createChef(loginCredentials)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: ({ emailVerified }) => {
          if (!emailVerified) {
            // Should always be true
            this.chefService.verifyEmail().subscribe();
            this.router.navigate([profileRoutes.verifyEmail.path], {
              state: { email },
            });
          } else {
            const redirectUrl = this.route.snapshot.queryParamMap.get('next');
            if (redirectUrl !== null) {
              this.router.navigateByUrl(redirectUrl, {
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
