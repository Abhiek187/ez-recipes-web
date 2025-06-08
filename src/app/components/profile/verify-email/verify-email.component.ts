import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
export class VerifyEmailComponent {
  private chefService = inject(ChefService);
  private router = inject(Router);

  email = signal('test@example.com');
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

  resendVerificationEmail() {
    const token = localStorage.getItem(Constants.LocalStorage.token);
    if (token !== null) {
      this.chefService.verifyEmail(token).subscribe();
    }
    this.enableResend.set(false);
  }

  logout() {
    const token = localStorage.getItem(Constants.LocalStorage.token);
    if (token !== null) {
      this.chefService.logout(token).subscribe();
    }
    // Assume the user should be signed out since there's no auth token
    localStorage.removeItem(Constants.LocalStorage.token);
    this.router.navigate([routes.profile.path]);
  }
}
