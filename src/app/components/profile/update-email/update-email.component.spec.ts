import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi, type MockedObject } from 'vitest';

import { UpdateEmailComponent } from './update-email.component';
import { ChefService } from 'src/app/services/chef.service';
import { mockChef, mockChefEmailResponse } from 'src/app/models/profile.mock';
import { ChefUpdateType } from 'src/app/models/profile.model';
import Constants from 'src/app/constants/constants';
import { profileRoutes } from 'src/app/app-routing.module';

describe('UpdateEmailComponent', () => {
  let updateEmailComponent: UpdateEmailComponent;
  let fixture: ComponentFixture<UpdateEmailComponent>;
  let rootElement: HTMLElement;
  let router: Router;
  let mockChefService: MockedObject<ChefService>;

  beforeEach(async () => {
    mockChefService = vi.mockObject({
      updateChef: vi.fn().mockName('ChefService.updateChef'),
    } as unknown as ChefService);

    await TestBed.configureTestingModule({
      imports: [UpdateEmailComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ChefService,
          useValue: mockChefService,
        },
      ],
    }).compileComponents();

    const localStorageProto = Object.getPrototypeOf(localStorage);
    vi.spyOn(localStorageProto, 'getItem').mockReturnValue(mockChef.token);
    vi.spyOn(localStorageProto, 'setItem').mockImplementation(() => undefined);
    vi.spyOn(localStorageProto, 'removeItem').mockImplementation(
      () => undefined
    );

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(UpdateEmailComponent);
    updateEmailComponent = fixture.componentInstance;
    rootElement = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(updateEmailComponent).toBeTruthy();
    expect(rootElement.textContent).toContain('Change Email');
    expect(rootElement.textContent).toContain('New Email');
    expect(rootElement.textContent).toContain('Submit');

    const emailField = rootElement.querySelector<HTMLInputElement>('input');
    expect(emailField?.type).toBe('email');
    expect(emailField?.inputMode).toBe('email');
    expect(emailField?.autocapitalize).toBe('none');
    expect(emailField?.autocomplete).toBe('off');
    expect(emailField?.spellcheck).toBe(false);
  });

  it("should show an error if the email isn't provided", () => {
    const form = updateEmailComponent.formGroup;
    form.controls.email.setValue(null);
    fixture.detectChanges();

    expect(form.valid).toBe(false);
    expect(
      form.controls.email.hasError(updateEmailComponent.formErrors.required)
    ).toBe(true);

    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBe(true);
  });

  it("should show an error if the email isn't valid", () => {
    const form = updateEmailComponent.formGroup;
    form.controls.email.setValue('not an email');
    fixture.detectChanges();

    expect(form.valid).toBe(false);
    expect(
      form.controls.email.hasError(updateEmailComponent.formErrors.emailInvalid)
    ).toBe(true);

    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBe(true);
  });

  it('should enable the submit button if the email is valid', () => {
    const form = updateEmailComponent.formGroup;
    const mockEmail = 'test@example.com';
    form.controls.email.setValue(mockEmail);
    fixture.detectChanges();

    expect(form.valid).toBe(true);
    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBe(false);

    mockChefService.updateChef.mockReturnValue(of(mockChefEmailResponse));
    submitButton?.click();
    fixture.detectChanges();

    expect(mockChefService.updateChef).toHaveBeenCalledWith({
      type: ChefUpdateType.Email,
      email: mockEmail,
    });
    expect(rootElement.textContent).toContain(
      `We sent an email to ${mockEmail}`
    );
  });

  it('should ask the user to login again if the credentials are too old', () => {
    const form = updateEmailComponent.formGroup;
    const mockEmail = 'test@example.com';
    form.controls.email.setValue(mockEmail);
    fixture.detectChanges();

    expect(form.valid).toBe(true);
    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBe(false);

    mockChefService.updateChef.mockReturnValue(
      throwError(() => new Error(Constants.credentialTooOldError))
    );
    const navigateSpy = vi.spyOn(router, 'navigate');
    submitButton?.click();
    fixture.detectChanges();

    expect(mockChefService.updateChef).toHaveBeenCalledWith({
      type: ChefUpdateType.Email,
      email: mockEmail,
    });
    expect(navigateSpy).toHaveBeenCalledWith([profileRoutes.login.path], {
      queryParams: { next: router.url },
      state: { stepUp: true },
    });
  });
});
