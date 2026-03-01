import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';

import Constants from 'src/app/constants/constants';
import { Chef } from 'src/app/models/profile.model';
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
  readonly success = output<Chef>();
  isLoading = signal(false);
  isDisabled = computed(
    () => (!this.create() && !this.username()) || this.isLoading(),
  );

  private async isPasskeySupported(): Promise<boolean> {
    return (
      (await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()) &&
      (await PublicKeyCredential.isConditionalMediationAvailable())
    );
  }

  async loginWithPasskey(event: PointerEvent) {
    event.preventDefault();
    const username = this.username();

    // Check if the browser supports passkeys
    if (!username || !(await this.isPasskeySupported())) {
      this.snackBar.open(Constants.passkeyUnsupported, 'Dismiss');
      return;
    }

    this.isLoading.set(true);

    try {
      // Request a challenge from the server
      const options = await firstValueFrom(
        this.chefService.getExistingPasskeyChallenge(username),
      );

      // Answer the challenge
      const passkeyOptions =
        PublicKeyCredential.parseRequestOptionsFromJSON(options);

      const credential = await navigator.credentials.get({
        publicKey: passkeyOptions,
      });
      if (credential === null) throw new Error('Unable to get a passkey.');

      // Verify the response
      const chef = await firstValueFrom(
        this.chefService.validatePasskey(credential, username),
      );
      this.success.emit(chef);
    } catch (err) {
      const error = err as Error;
      console.error('Error logging in with passkey:', error);
      this.snackBar.open(error.message, 'Dismiss');
    } finally {
      this.isLoading.set(false);
    }
  }

  async createNewPasskey(event: PointerEvent) {
    event.preventDefault();

    // Check if the browser supports passkeys
    if (!(await this.isPasskeySupported())) {
      this.snackBar.open(Constants.passkeyUnsupported, 'Dismiss');
      return;
    }

    this.isLoading.set(true);

    let passkeyCredential: Credential | null = null;
    let options: PublicKeyCredentialCreationOptionsJSON | null = null;

    try {
      // Request a challenge from the server
      options = await firstValueFrom(this.chefService.getNewPasskeyChallenge());

      // Answer the challenge
      const passkeyOptions =
        PublicKeyCredential.parseCreationOptionsFromJSON(options);

      passkeyCredential = await navigator.credentials.create({
        publicKey: passkeyOptions,
      });
      if (passkeyCredential === null)
        throw new Error('Unable to create a passkey');

      // Verify the response
      const chef = await firstValueFrom(
        this.chefService.validatePasskey(passkeyCredential),
      );

      this.success.emit(chef);
    } catch (err) {
      const error = err as Error;
      console.error('Error creating a new passkey:', error);

      // Attempt to delete the passkey saved in the authenticator
      if (
        passkeyCredential !== null &&
        options !== null &&
        Object.hasOwn(PublicKeyCredential, 'signalUnknownCredential')
      ) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (PublicKeyCredential as any).signalUnknownCredential({
            rpId: options.rp.id,
            credentialId: passkeyCredential.id,
          });
        } catch {
          // Swallow cleanup error
        }

        this.snackBar.open(`${error.message}. Please try again.`, 'Dismiss');
      } else {
        this.snackBar.open(
          `${error.message}. Please delete the passkey from your device and try again.`,
          'Dismiss',
        );
      }
    } finally {
      this.isLoading.set(false);
    }
  }
}
