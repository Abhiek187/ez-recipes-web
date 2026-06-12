import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { email, form, FormField, required } from '@angular/forms/signals';
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
    FormField,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
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
  private email = signal('');

  emailForm = form(this.email, (_email) => {
    required(_email, { message: `Error: ${_email} is required` });
    email(_email, { message: 'Error: Invalid email' });
  });

  resetPassword(event: SubmitEvent) {
    event.preventDefault();
    this.isLoading.set(true);
    const email = this.emailForm().value();
    const chefUpdate: ChefUpdate = {
      type: ChefUpdateType.Password,
      email,
    };

    this.chefService
      .updateChef(chefUpdate)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        }),
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
