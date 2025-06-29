import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import Constants from 'src/app/constants/constants';
import { ChefUpdate, ChefUpdateType } from 'src/app/models/profile.model';
import { ChefService } from 'src/app/services/chef.service';
import { profileRoutes } from 'src/app/app-routing.module';

const formControls = {
  password: 'password',
  passwordConfirm: 'passwordConfirm',
} as const;
const formErrors = {
  required: 'required',
  passwordMinLength: 'minlength',
  passwordMismatch: 'passwordMismatch',
} as const;

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
  passwordConfirm?.setErrors(error);
  return error;
};

@Component({
  selector: 'app-update-password',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.scss',
})
export class UpdatePasswordComponent implements OnInit, OnDestroy {
  private chefService = inject(ChefService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  private chefServiceSubscription?: Subscription;

  showPassword = signal(false);
  showPasswordConfirm = signal(false);
  isLoading = signal(false);
  private chefEmail = signal('');

  formControls = formControls;
  formErrors = formErrors;
  formGroup = new FormGroup(
    {
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
    [formErrors.required]: 'Error: password is required',
    [formErrors.passwordMinLength]: `Error: Password must be at least ${Constants.passwordMinLength} characters long`,
    [formErrors.passwordMismatch]: 'Error: Passwords do not match',
  } as const;

  ngOnInit(): void {
    const email = this.router.lastSuccessfulNavigation?.extras?.state?.email;
    if (typeof email === 'string') {
      this.chefEmail.set(email);
    }
  }

  ngOnDestroy(): void {
    this.chefServiceSubscription?.unsubscribe();
  }

  togglePasswordVisibility(event: MouseEvent) {
    event.preventDefault();
    this.showPassword.set(!this.showPassword());
  }

  togglePasswordConfirmVisibility(event: MouseEvent) {
    event.preventDefault();
    this.showPasswordConfirm.set(!this.showPasswordConfirm());
  }

  updatePassword() {
    this.isLoading.set(true);
    const { password } = this.formGroup.value;
    const fields: ChefUpdate = {
      type: ChefUpdateType.Password,
      email: this.chefEmail(),
      password: password ?? '',
    };
    const token = localStorage.getItem(Constants.LocalStorage.token);
    if (token === null) {
      this.isLoading.set(false);
      this.snackBar.open(Constants.noTokenFound, 'Dismiss');
      return;
    }

    this.chefServiceSubscription = this.chefService
      .updateChef(fields, token)
      .subscribe({
        next: () => {
          // The token will be revoked, so sign out the user
          localStorage.removeItem(Constants.LocalStorage.token);
          this.snackBar.open(
            'Password updated successfully! Please sign in again.',
            'Dismiss'
          );
          this.router.navigate([profileRoutes.login.path]);
        },
        error: (error) => {
          this.snackBar.open(error.message, 'Dismiss');
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
  }
}
