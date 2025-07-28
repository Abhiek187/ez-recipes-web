import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';

import { NavbarComponent } from './navbar.component';
import { mockChef } from 'src/app/models/profile.mock';
import { RecipeService } from 'src/app/services/recipe.service';
import { mockToken, mockRecipe } from 'src/app/models/recipe.mock';
import Constants from 'src/app/constants/constants';
import Theme from 'src/app/models/theme.model';

describe('NavbarComponent', () => {
  let navbarComponent: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let rootElement: HTMLElement;

  let mockRecipeService: jasmine.SpyObj<RecipeService>;
  let setItemSpy: jasmine.SpyObj<unknown>;

  beforeEach(async () => {
    mockRecipeService = jasmine.createSpyObj(
      'RecipeService',
      ['updateRecipe'],
      {
        recipe: signal(mockRecipe),
      }
    );

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterModule.forRoot([]),
        NavbarComponent,
      ],
      providers: [
        {
          provide: RecipeService,
          useValue: mockRecipeService,
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    const localStorageProto = Object.getPrototypeOf(localStorage);
    spyOn(localStorageProto, 'getItem').and.returnValue(mockChef.token);
    setItemSpy = spyOn(localStorageProto, 'setItem');
    spyOn(localStorageProto, 'removeItem').and.callFake(() => undefined);

    fixture = TestBed.createComponent(NavbarComponent);
    navbarComponent = fixture.componentInstance;
    rootElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should display button links on large screens', () => {
    // Check that the navbar contains all the nav links and the hamburger menu is hidden
    expect(navbarComponent).toBeTruthy();

    const menuIcon = rootElement.querySelector<HTMLButtonElement>('.menu-icon');
    expect(menuIcon).toBeNull();
    expect(rootElement.textContent).toContain('EZ Recipes');
    for (const route of navbarComponent.navItems) {
      expect(rootElement.textContent).toContain(route.title);
    }

    // The theme icon should always be visible
    const themeIcon =
      rootElement.querySelector<HTMLButtonElement>('.theme-icon');
    expect(themeIcon).not.toBeNull();

    // The favorite and share buttons should be hidden by default on the home page
    const favoriteIcon =
      rootElement.querySelector<HTMLButtonElement>('.favorite-icon');
    const shareIcon =
      rootElement.querySelector<HTMLButtonElement>('.share-icon');

    expect(navbarComponent.isRecipePage()).toBeFalse();
    expect(favoriteIcon).toBeNull();
    expect(shareIcon).toBeNull();
  });

  it('should display the hamburger menu on small screens', () => {
    // Check that the navbar contains the app name and a hamburger icon
    navbarComponent.isSmallScreen.set(true);
    fixture.detectChanges();

    const menuIcon = rootElement.querySelector<HTMLButtonElement>('.menu-icon');
    expect(menuIcon).not.toBeNull();
    expect(rootElement.textContent).toContain('EZ Recipes');
    for (const route of navbarComponent.navItems) {
      expect(rootElement.textContent).toContain(route.title);
    }

    // The favorite and share buttons should be hidden by default on the home page
    const favoriteIcon =
      rootElement.querySelector<HTMLButtonElement>('.favorite-icon');
    const shareIcon =
      rootElement.querySelector<HTMLButtonElement>('.share-icon');

    expect(navbarComponent.isRecipePage()).toBeFalse();
    expect(favoriteIcon).toBeNull();
    expect(shareIcon).toBeNull();
  });

  it('should toggle the sidenav when clicking the hamburger icon', () => {
    // Check that the sidenav appears and disappears when clicking the hamburger icon
    navbarComponent.isSmallScreen.set(true);
    fixture.detectChanges();

    const sidenav = rootElement.querySelector<HTMLDivElement>('.sidenav');
    expect(sidenav).not.toBeNull();
    expect(sidenav?.classList).not.toContain('mat-drawer-opened');

    const menuIcon = rootElement.querySelector<HTMLButtonElement>('.menu-icon');
    menuIcon?.click();
    fixture.detectChanges();
    expect(sidenav?.classList).toContain('mat-drawer-opened');

    for (const navItem of navbarComponent.navItems) {
      expect(sidenav?.textContent).toContain(navItem.title);
    }

    menuIcon?.click();
    fixture.detectChanges();
    expect(sidenav?.classList).not.toContain('mat-drawer-opened');
  });

  it('should toggle between light and dark mode', () => {
    expect(navbarComponent.isDarkMode()).toBeFalse();
    expect(document.body.style.colorScheme).toBe(Theme.Light);

    const themeIcon = document.querySelector<HTMLButtonElement>('.theme-icon');
    themeIcon?.click();
    fixture.detectChanges();
    expect(navbarComponent.isDarkMode()).toBeTrue();
    expect(setItemSpy).toHaveBeenCalledWith(
      Constants.LocalStorage.theme,
      Theme.Dark
    );
    expect(document.body.style.colorScheme).toBe(Theme.Dark);

    themeIcon?.click();
    fixture.detectChanges();
    expect(navbarComponent.isDarkMode()).toBeFalse();
    expect(setItemSpy).toHaveBeenCalledWith(
      Constants.LocalStorage.theme,
      Theme.Light
    );
    expect(document.body.style.colorScheme).toBe(Theme.Light);
  });

  it('should disable the favorite button if unauthenticated', () => {
    navbarComponent.isRecipePage.set(true);
    navbarComponent.chef.set(undefined);
    fixture.detectChanges();

    const favoriteButton =
      rootElement.querySelector<HTMLButtonElement>('.favorite-icon');
    expect(favoriteButton?.disabled).toBeTrue();
    expect(navbarComponent.isFavorite()).toBeFalse();
  });

  it('should toggle isFavorite', () => {
    // Check that the toggleFavoriteRecipe method toggles the isFavorite property
    navbarComponent.isRecipePage.set(true);
    navbarComponent.chef.set(mockChef);
    fixture.detectChanges();
    // Recipe shouldn't be liked by default
    expect(navbarComponent.isFavorite()).toBeFalse();

    // Check that the heart icon is filled when favoriting and isn't filled when unfavoriting
    const favoriteButton =
      rootElement.querySelector<HTMLButtonElement>('.favorite-icon');
    const favoriteIcon = favoriteButton?.querySelector('mat-icon');
    expect(favoriteIcon?.getAttribute('fonticon')).toBe('favorite_border');
    expect(favoriteButton?.ariaLabel).toBe('Favorite this recipe');
    mockRecipeService.updateRecipe.and.returnValue(of(mockToken));

    favoriteButton?.click();
    fixture.detectChanges();
    expect(mockRecipeService.updateRecipe).toHaveBeenCalledWith(mockRecipe.id, {
      isFavorite: true,
    });
    expect(navbarComponent.chef()?.favoriteRecipes).toContain(
      mockRecipe.id.toString()
    );
    expect(navbarComponent.isFavorite()).toBeTrue();
    expect(favoriteIcon?.getAttribute('fonticon')).toBe('favorite');
    expect(favoriteButton?.ariaLabel).toBe('Unfavorite this recipe');

    favoriteButton?.click();
    fixture.detectChanges();
    expect(mockRecipeService.updateRecipe).toHaveBeenCalledWith(mockRecipe.id, {
      isFavorite: false,
    });
    expect(navbarComponent.chef()?.favoriteRecipes).not.toContain(
      mockRecipe.id.toString()
    );
    expect(navbarComponent.isFavorite()).toBeFalse();
    expect(favoriteIcon?.getAttribute('fonticon')).toBe('favorite_border');
    expect(favoriteButton?.ariaLabel).toBe('Favorite this recipe');
  });

  it('should call shareRecipe after clicking the share button', () => {
    // Check that shareRecipe is called after clicking the share button
    spyOn(navbarComponent, 'shareRecipe');
    navbarComponent.isRecipePage.set(true);
    fixture.detectChanges();

    const shareIcon =
      rootElement.querySelector<HTMLButtonElement>('.share-icon');
    shareIcon?.click();

    fixture.detectChanges();
    expect(navbarComponent.shareRecipe).toHaveBeenCalled();
  });
});
