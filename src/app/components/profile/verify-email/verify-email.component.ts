import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import Constants from 'src/app/constants/constants';
import { ChefService } from 'src/app/services/chef.service';
import { routes } from 'src/app/app-routing.module';

@Component({
  selector: 'app-verify-email',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent implements OnInit {
  private chefService = inject(ChefService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  email = signal('...');
  // Throttle the number of times the user can resend the verification email to satisfy API limits
  enableResend = signal(false);
  secondsRemaining = signal(Constants.emailCooldownSeconds);
  minutesRemaining = computed(() => Math.floor(this.secondsRemaining() / 60));

  constructor() {
    // effect will recompute whenever any signal it references changes,
    // so we need to use an observable instead
    toObservable(this.enableResend).subscribe((enableResend) => {
      if (!enableResend) {
        this.secondsRemaining.set(Constants.emailCooldownSeconds);

        const emailCooldownTimer = setInterval(() => {
          this.secondsRemaining.update((secondsRemaing) => secondsRemaing - 1);

          if (this.secondsRemaining() <= 0) {
            this.enableResend.set(true);
            clearInterval(emailCooldownTimer);
          }
        }, 1000);
      }
    });
  }

  ngOnInit(): void {
    /* State may not be available if navigating directly to this page,
     * but the the guard functions should redirect the user in this case
     */
    const email = this.router.lastSuccessfulNavigation()?.extras?.state?.email;
    if (typeof email === 'string') {
      this.email.set(email);
    }
  }

  resendVerificationEmail() {
    this.chefService.verifyEmail().subscribe({
      error: (error) => {
        this.snackBar.open(error.message, 'Dismiss');
      },
    });
    this.enableResend.set(false);
  }

  logout() {
    this.chefService.logout().subscribe();
    this.router.navigate([routes.profile.path]);
  }
}
