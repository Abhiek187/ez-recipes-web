import { Location } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  provideRouter,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';

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
      imports: [ProfileComponent, RouterModule.forRoot([])],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter(Object.values(routes)),
      ],
    }).compileComponents();

    const localStorageProto = Object.getPrototypeOf(localStorage);
    spyOn(localStorageProto, 'getItem').and.returnValue(null);
    spyOn(localStorageProto, 'setItem').and.callFake(() => {});
    spyOn(localStorageProto, 'removeItem').and.callFake(() => {});

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

  it('should show a loading message when the auth state is loading', () => {
    profileComponent.authState.set(AuthState.Loading);
    fixture.detectChanges();

    expect(rootElement.textContent).toContain('Getting your profile ready… 🧑‍🍳');
  });

  it("should show the login button if the user isn't authenticated", async () => {
    expect(profileComponent.authState()).toBe(AuthState.Unauthenticated);

    expect(rootElement.textContent).toContain(
      'Signing up for an account is free'
    );
    const loginButton = fixture.debugElement.query(By.directive(RouterLink));
    loginButton.nativeElement.click();
    await fixture.whenStable(); // wait for routing to finish
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

    const navigateSpy = spyOn(router, 'navigate');
    changeEmailButton.click();
    expect(navigateSpy).toHaveBeenCalledWith([profileRoutes.updateEmail.path]);
    changePasswordButton.click();
    expect(navigateSpy).toHaveBeenCalledWith([
      profileRoutes.updatePassword.path,
    ]);
    deleteAccountButton.click();
    expect(navigateSpy).toHaveBeenCalledWith([
      profileRoutes.deleteAccount.path,
    ]);

    logoutButton.click();
    fixture.detectChanges();
    expect(profileComponent.authState()).toBe(AuthState.Unauthenticated);
  });
});
