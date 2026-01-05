import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { vi, type MockedObject } from 'vitest';

import { VerifyEmailComponent } from './verify-email.component';
import { ChefService } from 'src/app/services/chef.service';
import { mockChef, mockChefEmailResponse } from 'src/app/models/profile.mock';
import { routes } from 'src/app/app-routing.module';

describe('VerifyEmailComponent', () => {
  let verifyEmailComponent: VerifyEmailComponent;
  let fixture: ComponentFixture<VerifyEmailComponent>;
  let rootElement: HTMLElement;
  let router: Router;
  let mockChefService: MockedObject<ChefService>;

  beforeEach(async () => {
    mockChefService = vi.mockObject({
      verifyEmail: vi.fn().mockName('ChefService.verifyEmail'),
      logout: vi.fn().mockName('ChefService.logout'),
    } as unknown as ChefService);

    await TestBed.configureTestingModule({
      imports: [VerifyEmailComponent],
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
    vi.spyOn(localStorageProto, 'getItem').mockReturnValue(mockChef.token);
    vi.spyOn(localStorageProto, 'setItem').mockImplementation(() => undefined);
    vi.spyOn(localStorageProto, 'removeItem').mockImplementation(
      () => undefined
    );

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(VerifyEmailComponent);
    verifyEmailComponent = fixture.componentInstance;
    rootElement = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(verifyEmailComponent).toBeTruthy();
    expect(rootElement.textContent).toContain("You're Almost There!");
    expect(rootElement.textContent).toContain(verifyEmailComponent.email());
    expect(rootElement.textContent).toContain('⚠️ We will delete accounts');
    expect(rootElement.textContent).toContain('Resend');
    expect(rootElement.textContent).toContain('Logout');
  });

  it('should re-send the verification email', () => {
    verifyEmailComponent.enableResend.set(true);
    fixture.detectChanges();

    mockChefService.verifyEmail.mockReturnValue(of(mockChefEmailResponse));
    const resendButton = rootElement
      .querySelector('.verify-email-retry')
      ?.querySelector<HTMLButtonElement>('button');
    resendButton?.click();

    expect(mockChefService.verifyEmail).toHaveBeenCalledWith();
    expect(verifyEmailComponent.enableResend()).toBe(false);
  });

  it('should logout', () => {
    mockChefService.logout.mockReturnValue(of(null));
    const navigateSpy = vi.spyOn(router, 'navigate');
    const logoutButton =
      rootElement.querySelector<HTMLButtonElement>('.logout-button');
    logoutButton?.click();
    fixture.detectChanges();

    expect(mockChefService.logout).toHaveBeenCalledWith();
    expect(navigateSpy).toHaveBeenCalledWith([routes.profile.path]);
  });
});
