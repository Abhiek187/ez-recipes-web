import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { OauthButtonComponent } from './oauth-button.component';
import { Provider } from 'src/app/models/profile.model';
import { ChefService } from 'src/app/services/chef.service';
import { mockChef } from 'src/app/models/profile.mock';

describe('OauthButtonComponent', () => {
  let component: OauthButtonComponent;
  let fixture: ComponentFixture<OauthButtonComponent>;
  let rootElement: HTMLElement;

  const provider = Provider.Google;
  const authUrl = new URL('https://www.example.com?code=abcd&state=1234');
  const windowOpenSpy = vi.spyOn(window, 'open').mockReturnValue(null);
  const mockLoginWithOAuth = vi.fn().mockReturnValue(of(mockChef));
  const mockChefService = {
    loginWithOAuth: mockLoginWithOAuth,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OauthButtonComponent, RouterModule.forRoot([])],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ChefService,
          useValue: mockChefService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OauthButtonComponent);
    fixture.componentRef.setInput('provider', provider);
    component = fixture.componentInstance;
    rootElement = fixture.nativeElement;
    await fixture.whenStable();
  });

  it("should disable the button if there's no auth URL", () => {
    expect(component).toBeTruthy();
    expect(component.providerState()).toBeNull();

    const oauthButton =
      rootElement.querySelector<HTMLButtonElement>('.oauth-button');
    expect(oauthButton?.textContent).toContain(component.providerStyle().label);
    expect(oauthButton?.disabled).toBe(true);
  });

  it('should start the login flow when clicked', async () => {
    fixture.componentRef.setInput('authUrl', authUrl.toString());
    await fixture.whenStable();
    expect(component.providerState()).toBe('1234');

    const oauthButton =
      rootElement.querySelector<HTMLButtonElement>('.oauth-button');
    expect(oauthButton?.disabled).toBe(false);
    oauthButton?.click();
    await fixture.whenStable();

    expect(component.isLoading()).toBe(false);
    expect(windowOpenSpy).toHaveBeenCalledWith(authUrl.toString());
  });

  it('should discard messages that come from a different origin', async () => {
    fixture.componentRef.setInput('authUrl', authUrl.toString());
    window.dispatchEvent(
      new MessageEvent('message', {
        origin: 'https://www.example.com',
        data: undefined,
      })
    );
    await fixture.whenStable();

    expect(mockLoginWithOAuth).not.toHaveBeenCalled();
  });

  it("should discard messages that don't have a matching state", async () => {
    fixture.componentRef.setInput('authUrl', authUrl.toString());
    window.dispatchEvent(
      new MessageEvent('message', {
        origin: window.location.origin,
        data: {
          code: authUrl.searchParams.get('code'),
          state: '9876',
        },
      })
    );
    await fixture.whenStable();

    expect(mockLoginWithOAuth).not.toHaveBeenCalled();
  });

  it('should discard messages if the auth code is missing', async () => {
    fixture.componentRef.setInput('authUrl', authUrl.toString());
    window.dispatchEvent(
      new MessageEvent('message', {
        origin: window.location.origin,
        data: {
          state: authUrl.searchParams.get('state'),
        },
      })
    );
    await fixture.whenStable();

    expect(mockLoginWithOAuth).not.toHaveBeenCalled();
  });

  it('should login if the redirect was successful', async () => {
    fixture.componentRef.setInput('authUrl', authUrl.toString());
    window.dispatchEvent(
      new MessageEvent('message', {
        origin: window.location.origin,
        data: {
          code: authUrl.searchParams.get('code'),
          state: authUrl.searchParams.get('state'),
        },
      })
    );
    await fixture.whenStable();

    expect(mockLoginWithOAuth).toHaveBeenCalledWith({
      code: authUrl.searchParams.get('code'),
      providerId: component.provider(),
    });
  });
});
