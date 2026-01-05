import { Location } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router, RouterLink } from '@angular/router';
import { it, vi } from 'vitest';

import { ProfileComponent } from './profile.component';
import { AuthState } from 'src/app/models/profile.model';
import { profileRoutes, routes } from 'src/app/app-routing.module';
import { mockChef } from 'src/app/models/profile.mock';

describe('ProfileComponent', () => {
  let profileComponent: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let rootElement: HTMLElement;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([
          {
            ...routes.profile,
            children: [{ ...profileRoutes.login, path: 'login' }],
          },
        ]),
      ],
    }).compileComponents();

    const localStorageProto = Object.getPrototypeOf(localStorage);
    vi.spyOn(localStorageProto, 'getItem').mockReturnValue(null);
    vi.spyOn(localStorageProto, 'setItem').mockImplementation(() => undefined);
    vi.spyOn(localStorageProto, 'removeItem').mockImplementation(
      () => undefined
    );

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(ProfileComponent);
    profileComponent = fixture.componentInstance;
    rootElement = fixture.nativeElement;
    router.initialNavigation();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(profileComponent).toBeTruthy();
  });

  it('should show a loading message when the auth state is loading', async () => {
    profileComponent.authState.set(AuthState.Loading);
    fixture.detectChanges();

    expect(rootElement.textContent).toContain('Getting your profile ready… 🧑‍🍳');
  });

  it.skip("should show the login button if the user isn't authenticated", async () => {
    expect(profileComponent.authState()).toBe(AuthState.Unauthenticated);

    expect(rootElement.textContent).toContain(
      'Signing up for an account is free'
    );
    const loginButton = fixture.debugElement.query(By.directive(RouterLink));
    loginButton.nativeElement.click();
    fixture.detectChanges(); // wait for routing to finish
    expect(location.path()).toBe(`/${profileRoutes.login.path}`);
  });

  it('should show the profile page if the user is authenticated', async () => {
    profileComponent.authState.set(AuthState.Authenticated);
    profileComponent.chef.set(mockChef);
    fixture.detectChanges();

    const profileStats = rootElement.querySelector('.profile-stats');
    expect(profileStats?.textContent).toContain(
      `${profileComponent.totalRecipesFavorited()} favorite`
    );
    expect(profileStats?.textContent).toContain(
      `${profileComponent.totalRecipesViewed()} recipes viewed`
    );
    expect(profileStats?.textContent).toContain(
      `${profileComponent.totalRecipesRated()} ratings`
    );

    const profileActions = rootElement.querySelector('.profile-actions');
    const [
      logoutButton,
      changeEmailButton,
      changePasswordButton,
      deleteAccountButton,
    ] = Array.from(profileActions?.querySelectorAll('button') ?? []);
    expect(logoutButton).toBeTruthy();
    expect(changeEmailButton).toBeTruthy();
    expect(changePasswordButton).toBeTruthy();
    expect(deleteAccountButton).toBeTruthy();

    const navigateSpy = vi.spyOn(router, 'navigate');
    changeEmailButton.click();
    expect(navigateSpy).toHaveBeenCalledWith([profileRoutes.updateEmail.path]);
    changePasswordButton.click();
    expect(navigateSpy).toHaveBeenCalledWith(
      [profileRoutes.updatePassword.path],
      {
        state: {
          email: mockChef.email,
        },
      }
    );
    deleteAccountButton.click();
    expect(navigateSpy).toHaveBeenCalledWith(
      [profileRoutes.deleteAccount.path],
      {
        state: {
          email: mockChef.email,
        },
      }
    );

    expect(rootElement.textContent).toContain('Linked Accounts');
    const linkedAccountsSection = rootElement.querySelector(
      '.profile-linked-accounts'
    );
    let accountI = 0;

    for (const [, emails] of profileComponent.linkedAccountEntries()) {
      const linkedAccountContainer = linkedAccountsSection?.querySelectorAll(
        '.profile-linked-account-container'
      )?.[accountI];
      const unlinkButton = linkedAccountContainer?.querySelector(
        '.profile-linked-account-buttons'
      )?.children?.[1] as HTMLButtonElement | null | undefined;
      expect(unlinkButton).toBeTruthy();
      expect(unlinkButton?.disabled).toBe(emails.length === 0);

      for (const email of emails) {
        expect(linkedAccountContainer?.textContent).toContain(email);
      }
      accountI++;
    }

    logoutButton.click();
    fixture.detectChanges();
    expect(profileComponent.authState()).toBe(AuthState.Unauthenticated);
  });
});
