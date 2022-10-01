import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let navbarComponent: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let rootElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatSidenavModule,
        MatListModule,
        BrowserAnimationsModule,
        RouterTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    navbarComponent = fixture.componentInstance;
    rootElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('should display the navbar correctly', () => {
    // Check that the navbar contains the app name
    expect(navbarComponent).toBeTruthy();
    expect(rootElement.textContent).toContain('EZ Recipes');
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
    const favoriteIcon =
      rootElement.querySelector<HTMLButtonElement>('.favorite-icon');
    expect(favoriteIcon).not.toBeNull();
    // Recipe shouldn't be liked by default
    expect(favoriteIcon?.textContent).toBe('favorite_border');

    favoriteIcon?.click();
    expect(favoriteIcon?.textContent).toBe('favorite');

    favoriteIcon?.click();
    expect(favoriteIcon?.textContent).toBe('favorite_border');
  });
});
