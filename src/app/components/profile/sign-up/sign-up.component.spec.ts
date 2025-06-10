import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';

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
  let mockChefService: jasmine.SpyObj<ChefService>;

  beforeEach(async () => {
    mockChefService = jasmine.createSpyObj('ChefService', [
      'createChef',
      'verifyEmail',
    ]);

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
      'Password must be at least 8 characters long'
    );

    const signUpFields = rootElement.querySelector('.signup-fields');
    const [emailField, passwordField, confirmPasswordField] = Array.from(
      signUpFields?.querySelectorAll<HTMLInputElement>('input') ?? []
    );
    expect(emailField.type).toBe('email');
    expect(emailField.inputMode).toBe('email');
    expect(emailField.autocapitalize).toBe('none');
    expect(emailField.autocomplete).toBe('off');
    expect(emailField.spellcheck).toBeFalse();

    expect(passwordField.type).toBe('password');
    expect(passwordField.autocapitalize).toBe('none');
    expect(passwordField.autocomplete).toBe('off');
    expect(passwordField.spellcheck).toBeFalse();

    expect(confirmPasswordField.type).toBe('password');
    expect(confirmPasswordField.autocapitalize).toBe('none');
    expect(confirmPasswordField.autocomplete).toBe('off');
    expect(confirmPasswordField.spellcheck).toBeFalse();

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
    const form = signUpComponent.formGroup;
    form.controls.email.setValue(null);
    form.controls.password.setValue(null);
    form.controls.passwordConfirm.setValue(null);
    fixture.detectChanges();

    expect(form.valid).toBeFalse();
    expect(
      form.controls.email.hasError(signUpComponent.formErrors.required)
    ).toBeTrue();
    expect(
      form.controls.password.hasError(signUpComponent.formErrors.required)
    ).toBeTrue();
    expect(
      form.controls.passwordConfirm.hasError(
        signUpComponent.formErrors.required
      )
    ).toBeFalse();

    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBeTrue();
  });

  it("should show an error if the email isn't valid", () => {
    const form = signUpComponent.formGroup;
    form.controls.email.setValue('not an email');
    fixture.detectChanges();

    expect(form.valid).toBeFalse();
    expect(
      form.controls.email.hasError(signUpComponent.formErrors.emailInvalid)
    ).toBeTrue();
    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBeTrue();
  });

  it('should show an error if the password is too short', () => {
    const form = signUpComponent.formGroup;
    form.controls.password.setValue('123');
    fixture.detectChanges();

    expect(form.valid).toBeFalse();
    expect(
      form.controls.password.hasError(
        signUpComponent.formErrors.passwordMinLength
      )
    ).toBeTrue();
    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBeTrue();
  });

  it("should show an error if the passwords don't match", () => {
    const form = signUpComponent.formGroup;
    form.controls.password.setValue('password1');
    form.controls.passwordConfirm.setValue('password2');
    fixture.detectChanges();

    expect(form.valid).toBeFalse();
    expect(
      form.hasError(signUpComponent.formErrors.passwordMismatch)
    ).toBeTrue();
    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBeTrue();
  });

  it('should enable the submit button if all fields are valid', () => {
    const form = signUpComponent.formGroup;
    const mockEmail = 'test@example.com';
    const mockPassword = 'password123';
    form.controls.email.setValue(mockEmail);
    form.controls.password.setValue(mockPassword);
    form.controls.passwordConfirm.setValue(mockPassword);
    fixture.detectChanges();

    expect(form.valid).toBeTrue();
    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBeFalse();

    mockChefService.createChef.and.returnValue(of(mockLoginResponse(false)));
    mockChefService.verifyEmail.and.returnValue(of(mockChefEmailResponse));
    const navigateSpy = spyOn(router, 'navigate');
    submitButton?.click();
    fixture.detectChanges();

    expect(mockChefService.createChef).toHaveBeenCalledWith({
      email: mockEmail,
      password: mockPassword,
    });
    expect(mockChefService.verifyEmail).toHaveBeenCalledWith(
      mockLoginResponse(false).token
    );
    expect(navigateSpy).toHaveBeenCalledWith([profileRoutes.verifyEmail.path]);
  });
});
