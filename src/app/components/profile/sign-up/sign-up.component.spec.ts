import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { type MockedObject } from 'vitest';

import { SignUpComponent } from './sign-up.component';
import { ChefService } from 'src/app/services/chef.service';
import {
  mockChefEmailResponse,
  mockLoginResponse,
} from 'src/app/models/profile.mock';
import { profileRoutes } from 'src/app/app-routing.module';

describe('SignUpComponent', () => {
  let signUpComponent: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let rootElement: HTMLElement;
  let router: Router;
  let mockChefService: MockedObject<ChefService>;

  beforeEach(async () => {
    mockChefService = vi.mockObject({
      createChef: vi.fn().mockName('ChefService.createChef'),
      verifyEmail: vi.fn().mockName('ChefService.verifyEmail'),
    } as unknown as ChefService);

    await TestBed.configureTestingModule({
      imports: [SignUpComponent, RouterModule.forRoot([])],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ChefService,
          useValue: mockChefService,
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(SignUpComponent);
    signUpComponent = fixture.componentInstance;
    rootElement = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(signUpComponent).toBeTruthy();
    expect(rootElement.textContent).toContain('Sign Up');
    expect(rootElement.textContent).toContain('Sign In');
    expect(rootElement.textContent).toContain('Email');
    expect(rootElement.textContent).toContain('Password');
    expect(rootElement.textContent).toContain('Confirm Password');
    expect(rootElement.textContent).toContain(
      'Password must be at least 8 characters long',
    );

    const signUpFields = rootElement.querySelector('.signup-fields');
    const [emailField, passwordField, confirmPasswordField] = Array.from(
      signUpFields?.querySelectorAll<HTMLInputElement>('input') ?? [],
    );
    expect(emailField.type).toBe('email');
    expect(emailField.inputMode).toBe('email');
    expect(emailField.autocomplete).toBe('email');

    expect(passwordField.type).toBe('password');
    expect(passwordField.autocomplete).toBe('new-password');

    expect(confirmPasswordField.type).toBe('password');
    expect(confirmPasswordField.autocomplete).toBe('new-password');

    signUpComponent.showPassword.set(true);
    fixture.detectChanges();
    expect(passwordField.type).toBe('text');
    signUpComponent.showPassword.set(false);
    fixture.detectChanges();
    expect(passwordField.type).toBe('password');

    signUpComponent.showPasswordConfirm.set(true);
    fixture.detectChanges();
    expect(confirmPasswordField.type).toBe('text');
    signUpComponent.showPasswordConfirm.set(false);
    fixture.detectChanges();
    expect(confirmPasswordField.type).toBe('password');
  });

  it("should show an error if any field isn't provided", () => {
    const signUpForm = signUpComponent.signUpForm();
    signUpForm.value.set({
      email: '',
      password: '',
      passwordConfirm: '',
    });
    fixture.detectChanges();

    expect(signUpForm.invalid()).toBe(true);
    expect(
      signUpComponent.signUpForm.email().getError('required'),
    ).not.toBeUndefined();
    expect(
      signUpComponent.signUpForm.password().getError('required'),
    ).not.toBeUndefined();
    expect(
      signUpComponent.signUpForm.passwordConfirm().getError('required'),
    ).toBeUndefined();

    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBe(true);
  });

  it("should show an error if the email isn't valid", () => {
    const signUpForm = signUpComponent.signUpForm;
    signUpForm.email().value.set('not an email');
    fixture.detectChanges();

    expect(signUpForm().invalid()).toBe(true);
    expect(
      signUpComponent.signUpForm.email().getError('email'),
    ).not.toBeUndefined();
    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBe(true);
  });

  it('should show an error if the password is too short', () => {
    const signUpForm = signUpComponent.signUpForm;
    signUpForm.password().value.set('123');
    fixture.detectChanges();

    expect(signUpForm().invalid()).toBe(true);
    expect(
      signUpComponent.signUpForm.password().getError('minLength'),
    ).not.toBeUndefined();
    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBe(true);
  });

  it("should show an error if the passwords don't match", () => {
    const signUpForm = signUpComponent.signUpForm;
    signUpForm.password().value.set('password1');
    signUpForm.passwordConfirm().value.set('password2');
    fixture.detectChanges();

    expect(signUpForm().invalid()).toBe(true);
    expect(
      signUpForm.passwordConfirm().getError('passwordMismatch'),
    ).not.toBeUndefined();
    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBe(true);
  });

  it('should enable the submit button if all fields are valid', () => {
    const signUpForm = signUpComponent.signUpForm();
    const mockEmail = 'test@example.com';
    const mockPassword = 'password123';
    signUpForm.value.set({
      email: mockEmail,
      password: mockPassword,
      passwordConfirm: mockPassword,
    });
    fixture.detectChanges();

    expect(signUpForm.valid()).toBe(true);
    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBe(false);

    mockChefService.createChef.mockReturnValue(of(mockLoginResponse(false)));
    mockChefService.verifyEmail.mockReturnValue(of(mockChefEmailResponse));
    const navigateSpy = vi.spyOn(router, 'navigate');
    submitButton?.click();
    fixture.detectChanges();

    expect(mockChefService.createChef).toHaveBeenCalledWith({
      email: mockEmail,
      password: mockPassword,
    });
    expect(mockChefService.verifyEmail).toHaveBeenCalledWith();
    expect(navigateSpy).toHaveBeenCalledWith([profileRoutes.verifyEmail.path], {
      state: { email: mockEmail },
    });
  });
});
