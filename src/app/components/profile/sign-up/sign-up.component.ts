import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
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

import { profileRoutes, routes } from 'src/app/app-routing.module';
import Constants from 'src/app/constants/constants';
import { LoginCredentials } from 'src/app/models/profile.model';
import { ChefService } from 'src/app/services/chef.service';

const formControls = {
  email: 'email',
  password: 'password',
  passwordConfirm: 'passwordConfirm',
} as const;
const formErrors = {
  required: 'required',
  emailInvalid: 'email',
  passwordMinLength: 'minlength', // Validator errors are all lowercase
  passwordMismatch: 'passwordMismatch',
} as const;

// Check if the passwords match
const passwordsMatchValidator: ValidatorFn = (control) => {
  const password = control.get(formControls.password);
  const passwordConfirm = control.get(formControls.passwordConfirm);

  const error =
    password?.value !== null &&
    passwordConfirm?.value !== null &&
    password?.value !== passwordConfirm?.value
      ? {
          [formErrors.passwordMismatch]: true,
        }
      : null;
  // This is required to make mat-error visible under the confirm password field
  passwordConfirm?.setErrors(error);
  return error;
};

@Component({
  selector: 'app-sign-up',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
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

  formControls = formControls;
  formErrors = formErrors;
  formGroup = new FormGroup(
    {
      [formControls.email]: new FormControl('', [
        Validators.required,
        Validators.email, // more relaxed than the server's RFC 5322 validation check
      ]),
      [formControls.password]: new FormControl('', [
        Validators.required,
        Validators.minLength(Constants.passwordMinLength),
      ]),
      [formControls.passwordConfirm]: new FormControl('', [
        Validators.required,
      ]),
    },
    { validators: passwordsMatchValidator }
  );
  readonly errors = {
    [formErrors.required]: (field: string) => `Error: ${field} is required`,
    [formErrors.emailInvalid]: 'Error: Invalid email',
    [formErrors.passwordMinLength]: `Error: Password must be at least ${Constants.passwordMinLength} characters long`,
    [formErrors.passwordMismatch]: 'Error: Passwords do not match',
  } as const;

  togglePasswordVisibility(event: MouseEvent) {
    event.preventDefault();
    this.showPassword.set(!this.showPassword());
  }

  togglePasswordConfirmVisibility(event: MouseEvent) {
    event.preventDefault();
    this.showPasswordConfirm.set(!this.showPasswordConfirm());
  }

  signUp() {
    this.isLoading.set(true);
    const { email, password } = this.formGroup.value;
    const loginCredentials: LoginCredentials = {
      email: email ?? '',
      password: password ?? '',
    };

    this.chefService
      .createChef(loginCredentials)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        })
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
