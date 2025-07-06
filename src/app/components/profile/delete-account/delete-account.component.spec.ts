import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { of } from 'rxjs';

import { DeleteAccountComponent } from './delete-account.component';
import { mockChef } from 'src/app/models/profile.mock';
import { ChefService } from 'src/app/services/chef.service';
import { routes } from 'src/app/app-routing.module';

describe('DeleteAccountComponent', () => {
  let deleteAccountComponent: DeleteAccountComponent;
  let fixture: ComponentFixture<DeleteAccountComponent>;
  let rootElement: HTMLElement;
  let router: Router;
  let mockChefService: jasmine.SpyObj<ChefService>;

  beforeEach(async () => {
    mockChefService = jasmine.createSpyObj('ChefService', ['deleteChef']);

    await TestBed.configureTestingModule({
      imports: [DeleteAccountComponent],
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
    spyOn(localStorageProto, 'setItem').and.callFake(() => {});
    spyOn(localStorageProto, 'removeItem').and.callFake(() => {});

    router = TestBed.inject(Router);
    spyOnProperty(router, 'lastSuccessfulNavigation').and.returnValue({
      extras: { state: { email: mockChef.email } },
      id: 0,
      initialUrl: new UrlTree(),
      extractedUrl: new UrlTree(),
      trigger: 'imperative',
      previousNavigation: null,
      abort: () => {},
    });
    fixture = TestBed.createComponent(DeleteAccountComponent);
    deleteAccountComponent = fixture.componentInstance;
    rootElement = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(deleteAccountComponent).toBeTruthy();
    expect(rootElement.textContent).toContain('Are You Sure?');
    expect(rootElement.textContent).toContain('Username');
    expect(rootElement.textContent).toContain('Delete Account');

    const usernameField = rootElement.querySelector<HTMLInputElement>('input');
    expect(usernameField?.type).toBe('email');
    expect(usernameField?.inputMode).toBe('email');
    expect(usernameField?.autocapitalize).toBe('none');
    expect(usernameField?.autocomplete).toBe('off');
    expect(usernameField?.spellcheck).toBeFalse();
  });

  it("should disable account deletion if the username isn't provided", () => {
    const form = deleteAccountComponent.formGroup;
    form.controls.username.setValue(null);
    fixture.detectChanges();

    expect(form.valid).toBeFalse();
    expect(
      form.controls.username.hasError(
        deleteAccountComponent.formErrors.required
      )
    ).toBeTrue();

    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBeTrue();
  });

  it("should disable account deletion if the username doesn't match", () => {
    const form = deleteAccountComponent.formGroup;
    form.controls.username.setValue('mock chef');
    fixture.detectChanges();

    expect(form.valid).toBeFalse();
    expect(
      form.controls.username.hasError(
        deleteAccountComponent.formErrors.usernameMismatch
      )
    ).toBeTrue();

    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBeTrue();
  });

  it('should enable account deletion if the username matches', () => {
    const form = deleteAccountComponent.formGroup;
    form.controls.username.setValue(mockChef.email);
    fixture.detectChanges();

    expect(form.valid).toBeTrue();
    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBeFalse();

    mockChefService.deleteChef.and.returnValue(of(null));
    const navigateSpy = spyOn(router, 'navigate');
    submitButton?.click();
    fixture.detectChanges();

    expect(mockChefService.deleteChef).toHaveBeenCalledWith();
    expect(navigateSpy).toHaveBeenCalledWith([routes.profile.path]);
  });
});
