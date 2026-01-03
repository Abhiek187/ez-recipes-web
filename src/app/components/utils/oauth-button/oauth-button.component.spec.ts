import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { OauthButtonComponent } from './oauth-button.component';
import { Provider } from 'src/app/models/profile.model';

describe('OauthButtonComponent', () => {
  let component: OauthButtonComponent;
  let fixture: ComponentFixture<OauthButtonComponent>;
  let rootElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OauthButtonComponent, RouterModule.forRoot([])],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OauthButtonComponent);
    fixture.componentRef.setInput('provider', Provider.Google);
    component = fixture.componentInstance;
    rootElement = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
