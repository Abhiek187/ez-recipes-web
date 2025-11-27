import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { vi, type MockedObject } from 'vitest';

import { ForgotPasswordComponent } from './forgot-password.component';
import { ChefService } from 'src/app/services/chef.service';
import { ChefUpdateType } from 'src/app/models/profile.model';
import { mockChefEmailResponse } from 'src/app/models/profile.mock';

describe('ForgotPasswordComponent', () => {
  let forgotPasswordComponent: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let rootElement: HTMLElement;
  let mockChefService: MockedObject<ChefService>;

  beforeEach(async () => {
    mockChefService = vi.mockObject({
      updateChef: vi.fn().mockName('ChefService.updateChef'),
    } as unknown as ChefService);

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
    expect(emailField?.autocomplete).toBe('off');

    const submitButton = rootElement.querySelector('button');
    expect(submitButton).toBeTruthy();
    expect(submitButton?.disabled).toBe(true);
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

    expect(form.valid).toBe(false);
    expect(
      form.controls.email.hasError(forgotPasswordComponent.formErrors.required)
    ).toBe(true);
    const submitButton = rootElement.querySelector('button');
    expect(submitButton?.disabled).toBe(true);
  });

  it("should show an error if the email isn't valid", () => {
    const form = forgotPasswordComponent.formGroup;
    form.controls.email.setValue('not an email');
    fixture.detectChanges();

    expect(form.valid).toBe(false);
    expect(
      form.controls.email.hasError(
        forgotPasswordComponent.formErrors.emailInvalid
      )
    ).toBe(true);
    const submitButton = rootElement.querySelector('button');
    expect(submitButton?.disabled).toBe(true);
  });

  it('should enable the submit button if all fields are valid', () => {
    const form = forgotPasswordComponent.formGroup;
    const mockEmail = 'test@example.com';
    form.controls.email.setValue(mockEmail);
    fixture.detectChanges();

    expect(form.valid).toBe(true);
    const submitButton = rootElement.querySelector('button');
    expect(submitButton?.disabled).toBe(false);

    mockChefService.updateChef.mockReturnValue(of(mockChefEmailResponse));
    submitButton?.click();
    expect(mockChefService.updateChef).toHaveBeenCalledWith({
      type: ChefUpdateType.Password,
      email: mockEmail,
    });
    expect(forgotPasswordComponent.emailSent()).toBe(true);
  });
});
