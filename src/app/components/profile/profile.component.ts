import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import {
  AuthState,
  ProfileAction,
  Provider,
} from 'src/app/models/profile.model';
import { profileRoutes } from 'src/app/app-routing.module';
import Constants from 'src/app/constants/constants';
import { ChefService } from 'src/app/services/chef.service';
import { OauthButtonComponent } from '../utils/oauth-button/oauth-button.component';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
    OauthButtonComponent,
    RouterModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private chefService = inject(ChefService);
  private snackBar = inject(MatSnackBar);
  private destroyRef = inject(DestroyRef);

  AuthState = AuthState;
  authState = signal(AuthState.Loading);
  selectedProvider = signal(Provider.Google);
  showUnlinkConfirmation = signal(false);
  authUrls = signal<Partial<Record<Provider, string>>>({});
  isLoading = signal(false);
  chef = this.chefService.chef;
  profileRoutes = profileRoutes;

  readonly totalRecipesFavorited = computed(
    () => this.chef()?.favoriteRecipes.length ?? 0
  );
  readonly totalRecipesViewed = computed(
    () => Object.keys(this.chef()?.recentRecipes ?? {}).length
  );
  readonly totalRecipesRated = computed(
    () => Object.keys(this.chef()?.ratings ?? {}).length
  );
  readonly linkedAccounts = computed(() => {
    // Start with all the supported providers
    const initialResult = Object.fromEntries<string[]>(
      Object.values(Provider).map((provider) => [provider, []])
    ) as Record<Provider, string[]>;
    // A chef can link 0 or more emails with a provider
    return (this.chef()?.providerData ?? []).reduce((result, providerData) => {
      if (
        Object.values(Provider).includes(providerData.providerId as Provider)
      ) {
        result[providerData.providerId as Provider].push(providerData.email);
      }

      return result;
    }, initialResult);
  });
  readonly linkedAccountEntries = computed(
    () => Object.entries(this.linkedAccounts()) as [Provider, string[]][]
  );

  ngOnInit(): void {
    // Check if the user is authenticated every time the profile tab is launched
    const token = localStorage.getItem(Constants.LocalStorage.token);

    if (token === null) {
      this.authState.set(AuthState.Unauthenticated);
    } else if (
      this.totalRecipesFavorited() > 0 ||
      this.totalRecipesViewed() > 0 ||
      this.totalRecipesRated() > 0
    ) {
      // If redirected from the login page, the chef's recipe stats still need to be fetched
      this.authState.set(AuthState.Authenticated);
    } else {
      this.chefService.getChef().subscribe({
        next: ({ emailVerified }) => {
          this.authState.set(
            emailVerified ? AuthState.Authenticated : AuthState.Unauthenticated
          );
        },
        error: (error) => {
          this.authState.set(AuthState.Unauthenticated);
          this.snackBar.open(error.message, 'Dismiss');
        },
      });
    }

    const action = this.route.snapshot.queryParamMap.get('action');

    switch (action) {
      case ProfileAction.VerifyEmail:
        this.snackBar.open('Email verified successfully!', 'Dismiss');
        break;
      case ProfileAction.ChangeEmail:
        this.snackBar.open(
          'Email updated successfully! Please sign in again.',
          'Dismiss'
        );
        break;
      case ProfileAction.ResetPassword:
        this.snackBar.open(
          'Password updated successfully! Please sign in again.',
          'Dismiss'
        );
    }

    this.chefService
      .getAuthUrls()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (authUrls) => {
          this.authUrls.set(
            Object.fromEntries(
              authUrls.map(({ providerId, authUrl }) => [providerId, authUrl])
            )
          );
        },
        error: (error) => {
          this.snackBar.open(error.message, 'Dismiss');
          this.authUrls.set({});
        },
      });
  }

  logout() {
    this.chefService.logout().subscribe();
    this.authState.set(AuthState.Unauthenticated);
  }

  changeEmail() {
    this.router.navigate([profileRoutes.updateEmail.path]);
  }

  changePassword() {
    this.router.navigate([profileRoutes.updatePassword.path], {
      state: {
        email: this.chef()?.email,
      },
    });
  }

  deleteAccount() {
    this.router.navigate([profileRoutes.deleteAccount.path], {
      state: {
        email: this.chef()?.email,
      },
    });
  }

  openUnlinkAlert(provider: Provider) {
    // Confirm before unlinking
    this.selectedProvider.set(provider);
    this.showUnlinkConfirmation.set(true);
  }
}
