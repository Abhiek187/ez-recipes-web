import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';

import { ForgotPasswordComponent } from './forgot-password.component';
import { ChefService } from 'src/app/services/chef.service';
import { ChefUpdateType } from 'src/app/models/profile.model';
import { mockChefEmailResponse } from 'src/app/models/profile.mock';

describe('ForgotPasswordComponent', () => {
  let forgotPasswordComponent: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let rootElement: HTMLElement;
  let mockChefService: jasmine.SpyObj<ChefService>;

  beforeEach(async () => {
    mockChefService = jasmine.createSpyObj('ChefService', ['updateChef']);

    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent, RouterModule.forRoot([])],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ChefService,
          useValue: mockChefService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    forgotPasswordComponent = fixture.componentInstance;
    rootElement = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should ask for an email initially', () => {
    expect(forgotPasswordComponent).toBeTruthy();
    expect(rootElement.textContent).toContain('No problem!');

    const emailField = rootElement.querySelector<HTMLInputElement>('input');
    expect(emailField).toBeTruthy();
    expect(emailField?.type).toBe('email');
    expect(emailField?.inputMode).toBe('email');
    expect(emailField?.autocapitalize).toBe('none');
    expect(emailField?.autocomplete).toBe('off');
    expect(emailField?.spellcheck).toBeFalse();

    const submitButton = rootElement.querySelector('button');
    expect(submitButton).toBeTruthy();
    expect(submitButton?.disabled).toBeTrue();
  });

  it('should show that an email was sent', () => {
    forgotPasswordComponent.emailSent.set(true);
    fixture.detectChanges();

    expect(rootElement.textContent).toContain('We sent an email to');
  });

  it("should show an error if the email isn't provided", () => {
    const form = forgotPasswordComponent.formGroup;
    form.controls.email.setValue(null);
    fixture.detectChanges();

    expect(form.valid).toBeFalse();
    expect(
      form.controls.email.hasError(forgotPasswordComponent.formErrors.required)
    ).toBeTrue();
    const submitButton = rootElement.querySelector('button');
    expect(submitButton?.disabled).toBeTrue();
  });

  it("should show an error if the email isn't valid", () => {
    const form = forgotPasswordComponent.formGroup;
    form.controls.email.setValue('not an email');
    fixture.detectChanges();

    expect(form.valid).toBeFalse();
    expect(
      form.controls.email.hasError(
        forgotPasswordComponent.formErrors.emailInvalid
      )
    ).toBeTrue();
    const submitButton = rootElement.querySelector('button');
    expect(submitButton?.disabled).toBeTrue();
  });

  it('should enable the submit button if all fields are valid', () => {
    const form = forgotPasswordComponent.formGroup;
    const mockEmail = 'test@example.com';
    form.controls.email.setValue(mockEmail);
    fixture.detectChanges();

    expect(form.valid).toBeTrue();
    const submitButton = rootElement.querySelector('button');
    expect(submitButton?.disabled).toBeFalse();

    mockChefService.updateChef.and.returnValue(of(mockChefEmailResponse));
    submitButton?.click();
    expect(mockChefService.updateChef).toHaveBeenCalledWith({
      type: ChefUpdateType.Password,
      email: mockEmail,
    });
    expect(forgotPasswordComponent.emailSent()).toBeTrue();
  });
});
