import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';

import { LoginComponent } from './login.component';
import { ChefService } from 'src/app/services/chef.service';
import {
  mockChefEmailResponse,
  mockLoginResponse,
} from 'src/app/models/profile.mock';
import { profileRoutes } from 'src/app/app-routing.module';

describe('LoginComponent', () => {
  let loginComponent: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let rootElement: HTMLElement;
  let router: Router;
  let mockChefService: jasmine.SpyObj<ChefService>;

  beforeEach(async () => {
    mockChefService = jasmine.createSpyObj('ChefService', [
      'login',
      'verifyEmail',
    ]);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterModule.forRoot([])],
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
    fixture = TestBed.createComponent(LoginComponent);
    loginComponent = fixture.componentInstance;
    rootElement = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(loginComponent).toBeTruthy();
    expect(rootElement.textContent).toContain('Login');
    expect(rootElement.textContent).toContain('Sign Up');
    expect(rootElement.textContent).toContain('Username');
    expect(rootElement.textContent).toContain('Password');
    expect(rootElement.textContent).toContain('Forgot Password?');

    const loginFields = rootElement.querySelector('.login-fields');
    const [usernameField, passwordField] = Array.from(
      loginFields?.querySelectorAll<HTMLInputElement>('input') ?? []
    );
    expect(usernameField.type).toBe('email');
    expect(usernameField.inputMode).toBe('email');
    expect(usernameField.autocapitalize).toBe('none');
    expect(usernameField.autocomplete).toBe('off');
    expect(usernameField.spellcheck).toBeFalse();

    expect(passwordField.type).toBe('password');
    expect(passwordField.autocapitalize).toBe('none');
    expect(passwordField.autocomplete).toBe('off');
    expect(passwordField.spellcheck).toBeFalse();

    loginComponent.showPassword.set(true);
    fixture.detectChanges();
    expect(passwordField.type).toBe('text');
    loginComponent.showPassword.set(false);
    fixture.detectChanges();
    expect(passwordField.type).toBe('password');
  });

  it("should show an error if the username or password isn't provided", () => {
    const form = loginComponent.formGroup;
    form.controls.username.setValue(null);
    form.controls.password.setValue(null);
    fixture.detectChanges();

    expect(form.valid).toBeFalse();
    expect(form.controls.username.hasError('required')).toBeTrue();
    expect(form.controls.password.hasError('required')).toBeTrue();

    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBeTrue();
  });

  it('should enable the submit button if all fields are valid', () => {
    const form = loginComponent.formGroup;
    const mockEmail = 'test@example.com';
    const mockPassword = 'password123';
    form.controls.username.setValue(mockEmail);
    form.controls.password.setValue(mockPassword);
    fixture.detectChanges();

    expect(form.valid).toBeTrue();
    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBeFalse();

    mockChefService.login.and.returnValue(of(mockLoginResponse(false)));
    mockChefService.verifyEmail.and.returnValue(of(mockChefEmailResponse));
    const navigateSpy = spyOn(router, 'navigate');
    submitButton?.click();
    fixture.detectChanges();

    expect(mockChefService.login).toHaveBeenCalledWith({
      email: mockEmail,
      password: mockPassword,
    });
    expect(mockChefService.verifyEmail).toHaveBeenCalledWith(
      mockLoginResponse(false).token
    );
    expect(navigateSpy).toHaveBeenCalledWith([profileRoutes.verifyEmail.path], {
      state: { email: mockEmail },
    });
  });
});
