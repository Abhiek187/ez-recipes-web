import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import { profileRoutes } from 'src/app/app-routing.module';
import { ChefUpdate, ChefUpdateType } from 'src/app/models/profile.model';
import { ChefService } from 'src/app/services/chef.service';

@Component({
  selector: 'app-forgot-password',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  private chefService = inject(ChefService);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);
  profileRoutes = profileRoutes;

  isLoading = signal(false);
  emailSent = signal(false);

  readonly formControls = {
    email: 'email',
  } as const;
  readonly formErrors = {
    required: 'required',
    emailInvalid: 'email',
  } as const;
  formGroup = new FormGroup({
    [this.formControls.email]: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
  });
  readonly errors = {
    [this.formErrors.required]: (field: string) =>
      `Error: ${field} is required`,
    [this.formErrors.emailInvalid]: 'Error: Invalid email',
  } as const;

  resetPassword() {
    this.isLoading.set(true);
    const { email } = this.formGroup.value;
    const chefUpdate: ChefUpdate = {
      type: ChefUpdateType.Password,
      email: email ?? '',
    };

    this.chefService
      .updateChef(chefUpdate)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.emailSent.set(true);
        },
        error: (error) => {
          this.snackBar.open(error.message, 'Dismiss');
        },
      });
  }
}
