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
  form,
  FormField,
  required,
  SchemaPath,
  validate,
} from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { ChefService } from 'src/app/services/chef.service';
import { routes } from 'src/app/app-routing.module';

const usernamesMatch = (
  schema: SchemaPath<string>,
  chefUsername: Signal<string | null>,
) => {
  validate(schema, (context) => {
    const username = context.value();

    if (username !== chefUsername()) {
      return {
        kind: 'usernameMismatch',
        message: '',
      };
    }

    return null;
  });
};

@Component({
  selector: 'app-delete-account',
  imports: [
    FormField,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
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
  private username = signal('');
  private chefUsername = signal<string | null>(null);

  usernameForm = form(this.username, (username) => {
    required(username);
    usernamesMatch(username, this.chefUsername);
  });

  ngOnInit(): void {
    const email = this.router.lastSuccessfulNavigation()?.extras?.state?.email;
    if (typeof email === 'string') {
      this.chefUsername.set(email);
    }
  }

  deleteAccount(event: SubmitEvent) {
    event.preventDefault();
    this.isLoading.set(true);

    this.chefService
      .deleteChef()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        }),
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
