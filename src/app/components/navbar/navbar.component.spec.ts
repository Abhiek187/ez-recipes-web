import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Title } from '@angular/platform-browser';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let navbarComponent: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let rootElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [MatToolbarModule, MatIconModule, MatButtonModule],
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
});
