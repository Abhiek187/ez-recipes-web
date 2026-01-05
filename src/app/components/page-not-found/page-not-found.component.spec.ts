import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found.component';

describe('PageNotFoundComponent', () => {
  let rootComponent: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;
  let rootElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageNotFoundComponent, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PageNotFoundComponent);
    rootComponent = fixture.componentInstance;
    rootElement = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should show the 404 page', () => {
    // Check that a header and link to the home page are present
    expect(rootComponent).toBeTruthy();

    const header = rootElement.querySelector<HTMLHeadingElement>('.header-404');
    expect(header).not.toBeNull();
    expect(header?.textContent).toBe('Page Not Found');

    const link = rootElement.querySelector<HTMLAnchorElement>('.home-link');
    expect(link).not.toBeNull();
    // The link isn't going to show the href right away
    expect(link?.getAttribute('routerlink')).toBe('/');
  });
});
