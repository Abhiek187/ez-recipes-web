import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

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
  let mockChefService: jasmine.SpyObj<ChefService>;

  beforeEach(async () => {
    mockChefService = jasmine.createSpyObj('ChefService', ['updateChef']);

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
    spyOn(localStorageProto, 'getItem').and.returnValue(mockChef.token);
    spyOn(localStorageProto, 'setItem').and.callFake(() => undefined);
    spyOn(localStorageProto, 'removeItem').and.callFake(() => undefined);

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
    expect(emailField?.spellcheck).toBeFalse();
  });

  it("should show an error if the email isn't provided", () => {
    const form = updateEmailComponent.formGroup;
    form.controls.email.setValue(null);
    fixture.detectChanges();

    expect(form.valid).toBeFalse();
    expect(
      form.controls.email.hasError(updateEmailComponent.formErrors.required)
    ).toBeTrue();

    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBeTrue();
  });

  it("should show an error if the email isn't valid", () => {
    const form = updateEmailComponent.formGroup;
    form.controls.email.setValue('not an email');
    fixture.detectChanges();

    expect(form.valid).toBeFalse();
    expect(
      form.controls.email.hasError(updateEmailComponent.formErrors.emailInvalid)
    ).toBeTrue();

    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBeTrue();
  });

  it('should enable the submit button if the email is valid', () => {
    const form = updateEmailComponent.formGroup;
    const mockEmail = 'test@example.com';
    form.controls.email.setValue(mockEmail);
    fixture.detectChanges();

    expect(form.valid).toBeTrue();
    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBeFalse();

    mockChefService.updateChef.and.returnValue(of(mockChefEmailResponse));
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

    expect(form.valid).toBeTrue();
    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBeFalse();

    mockChefService.updateChef.and.returnValue(
      throwError(() => new Error(Constants.credentialTooOldError))
    );
    const navigateSpy = spyOn(router, 'navigate');
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
