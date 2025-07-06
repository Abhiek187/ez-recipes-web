import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { ChefService } from 'src/app/services/chef.service';
import { routes } from 'src/app/app-routing.module';

const formControls = {
  username: 'username',
} as const;
const formErrors = {
  required: 'required',
  usernameMismatch: 'usernameMismatch',
} as const;

const usernamesMatchValidator =
  (chefUsername: Signal<string | null>): ValidatorFn =>
  (control) => {
    const username = control.value;

    return username !== null &&
      chefUsername() !== null &&
      username !== chefUsername()
      ? {
          [formErrors.usernameMismatch]: true,
        }
      : null;
  };

@Component({
  selector: 'app-delete-account',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.scss',
})
export class DeleteAccountComponent implements OnInit {
  private chefService = inject(ChefService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  isLoading = signal(false);
  private chefUsername = signal<string | null>(null);

  formControls = formControls;
  formErrors = formErrors;
  formGroup = new FormGroup({
    [formControls.username]: new FormControl('', [
      Validators.required,
      usernamesMatchValidator(this.chefUsername),
    ]),
  });

  ngOnInit(): void {
    const email = this.router.lastSuccessfulNavigation?.extras?.state?.email;
    if (typeof email === 'string') {
      this.chefUsername.set(email);
    }
  }

  deleteAccount() {
    this.isLoading.set(true);

    this.chefService
      .deleteChef()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Your account has been deleted.', 'Dismiss');
          this.router.navigate([routes.profile.path]);
        },
        error: (error) => {
          this.snackBar.open(error.message, 'Dismiss');
        },
      });
  }
}
