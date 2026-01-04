import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { of } from 'rxjs';
import { vi, type MockedObject } from 'vitest';

import { UpdatePasswordComponent } from './update-password.component';
import { mockChef, mockChefEmailResponse } from 'src/app/models/profile.mock';
import { ChefUpdateType } from 'src/app/models/profile.model';
import { ChefService } from 'src/app/services/chef.service';
import { profileRoutes } from 'src/app/app-routing.module';

describe('UpdatePasswordComponent', () => {
  let updatePasswordComponent: UpdatePasswordComponent;
  let fixture: ComponentFixture<UpdatePasswordComponent>;
  let rootElement: HTMLElement;
  let router: MockedObject<Router>;
  let mockChefService: MockedObject<ChefService>;

  beforeEach(async () => {
    mockChefService = vi.mockObject({
      updateChef: vi.fn().mockName('ChefService.updateChef'),
    } as unknown as ChefService);
    router = vi.mockObject({
      lastSuccessfulNavigation: vi
        .fn()
        .mockName('Router.lastSuccessfulNavigation'),
      navigate: vi.fn().mockName('Router.navigate'),
    } as unknown as Router);

    await TestBed.configureTestingModule({
      imports: [UpdatePasswordComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ChefService,
          useValue: mockChefService,
        },
        {
          provide: Router,
          useValue: router,
        },
      ],
    }).compileComponents();

    const localStorageProto = Object.getPrototypeOf(localStorage);
    vi.spyOn(localStorageProto, 'getItem').mockReturnValue(mockChef.token);
    vi.spyOn(localStorageProto, 'setItem').mockImplementation(() => undefined);
    vi.spyOn(localStorageProto, 'removeItem').mockImplementation(
      () => undefined
    );

    router.lastSuccessfulNavigation.mockReturnValue({
      extras: { state: { email: mockChef.email } },
      id: 0,
      initialUrl: new UrlTree(),
      extractedUrl: new UrlTree(),
      trigger: 'imperative',
      previousNavigation: null,
      abort: () => undefined,
    });
    fixture = TestBed.createComponent(UpdatePasswordComponent);
    updatePasswordComponent = fixture.componentInstance;
    rootElement = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('should create', async () => {
    expect(updatePasswordComponent).toBeTruthy();
    expect(rootElement.textContent).toContain('Change Password');
    expect(rootElement.textContent).toContain('New Password');
    expect(rootElement.textContent).toContain('Confirm Password');
    expect(rootElement.textContent).toContain(
      'Password must be at least 8 characters long'
    );
    expect(rootElement.textContent).toContain('Submit');

    const signUpFields = rootElement.querySelector('.password-fields');
    const [passwordField, confirmPasswordField] = Array.from(
      signUpFields?.querySelectorAll<HTMLInputElement>('input') ?? []
    );

    expect(passwordField.type).toBe('password');
    expect(passwordField.autocomplete).toBe('off');

    expect(confirmPasswordField.type).toBe('password');
    expect(confirmPasswordField.autocomplete).toBe('off');

    updatePasswordComponent.showPassword.set(true);
    await fixture.whenStable();
    expect(passwordField.type).toBe('text');
    updatePasswordComponent.showPassword.set(false);
    await fixture.whenStable();
    expect(passwordField.type).toBe('password');

    updatePasswordComponent.showPasswordConfirm.set(true);
    await fixture.whenStable();
    expect(confirmPasswordField.type).toBe('text');
    updatePasswordComponent.showPasswordConfirm.set(false);
    await fixture.whenStable();
    expect(confirmPasswordField.type).toBe('password');
  });

  it("should show an error if the password isn't provided", async () => {
    const form = updatePasswordComponent.formGroup;
    form.controls.password.setValue(null);
    await fixture.whenStable();

    expect(form.valid).toBe(false);
    expect(
      form.controls.password.hasError(
        updatePasswordComponent.formErrors.required
      )
    ).toBe(true);

    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBe(true);
  });

  it('should show an error if the password is too short', async () => {
    const form = updatePasswordComponent.formGroup;
    form.controls.password.setValue('123');
    await fixture.whenStable();

    expect(form.valid).toBe(false);
    expect(
      form.controls.password.hasError(
        updatePasswordComponent.formErrors.passwordMinLength
      )
    ).toBe(true);
    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBe(true);
  });

  it("should show an error if the passwords don't match", async () => {
    const form = updatePasswordComponent.formGroup;
    form.controls.password.setValue('password1');
    form.controls.passwordConfirm.setValue('password2');
    await fixture.whenStable();

    expect(form.valid).toBe(false);
    expect(
      form.hasError(updatePasswordComponent.formErrors.passwordMismatch)
    ).toBe(true);
    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBe(true);
  });

  it('should enable the submit button if the email is valid', async () => {
    const form = updatePasswordComponent.formGroup;
    const mockPassword = 'password123';
    form.controls.password.setValue(mockPassword);
    form.controls.passwordConfirm.setValue(mockPassword);
    await fixture.whenStable();

    expect(form.valid).toBe(true);
    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBe(false);

    mockChefService.updateChef.mockReturnValue(of(mockChefEmailResponse));
    submitButton?.click();
    await fixture.whenStable();

    expect(mockChefService.updateChef).toHaveBeenCalledWith({
      type: ChefUpdateType.Password,
      email: mockChef.email,
      password: mockPassword,
    });
    expect(router.navigate).toHaveBeenCalledWith([profileRoutes.login.path]);
  });
});
