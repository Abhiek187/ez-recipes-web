import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { PasskeyButtonComponent } from './passkey-button.component';
import { ChefService } from 'src/app/services/chef.service';
import {
  mockChef,
  mockPasskeyCreationOptions,
  mockPasskeyRequestOptions,
} from 'src/app/models/profile.mock';
import { Chef } from 'src/app/models/profile.model';

describe('PasskeyButtonComponent', () => {
  let component: PasskeyButtonComponent;
  let fixture: ComponentFixture<PasskeyButtonComponent>;
  let rootElement: HTMLElement;
  let emittedChef: Chef;

  const mockGetNewPasskeyChallenge = vi
    .fn()
    .mockReturnValue(of(mockPasskeyCreationOptions));
  const mockGetExistingPasskeyChallenge = vi
    .fn()
    .mockReturnValue(of(mockPasskeyRequestOptions));
  const mockValidatePasskey = vi.fn().mockReturnValue(of(mockChef));
  const mockChefService = {
    getNewPasskeyChallenge: mockGetNewPasskeyChallenge,
    getExistingPasskeyChallenge: mockGetExistingPasskeyChallenge,
    validatePasskey: mockValidatePasskey,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasskeyButtonComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ChefService,
          useValue: mockChefService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasskeyButtonComponent);
    component = fixture.componentInstance;
    rootElement = fixture.nativeElement;
    component.success.subscribe((chef) => {
      emittedChef = chef;
    });
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create a new passkey', async () => {
    expect(component).toBeTruthy();
    fixture.componentRef.setInput('create', true);
    fixture.detectChanges();

    const passkeyButton =
      rootElement.querySelector<HTMLButtonElement>('.passkey-button');
    expect(passkeyButton?.disabled).toBe(false);
    expect(passkeyButton?.textContent).toContain('Create a passkey');

    // Calling click causes flaky tests due to the async handler
    await component.createNewPasskey(new PointerEvent('click'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(emittedChef).toEqual(mockChef);
  });

  it('should login with an existing passkey', async () => {
    fixture.componentRef.setInput('create', false);
    fixture.componentRef.setInput('username', null);
    fixture.detectChanges();

    const passkeyButton =
      rootElement.querySelector<HTMLButtonElement>('.passkey-button');
    expect(passkeyButton?.disabled).toBe(true);
    expect(passkeyButton?.textContent).toContain('Sign in with a passkey');
    expect(rootElement.textContent).toContain('Username is required');

    fixture.componentRef.setInput('username', 'test@example.com');
    fixture.detectChanges();
    expect(passkeyButton?.disabled).toBe(false);

    await component.loginWithPasskey(new PointerEvent('click'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(emittedChef).toEqual(mockChef);
  });
});
