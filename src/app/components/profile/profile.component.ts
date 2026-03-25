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
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import {
  AuthState,
  Chef,
  Passkey,
  ProfileAction,
  Provider,
} from 'src/app/models/profile.model';
import { profileRoutes } from 'src/app/app-routing.module';
import Constants from 'src/app/constants/constants';
import { ChefService } from 'src/app/services/chef.service';
import { OauthButtonComponent } from '../utils/oauth-button/oauth-button.component';
import { DialogComponent, DialogData } from '../utils/dialog/dialog.component';
import Theme from 'src/app/models/theme.model';
import { PasskeyButtonComponent } from '../utils/passkey-button/passkey-button.component';
import { base64URLEncode } from 'src/app/helpers/string';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
    OauthButtonComponent,
    PasskeyButtonComponent,
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
  private dialog = inject(MatDialog);

  AuthState = AuthState;
  authState = signal(AuthState.Loading);
  selectedProvider = signal(Provider.Google);
  authUrls = signal<Partial<Record<Provider, string>>>({});
  isLoading = signal(false);
  isDarkMode = signal(
    localStorage.getItem(Constants.LocalStorage.theme) === null
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : localStorage.getItem(Constants.LocalStorage.theme) === Theme.Dark,
  );
  chef = this.chefService.chef;
  profileRoutes = profileRoutes;

  readonly totalRecipesFavorited = computed(
    () => this.chef()?.favoriteRecipes.length ?? 0,
  );
  readonly totalRecipesViewed = computed(
    () => Object.keys(this.chef()?.recentRecipes ?? {}).length,
  );
  readonly totalRecipesRated = computed(
    () => Object.keys(this.chef()?.ratings ?? {}).length,
  );
  readonly linkedAccounts = computed(() => {
    // Start with all the supported providers
    const initialResult = Object.fromEntries<string[]>(
      Object.values(Provider).map((provider) => [provider, []]),
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
    () => Object.entries(this.linkedAccounts()) as [Provider, string[]][],
  );
  readonly passkeys = computed(() => this.chef()?.passkeys ?? []);

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
        next: (chef) => {
          this.authState.set(
            chef.emailVerified
              ? AuthState.Authenticated
              : AuthState.Unauthenticated,
          );
          this.syncPasskeys(chef);
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
          'Dismiss',
        );
        break;
      case ProfileAction.ResetPassword:
        this.snackBar.open(
          'Password updated successfully! Please sign in again.',
          'Dismiss',
        );
    }

    this.chefService
      .getAuthUrls()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (authUrls) => {
          this.authUrls.set(
            Object.fromEntries(
              authUrls.map(({ providerId, authUrl }) => [providerId, authUrl]),
            ),
          );
        },
        error: (error) => {
          this.snackBar.open(error.message, 'Dismiss');
          this.authUrls.set({});
        },
      });
  }

  async syncPasskeys(chef: Chef) {
    // Sync passkeys and the username with all authenticators
    try {
      if (Object.hasOwn(PublicKeyCredential, 'signalAllAcceptedCredentials')) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (PublicKeyCredential as any).signalAllAcceptedCredentials({
          rpId: location.hostname,
          userId: base64URLEncode(chef.uid),
          allAcceptedCredentialIds: chef.passkeys.map(
            (passkey) => passkey.id, // the passkey IDs are already base64 URL-encoded
          ),
        });
        console.log(
          `Signaled all authenticators to sync ${chef.passkeys.length} ${
            chef.passkeys.length === 1 ? 'passkey' : 'passkeys'
          } for user ${chef.uid} and RP ID ${location.hostname}: [${chef.passkeys
            .map((passkey) => passkey.id)
            .join(', ')}]`,
        );
      }
      if (Object.hasOwn(PublicKeyCredential, 'signalCurrentUserDetails')) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (PublicKeyCredential as any).signalCurrentUserDetails({
          rpId: location.hostname,
          userId: base64URLEncode(chef.uid),
          name: chef.email,
          displayName: '',
        });
        console.log(
          `Signaled all authenticators to set the username for user ID ${chef.uid} and RP ID ${
            location.hostname
          } to ${chef.email}`,
        );
      }
    } catch (error: unknown) {
      console.warn('Passkey signal error:', error);
    }
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

  onLinkSuccess() {
    this.snackBar.open(
      `Successfully linked ${this.selectedProvider()}!`,
      'Dismiss',
    );
  }

  onPasskeyCreateSuccess() {
    this.snackBar.open('Passkey created successfully', 'Dismiss');
  }

  openUnlinkAlert(provider: Provider) {
    // Confirm before unlinking
    const dialogRef = this.dialog.open<DialogComponent, DialogData>(
      DialogComponent,
      {
        data: {
          message: `Are you sure you want to unlink ${provider}?`,
          dismissText: 'No',
          confirmText: 'Yes',
          isConfirmDestructive: true,
        },
      },
    );

    dialogRef.afterClosed().subscribe((didConfirm: boolean) => {
      if (!didConfirm) return;
      this.isLoading.set(true);
      this.selectedProvider.set(provider);

      this.chefService
        .unlinkOAuthProvider(provider)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => {
            this.isLoading.set(false);
          }),
        )
        .subscribe({
          next: () => {
            this.snackBar.open(`Successfully unlinked ${provider}!`, 'Dismiss');
          },
          error: (error) => {
            this.snackBar.open(error.message, 'Dismiss');
          },
        });
    });
  }

  deletePasskey(passkey: Passkey) {
    // Confirm before deleting a passkey
    const dialogRef = this.dialog.open<DialogComponent, DialogData>(
      DialogComponent,
      {
        data: {
          message: `Are you sure you want to delete this passkey? ${passkey.name}`,
          dismissText: 'No',
          confirmText: 'Yes',
          isConfirmDestructive: true,
        },
      },
    );

    dialogRef.afterClosed().subscribe((didConfirm: boolean) => {
      if (!didConfirm) return;
      this.isLoading.set(true);

      this.chefService
        .deletePasskey(passkey.id)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => {
            this.isLoading.set(false);
          }),
        )
        .subscribe({
          next: async () => {
            // Signal all authenticators to delete the passkey
            if (Object.hasOwn(PublicKeyCredential, 'signalUnknownCredential')) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              await (PublicKeyCredential as any).signalUnknownCredential({
                rpId: location.hostname,
                credentialId: passkey.id,
              });
              this.snackBar.open('Passkey deleted successfully', 'Dismiss');
            } else {
              this.snackBar.open(
                'Passkey deleted successfully. Make sure to also delete the passkey from your device.',
                'Dismiss',
              );
            }
          },
          error: (error) => {
            this.snackBar.open(error.message, 'Dismiss');
          },
        });
    });
  }
}
