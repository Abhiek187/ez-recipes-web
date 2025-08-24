import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { of } from 'rxjs';

import { UpdatePasswordComponent } from './update-password.component';
import { mockChef, mockChefEmailResponse } from 'src/app/models/profile.mock';
import { ChefUpdateType } from 'src/app/models/profile.model';
import { ChefService } from 'src/app/services/chef.service';
import { profileRoutes } from 'src/app/app-routing.module';

describe('UpdatePasswordComponent', () => {
  let updatePasswordComponent: UpdatePasswordComponent;
  let fixture: ComponentFixture<UpdatePasswordComponent>;
  let rootElement: HTMLElement;
  let router: Router;
  let mockChefService: jasmine.SpyObj<ChefService>;

  beforeEach(async () => {
    mockChefService = jasmine.createSpyObj('ChefService', ['updateChef']);

    await TestBed.configureTestingModule({
      imports: [UpdatePasswordComponent],
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
    spyOnProperty(router, 'lastSuccessfulNavigation').and.returnValue({
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
      'Password must be at least 8 characters long'
    );
    expect(rootElement.textContent).toContain('Submit');

    const signUpFields = rootElement.querySelector('.password-fields');
    const [passwordField, confirmPasswordField] = Array.from(
      signUpFields?.querySelectorAll<HTMLInputElement>('input') ?? []
    );

    expect(passwordField.type).toBe('password');
    expect(passwordField.autocapitalize).toBe('none');
    expect(passwordField.autocomplete).toBe('off');
    expect(passwordField.spellcheck).toBeFalse();

    expect(confirmPasswordField.type).toBe('password');
    expect(confirmPasswordField.autocapitalize).toBe('none');
    expect(confirmPasswordField.autocomplete).toBe('off');
    expect(confirmPasswordField.spellcheck).toBeFalse();

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
    const form = updatePasswordComponent.formGroup;
    form.controls.password.setValue(null);
    fixture.detectChanges();

    expect(form.valid).toBeFalse();
    expect(
      form.controls.password.hasError(
        updatePasswordComponent.formErrors.required
      )
    ).toBeTrue();

    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBeTrue();
  });

  it('should show an error if the password is too short', () => {
    const form = updatePasswordComponent.formGroup;
    form.controls.password.setValue('123');
    fixture.detectChanges();

    expect(form.valid).toBeFalse();
    expect(
      form.controls.password.hasError(
        updatePasswordComponent.formErrors.passwordMinLength
      )
    ).toBeTrue();
    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBeTrue();
  });

  it("should show an error if the passwords don't match", () => {
    const form = updatePasswordComponent.formGroup;
    form.controls.password.setValue('password1');
    form.controls.passwordConfirm.setValue('password2');
    fixture.detectChanges();

    expect(form.valid).toBeFalse();
    expect(
      form.hasError(updatePasswordComponent.formErrors.passwordMismatch)
    ).toBeTrue();
    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBeTrue();
  });

  it('should enable the submit button if the email is valid', () => {
    const form = updatePasswordComponent.formGroup;
    const mockPassword = 'password123';
    form.controls.password.setValue(mockPassword);
    form.controls.passwordConfirm.setValue(mockPassword);
    fixture.detectChanges();

    expect(form.valid).toBeTrue();
    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBeFalse();

    mockChefService.updateChef.and.returnValue(of(mockChefEmailResponse));
    const navigateSpy = spyOn(router, 'navigate');
    submitButton?.click();
    fixture.detectChanges();

    expect(mockChefService.updateChef).toHaveBeenCalledWith({
      type: ChefUpdateType.Password,
      email: mockChef.email,
      password: mockPassword,
    });
    expect(navigateSpy).toHaveBeenCalledWith([profileRoutes.login.path]);
  });
});
