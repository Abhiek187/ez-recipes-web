import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';

import { ChefService } from 'src/app/services/chef.service';

@Component({
  selector: 'app-passkey-button',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './passkey-button.component.html',
  styleUrl: './passkey-button.component.scss',
})
export class PasskeyButtonComponent {
  private chefService = inject(ChefService);
  private destroyRef = inject(DestroyRef);
  private snackBar = inject(MatSnackBar);

  readonly create = input(false);
  readonly username = input<string | null | undefined>();
  isLoading = signal(false);
  isDisabled = computed(
    () => (!this.create() && !this.username()) || this.isLoading(),
  );

  async loginWithPasskey(event: PointerEvent) {
    event.preventDefault();
    const username = this.username();

    // Check if the browser supports passkeys
    if (
      !username ||
      !(await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()) ||
      !(await PublicKeyCredential.isConditionalMediationAvailable())
    ) {
      return;
    }

    this.isLoading.set(true);
    // Request a challenge from the server
    this.chefService
      .getExistingPasskeyChallenge(username)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: async (options) => {
          this.isLoading.set(false);
          let passkeyCredential: Credential;

          // Answer the challenge
          try {
            const passkeyOptions =
              PublicKeyCredential.parseRequestOptionsFromJSON(options);
            const credential = await navigator.credentials.get({
              publicKey: passkeyOptions,
            });

            if (credential === null) {
              throw 'An unknown error occurred';
            } else {
              passkeyCredential = credential;
            }
          } catch (err) {
            const error = err as Error;
            console.error('Error logging in with passkey:', error);
            this.snackBar.open(error.message, 'Dismiss');
            return;
          }

          // Verify the response
          this.isLoading.set(true);
          this.chefService
            .validatePasskey(passkeyCredential, username)
            .pipe(
              takeUntilDestroyed(this.destroyRef),
              finalize(() => {
                this.isLoading.set(false);
              }),
            )
            .subscribe({
              next: () => {
                console.log('Success!');
              },
            });
        },
        error: (error) => {
          this.snackBar.open(error.message, 'Dismiss');
        },
      });
  }

  async createNewPasskey(event: PointerEvent) {
    event.preventDefault();

    // Check if the browser supports passkeys
    if (
      !(await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()) ||
      !(await PublicKeyCredential.isConditionalMediationAvailable())
    ) {
      return;
    }

    this.isLoading.set(true);
    // Request a challenge from the server
    this.chefService
      .getNewPasskeyChallenge()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: async (options) => {
          this.isLoading.set(false);
          let passkeyCredential: Credential;

          // Answer the challenge
          try {
            const passkeyOptions =
              PublicKeyCredential.parseCreationOptionsFromJSON(options);
            const credential = await navigator.credentials.create({
              publicKey: passkeyOptions,
            });

            if (credential === null) {
              throw 'An unknown error occurred';
            } else {
              passkeyCredential = credential;
            }
          } catch (err) {
            const error = err as Error;
            console.error('Error creating a new passkey:', error);
            this.snackBar.open(error.message, 'Dismiss');
            return;
          }

          // Verify the response
          this.isLoading.set(true);
          this.chefService
            .validatePasskey(passkeyCredential)
            .pipe(
              takeUntilDestroyed(this.destroyRef),
              finalize(() => {
                this.isLoading.set(false);
              }),
            )
            .subscribe({
              next: () => {
                console.log('Success!');
              },
              error: async (error) => {
                // Attempt to delete the passkey saved in the authenticator
                if (
                  Object.hasOwn(PublicKeyCredential, 'signalUnknownCredential')
                ) {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  await (PublicKeyCredential as any).signalUnknownCredential({
                    rpId: options.rp.id,
                    credentialId: passkeyCredential.id,
                  });
                  this.snackBar.open(
                    `${error.message}. Please try again.`,
                    'Dismiss',
                  );
                } else {
                  this.snackBar.open(
                    `${error.message}. Please delete the passkey from your device and try again.`,
                    'Dismiss',
                  );
                }
              },
            });
        },
        error: (error) => {
          this.snackBar.open(error.message, 'Dismiss');
        },
      });
  }
}
