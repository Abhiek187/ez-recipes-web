
import { Component, inject, OnDestroy, signal } from '@angular/core';
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
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { ChefService } from 'src/app/services/chef.service';
import { LoginCredentials } from 'src/app/models/profile.model';
import { profileRoutes } from 'src/app/app-routing.module';

@Component({
  selector: 'app-login',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    RouterModule
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  private chefService = inject(ChefService);
  private snackBar = inject(MatSnackBar);
  profileRoutes = profileRoutes;

  private chefServiceSubscription?: Subscription;

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

  ngOnDestroy(): void {
    this.chefServiceSubscription?.unsubscribe();
  }

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

    this.chefServiceSubscription = this.chefService
      .login(loginCredentials)
      .subscribe({
        next: (loginResponse) => {
          this.isLoading.set(false);
          console.log('Login successful', loginResponse);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.snackBar.open(error.message, 'Dismiss');
        },
      });
  }
}
