import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { AppModule } from 'src/app/app.module';
import { NavbarComponent } from '../navbar/navbar.component';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let homeComponent: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let rootElement: HTMLElement;

  beforeEach(async () => {
    // Import all the necessary modules and components to test the app component
    await TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges(); // re-render the component
    homeComponent = fixture.componentInstance;
    rootElement = fixture.nativeElement;
  });

  it('should create the app', () => {
    // Check that the component can render
    expect(homeComponent).toBeTruthy();
  });

  it(`shouldn't show a recipe initially`, () => {
    // Check that the page initially shows the "Find me a recipe!" button
    const findRecipeButton = rootElement.querySelector<HTMLButtonElement>(
      '.find-recipe-button'
    );
    expect(findRecipeButton).not.toBeNull();
    expect(findRecipeButton?.textContent).toContain('Find me a recipe!');

    // The navbar should be visible
    expect(
      fixture.debugElement.query(By.directive(NavbarComponent))
    ).toBeDefined();

    // The spinner should be hidden
    expect(homeComponent.isLoading).toBeFalse();
    expect(rootElement.querySelector('.progress-spinner')).toBeNull();
  });

  it('should load a random recipe after clicking the find recipe button', fakeAsync(() => {
    // Check that the getRandomRecipe method is called after clicking the find recipe button
    spyOn(homeComponent, 'getRandomRecipe');

    const findRecipeButton = rootElement.querySelector<HTMLButtonElement>(
      '.find-recipe-button'
    );
    expect(findRecipeButton).not.toBeNull();
    findRecipeButton?.click();
    tick(); // wait for the async tasks to complete

    expect(homeComponent.getRandomRecipe).toHaveBeenCalled();
  }));

  it('should show a spinner while loading', () => {
    // Check that the material spinner shows when isLoading is true
    homeComponent.isLoading = true;
    fixture.detectChanges();
    expect(rootElement.querySelector('.progress-spinner')).not.toBeNull();
  });
});
