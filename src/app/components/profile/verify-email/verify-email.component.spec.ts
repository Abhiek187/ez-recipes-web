import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { VerifyEmailComponent } from './verify-email.component';
import { ChefService } from 'src/app/services/chef.service';
import { mockChef, mockChefEmailResponse } from 'src/app/models/profile.mock';
import { routes } from 'src/app/app-routing.module';

describe('VerifyEmailComponent', () => {
  let verifyEmailComponent: VerifyEmailComponent;
  let fixture: ComponentFixture<VerifyEmailComponent>;
  let rootElement: HTMLElement;
  let router: Router;
  let mockChefService: jasmine.SpyObj<ChefService>;

  beforeEach(async () => {
    mockChefService = jasmine.createSpyObj('ChefService', [
      'verifyEmail',
      'logout',
    ]);

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
    spyOn(localStorageProto, 'getItem').and.returnValue(mockChef.token);
    spyOn(localStorageProto, 'setItem').and.callFake(() => undefined);
    spyOn(localStorageProto, 'removeItem').and.callFake(() => undefined);

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

    mockChefService.verifyEmail.and.returnValue(of(mockChefEmailResponse));
    const resendButton = rootElement
      .querySelector('.verify-email-retry')
      ?.querySelector<HTMLButtonElement>('button');
    resendButton?.click();

    expect(mockChefService.verifyEmail).toHaveBeenCalledWith();
    expect(verifyEmailComponent.enableResend()).toBeFalse();
  });

  it('should logout', () => {
    mockChefService.logout.and.returnValue(of(null));
    const navigateSpy = spyOn(router, 'navigate');
    const logoutButton =
      rootElement.querySelector<HTMLButtonElement>('.logout-button');
    logoutButton?.click();
    fixture.detectChanges();

    expect(mockChefService.logout).toHaveBeenCalledWith();
    expect(navigateSpy).toHaveBeenCalledWith([routes.profile.path]);
  });
});
