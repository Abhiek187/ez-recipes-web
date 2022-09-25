import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let appComponent: AppComponent;

  beforeEach(async () => {
    // Import all the necessary modules and components to test the app component
    await TestBed.configureTestingModule({
      imports: [AppModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges(); // re-render the component
    appComponent = fixture.componentInstance;
  });

  it('should create the app', () => {
    // Check that the component can render
    expect(appComponent).toBeTruthy();
  });
});
