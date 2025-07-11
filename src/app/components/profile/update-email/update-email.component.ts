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
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';

import { ChefUpdate, ChefUpdateType } from 'src/app/models/profile.model';
import { ChefService } from 'src/app/services/chef.service';

@Component({
  selector: 'app-update-email',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './update-email.component.html',
  styleUrl: './update-email.component.scss',
})
export class UpdateEmailComponent {
  private chefService = inject(ChefService);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

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
    [this.formErrors.required]: 'Error: email is required',
    [this.formErrors.emailInvalid]: 'Error: Invalid email',
  } as const;

  updateEmail() {
    this.isLoading.set(true);
    const { email } = this.formGroup.value;
    const fields: ChefUpdate = {
      type: ChefUpdateType.Email,
      email: email ?? '',
    };

    this.chefService
      .updateChef(fields)
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
