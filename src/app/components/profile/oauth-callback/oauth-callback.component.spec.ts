import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { vi } from 'vitest';

import { OauthCallbackComponent } from './oauth-callback.component';
import { OAuthResponse } from 'src/app/models/profile.model';

describe('OauthCallbackComponent', () => {
  let component: OauthCallbackComponent;
  let fixture: ComponentFixture<OauthCallbackComponent>;
  let rootElement: HTMLElement;

  const mockSnackBarOpen = vi.fn();
  let mockActivatedRoute: ActivatedRoute;
  const mockPostMessage = vi.fn();

  const mockWindowClose = vi
    .spyOn(window, 'close')
    .mockImplementation(() => undefined);

  const mockWindow = (withOpener: boolean) => {
    Object.defineProperty(window, 'opener', {
      configurable: true,
      get: () => (withOpener ? { postMessage: mockPostMessage } : null),
    });
  };

  const mockRoute = (queryParams?: OAuthResponse) => {
    mockActivatedRoute = {
      snapshot: {
        queryParamMap: queryParams
          ? {
              has: () => true,
              get: (param: keyof OAuthResponse) => queryParams[param],
            }
          : {
              has: () => false,
              get: () => null,
            },
      },
    } as unknown as ActivatedRoute;
  };

  const renderComponent = async () => {
    await TestBed.configureTestingModule({
      imports: [OauthCallbackComponent, RouterModule.forRoot([])],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: MatSnackBar,
          useValue: {
            open: mockSnackBarOpen,
          },
        },
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OauthCallbackComponent);
    component = fixture.componentInstance;
    rootElement = fixture.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
  };

  it('should send the auth code if present in the query params', async () => {
    mockWindow(true);
    const queryParams: OAuthResponse = {
      code: 'abcd',
      state: '1234',
    };
    mockRoute(queryParams);
    await renderComponent();

    expect(component).toBeTruthy();
    expect(rootElement.querySelector('.progress-spinner')).toBeTruthy();
    expect(mockPostMessage).toHaveBeenCalledWith(
      queryParams,
      window.location.origin
    );
    expect(mockWindowClose).toHaveBeenCalled();
  });

  it("should display an error if there's no parent tab", async () => {
    mockWindow(false);
    mockRoute();
    await renderComponent();

    expect(mockSnackBarOpen).toHaveBeenCalled();
  });

  it('should display an error if the required query params are missing', async () => {
    mockWindow(true);
    mockRoute();
    await renderComponent();

    expect(mockSnackBarOpen).toHaveBeenCalled();
  });
});
