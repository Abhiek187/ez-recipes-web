import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let searchComponent: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let rootElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent, NoopAnimationsModule, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    fixture.detectChanges();
    searchComponent = fixture.componentInstance;
    rootElement = fixture.nativeElement;
  });

  it('should show the filter form', () => {
    // Check that all the form elements are present
    expect(searchComponent).toBeTruthy();
  });

  it('should load recipes after submitting the initial form', fakeAsync(() => {
    // By default, the form should be valid
    spyOn(searchComponent, 'onSubmit');

    const submitButton =
      rootElement.querySelector<HTMLButtonElement>('.submit-button');
    expect(submitButton).not.toBeNull();
    expect(submitButton?.disabled).toBeFalse();
    submitButton?.click();
    tick();

    expect(searchComponent.onSubmit).toHaveBeenCalled();
  }));

  it('should remove null filter values', () => {
    // Check that removeNullValues() removes null values from a recipe filter
    const filter = {
      query: 'cake',
      minCals: null,
      maxCals: 1000,
    };
    const nonNullFilter = searchComponent.removeNullValues(filter);
    expect(nonNullFilter).toEqual({
      query: filter.query,
      maxCals: filter.maxCals,
    });
  });
});
