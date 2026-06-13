import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
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
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import Constants from 'src/app/constants/constants';
import { ChefUpdate, ChefUpdateType } from 'src/app/models/profile.model';
import { ChefService } from 'src/app/services/chef.service';
import { profileRoutes } from 'src/app/app-routing.module';

const passwordsMatch = (
  schema: SchemaPathTree<{
    password: string;
    passwordConfirm: string;
  }>,
) => {
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
  selector: 'app-update-password',
  imports: [
    FormField,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.scss',
})
export class UpdatePasswordComponent implements OnInit {
  private chefService = inject(ChefService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  showPassword = signal(false);
  showPasswordConfirm = signal(false);
  isLoading = signal(false);
  private chefEmail = signal('');
  private updatePasswordModel = signal({
    password: '',
    passwordConfirm: '',
  });

  updatePasswordForm = form(this.updatePasswordModel, (schemaPath) => {
    const { password, passwordConfirm } = schemaPath;
    required(password, { message: 'Error: password is required' });
    minLength(password, Constants.passwordMinLength, {
      message: `Error: Password must be at least ${Constants.passwordMinLength} characters long`,
    });

    required(passwordConfirm, {
      message: 'Error: passwordConfirm is required',
    });
    passwordsMatch(schemaPath);
  });

  ngOnInit(): void {
    const email = this.router.lastSuccessfulNavigation()?.extras?.state?.email;
    if (typeof email === 'string') {
      this.chefEmail.set(email);
    }
  }

  togglePasswordVisibility(event: MouseEvent) {
    event.preventDefault();
    this.showPassword.set(!this.showPassword());
  }

  togglePasswordConfirmVisibility(event: MouseEvent) {
    event.preventDefault();
    this.showPasswordConfirm.set(!this.showPasswordConfirm());
  }

  updatePassword(event: SubmitEvent) {
    event.preventDefault();
    this.isLoading.set(true);
    const { password } = this.updatePasswordForm().value();
    const fields: ChefUpdate = {
      type: ChefUpdateType.Password,
      email: this.chefEmail(),
      password: password ?? '',
    };

    this.chefService
      .updateChef(fields)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.snackBar.open(
            'Password updated successfully! Please sign in again.',
            'Dismiss',
          );
          this.router.navigate([profileRoutes.login.path]);
        },
        error: (error) => {
          this.snackBar.open(error.message, 'Dismiss');
        },
      });
  }
}
