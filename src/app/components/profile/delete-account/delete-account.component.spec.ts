import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { of } from 'rxjs';
import { vi, type MockedObject } from 'vitest';

import { DeleteAccountComponent } from './delete-account.component';
import { mockChef } from 'src/app/models/profile.mock';
import { ChefService } from 'src/app/services/chef.service';
import { routes } from 'src/app/app-routing.module';

describe('DeleteAccountComponent', () => {
  let deleteAccountComponent: DeleteAccountComponent;
  let fixture: ComponentFixture<DeleteAccountComponent>;
  let rootElement: HTMLElement;
  let router: MockedObject<Router>;
  let mockChefService: MockedObject<ChefService>;

  beforeEach(async () => {
    mockChefService = vi.mockObject({
      deleteChef: vi.fn().mockName('ChefService.deleteChef'),
    } as unknown as ChefService);
    router = vi.mockObject({
      lastSuccessfulNavigation: vi
        .fn()
        .mockName('Router.lastSuccessfulNavigation'),
      navigate: vi.fn().mockName('Router.navigate'),
    } as unknown as Router);

    await TestBed.configureTestingModule({
      imports: [DeleteAccountComponent],
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
    expect(usernameField?.autocomplete).toBe('off');
  });

  it("should disable account deletion if the username isn't provided", () => {
    const form = deleteAccountComponent.formGroup;
    form.controls.username.setValue(null);
    fixture.detectChanges();

    expect(form.valid).toBe(false);
    expect(
      form.controls.username.hasError(
        deleteAccountComponent.formErrors.required
      )
    ).toBe(true);

    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBe(true);
  });

  it("should disable account deletion if the username doesn't match", () => {
    const form = deleteAccountComponent.formGroup;
    form.controls.username.setValue('mock chef');
    fixture.detectChanges();

    expect(form.valid).toBe(false);
    expect(
      form.controls.username.hasError(
        deleteAccountComponent.formErrors.usernameMismatch
      )
    ).toBe(true);

    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBe(true);
  });

  it('should enable account deletion if the username matches', () => {
    const form = deleteAccountComponent.formGroup;
    form.controls.username.setValue(mockChef.email);
    fixture.detectChanges();

    expect(form.valid).toBe(true);
    const submitButton = rootElement
      .querySelector('.submit-row')
      ?.querySelector('button');
    expect(submitButton?.disabled).toBe(false);

    mockChefService.deleteChef.mockReturnValue(of(null));
    submitButton?.click();
    fixture.detectChanges();

    expect(mockChefService.deleteChef).toHaveBeenCalledWith();
    expect(router.navigate).toHaveBeenCalledWith([routes.profile.path]);
  });
});
