import { Component, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-passkey-button',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './passkey-button.component.html',
  styleUrl: './passkey-button.component.scss',
})
export class PasskeyButtonComponent {
  readonly disabled = input(false);
  isLoading = signal(false);

  async loginWithPasskey(event: PointerEvent) {
    event.preventDefault();

    // Check if the browser supports passkeys
    if (
      !(await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()) ||
      !(await PublicKeyCredential.isConditionalMediationAvailable())
    ) {
      return;
    }

    // Request a challenge from the server
    // const options = {};
    // // Answer the challenge
    // const passkeyOptions =
    //   PublicKeyCredential.parseCreationOptionsFromJSON(options);
    // const passkeyCredential = await navigator.credentials.get(passkeyOptions);
    // // Verify the response
    // const passkeyValidateResult = passkeyCredential.toJSON();
  }
}
