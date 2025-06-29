import { Component, inject, OnDestroy, signal } from '@angular/core';
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
import { Subscription } from 'rxjs';

import Constants from 'src/app/constants/constants';
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
export class UpdateEmailComponent implements OnDestroy {
  private chefService = inject(ChefService);
  private snackBar = inject(MatSnackBar);

  private chefServiceSubscription?: Subscription;

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

  ngOnDestroy(): void {
    this.chefServiceSubscription?.unsubscribe();
  }

  updateEmail() {
    this.isLoading.set(true);
    const { email } = this.formGroup.value;
    const fields: ChefUpdate = {
      type: ChefUpdateType.Email,
      email: email ?? '',
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
        next: ({ token }) => {
          this.emailSent.set(true);

          if (token !== undefined) {
            localStorage.setItem(Constants.LocalStorage.token, token);
          }
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
