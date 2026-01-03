import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { OauthCallbackComponent } from './oauth-callback.component';

describe('OauthCallbackComponent', () => {
  let component: OauthCallbackComponent;
  let fixture: ComponentFixture<OauthCallbackComponent>;
  let rootElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OauthCallbackComponent, RouterModule.forRoot([])],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OauthCallbackComponent);
    component = fixture.componentInstance;
    rootElement = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
