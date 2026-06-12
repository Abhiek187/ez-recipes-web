import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { of } from 'rxjs';
import { type MockedObject } from 'vitest';

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
      () => undefined,
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(updatePasswordComponent).toBeTruthy();
    expect(rootElement.textContent).toContain('Change Password');
    expect(rootElement.textContent).toContain('New Password');
    expect(rootElement.textContent).toContain('Confirm Password');
    expect(rootElement.textContent).toContain(
      'Password must be at least 8 characters long',
    );
    expect(rootElement.textContent).toContain('Submit');

    const signUpFields = rootElement.querySelector('.password-fields');
    const [passwordField, confirmPasswordField] = Array.from(
      signUpFields?.querySelectorAll<HTMLInputElement>('input') ?? [],
    );

    expect(passwordField.type).toBe('password');
    expect(passwordField.autocomplete).toBe('new-password');

    expect(confirmPasswordField.type).toBe('password');
    expect(confirmPasswordField.autocomplete).toBe('new-password');

    updatePasswordComponent.showPassword.set(true);
    fixture.detectChanges();
    expect(passwordField.type).toBe('text');
    updatePasswordComponent.showPassword.set(false);
    fixture.detectChanges();
    expect(passwordField.type).toBe('password');

    updatePasswordComponent.showPasswordConfirm.set(true);
    fixture.detectChanges();
    expect(confirmPasswordField.type).toBe('text');
    updatePasswordComponent.showPasswordConfirm.set(false);
    fixture.detectChanges();
    expect(confirmPasswordField.type).toBe('password');
  });

  it("should show an error if the password isn't provided", () => {
    const updatePasswordForm = updatePasswordComponent.updatePasswordForm;
    updatePasswordForm.password().value.set('');
    fixture.detectChanges();

    expect(updatePasswordForm().invalid()).toBe(true);
    expect(
      updatePasswordForm.password().getError('required'),
    ).not.toBeUndefined();

    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBe(true);
  });

  it('should show an error if the password is too short', () => {
    const updatePasswordForm = updatePasswordComponent.updatePasswordForm;
    updatePasswordForm.password().value.set('123');
    fixture.detectChanges();

    expect(updatePasswordForm().invalid()).toBe(true);
    expect(
      updatePasswordForm.password().getError('minLength'),
    ).not.toBeUndefined();
    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBe(true);
  });

  it("should show an error if the passwords don't match", () => {
    const updatePasswordForm = updatePasswordComponent.updatePasswordForm;
    updatePasswordForm().value.set({
      password: 'password1',
      passwordConfirm: 'password2',
    });
    fixture.detectChanges();

    expect(updatePasswordForm().invalid()).toBe(true);
    expect(
      updatePasswordForm.passwordConfirm().getError('passwordMismatch'),
    ).not.toBeUndefined();
    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBe(true);
  });

  it('should enable the submit button if the email is valid', () => {
    const updatePasswordForm = updatePasswordComponent.updatePasswordForm();
    const mockPassword = 'password123';
    updatePasswordForm.value.set({
      password: mockPassword,
      passwordConfirm: mockPassword,
    });
    fixture.detectChanges();

    expect(updatePasswordForm.valid()).toBe(true);
    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBe(false);

    mockChefService.updateChef.mockReturnValue(of(mockChefEmailResponse));
    submitButton?.click();
    fixture.detectChanges();

    expect(mockChefService.updateChef).toHaveBeenCalledWith({
      type: ChefUpdateType.Password,
      email: mockChef.email,
      password: mockPassword,
    });
    expect(router.navigate).toHaveBeenCalledWith([profileRoutes.login.path]);
  });
});
