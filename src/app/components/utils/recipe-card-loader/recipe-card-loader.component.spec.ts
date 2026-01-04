import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeCardLoaderComponent } from './recipe-card-loader.component';

describe('RecipeCardLoaderComponent', () => {
  let component: RecipeCardLoaderComponent;
  let fixture: ComponentFixture<RecipeCardLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeCardLoaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeCardLoaderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
