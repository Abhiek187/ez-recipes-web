import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let navbarComponent: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let rootElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatSidenavModule,
        MatListModule,
        MatSnackBarModule,
        NoopAnimationsModule,
        RouterModule.forRoot([]),
        NavbarComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    navbarComponent = fixture.componentInstance;
    rootElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should display the navbar correctly', () => {
    // Check that the navbar contains the app name and a hamburger icon
    expect(navbarComponent).toBeTruthy();
    expect(rootElement.textContent).toContain('EZ Recipes');

    const menuIcon = rootElement.querySelector<HTMLButtonElement>('.menu-icon');
    expect(menuIcon).not.toBeNull();

    // The favorite and share buttons should be hidden by default on the home page
    const favoriteIcon =
      rootElement.querySelector<HTMLButtonElement>('.favorite-icon');
    const shareIcon =
      rootElement.querySelector<HTMLButtonElement>('.share-icon');

    expect(navbarComponent.isRecipePage).toBeFalse();
    expect(favoriteIcon).toBeNull();
    expect(shareIcon).toBeNull();
  });

  it('should toggle the sidenav when clicking the hamburger icon', () => {
    // Check that the sidenav appears and disappears when clicking the hamburger icon
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

  it('should toggle isFavorite', () => {
    // Check that the toggleFavoriteRecipe method toggles the isFavorite property
    const oldIsFavorite = navbarComponent.isFavorite;
    navbarComponent.toggleFavoriteRecipe();

    const newIsFavorite = navbarComponent.isFavorite;
    expect(newIsFavorite).not.toBe(oldIsFavorite);
  });

  it('should show the correct heart icon', () => {
    // Check that the heart icon is filled when favoriting and isn't filled when unfavoriting
    navbarComponent.isRecipePage = true;
    fixture.detectChanges();

    const favoriteButton =
      rootElement.querySelector<HTMLButtonElement>('.favorite-icon');
    const favoriteIcon = favoriteButton?.querySelector('mat-icon');
    expect(favoriteButton).not.toBeNull();
    // Recipe shouldn't be liked by default
    expect(favoriteIcon?.getAttribute('fonticon')).toBe('favorite_border');
    expect(favoriteButton?.ariaLabel).toBe('Favorite this recipe');

    favoriteButton?.click();
    fixture.detectChanges();
    expect(favoriteIcon?.getAttribute('fonticon')).toBe('favorite');
    expect(favoriteButton?.ariaLabel).toBe('Unfavorite this recipe');

    favoriteButton?.click();
    fixture.detectChanges();
    expect(favoriteIcon?.getAttribute('fonticon')).toBe('favorite_border');
    expect(favoriteButton?.ariaLabel).toBe('Favorite this recipe');
  });

  it('should call shareRecipe after clicking the share button', () => {
    // Check that shareRecipe is called after clicking the share button
    spyOn(navbarComponent, 'shareRecipe');
    navbarComponent.isRecipePage = true;
    fixture.detectChanges();

    const shareIcon =
      rootElement.querySelector<HTMLButtonElement>('.share-icon');
    shareIcon?.click();

    fixture.detectChanges();
    expect(navbarComponent.shareRecipe).toHaveBeenCalled();
  });
});
