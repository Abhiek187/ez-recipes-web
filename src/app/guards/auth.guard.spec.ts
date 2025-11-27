import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { vi, type Mock, type MockedObject } from 'vitest';

import { authGuard } from './auth.guard';
import { ChefService } from '../services/chef.service';
import { mockChef } from '../models/profile.mock';
import { profileRoutes } from '../app-routing.module';
import { mockToken } from '../models/recipe.mock';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));
  const route = new ActivatedRouteSnapshot();
  const state: RouterStateSnapshot = { url: '/mock/url', root: route };

  // SpyObj used to mock an injected service, Spy used to keep real implementation
  let mockChefService: MockedObject<ChefService>;
  let createUrlTreeSpy: Mock;
  const localStorageProto = Object.getPrototypeOf(localStorage);

  beforeEach(() => {
    mockChefService = vi.mockObject({
      chef: vi.fn().mockName('ChefService.chef'),
      getChef: vi.fn().mockName('ChefService.getChef'),
    } as unknown as ChefService);
    createUrlTreeSpy = vi.spyOn(Router.prototype, 'createUrlTree');

    TestBed.configureTestingModule({
      providers: [
        {
          provide: ChefService,
          useValue: mockChefService,
        },
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true if the user is already authenticated', () => {
    vi.spyOn(localStorageProto, 'getItem').mockReturnValue(mockToken);
    mockChefService.chef.mockReturnValue(mockChef);
    mockChefService.getChef.mockReturnValue(of(mockChef));
    const guardResult = executeGuard(route, state) as Observable<boolean>;

    expect(guardResult).toBeTruthy();
  });

  it('should return true if the user is authenticated', async () => {
    vi.spyOn(localStorageProto, 'getItem').mockReturnValue(mockToken);
    mockChefService.chef.mockReturnValue(undefined);
    mockChefService.getChef.mockReturnValue(of(mockChef));
    const guardResult = executeGuard(route, state) as Observable<boolean>;

    guardResult.subscribe((result) => {
      expect(result).toBe(true);
    });
  });

  it("should redirect to the login page if there's no token in localStorage", () => {
    vi.spyOn(localStorageProto, 'getItem').mockReturnValue(null);
    mockChefService.chef.mockReturnValue(undefined);
    mockChefService.getChef.mockReturnValue(throwError(() => 'mock error'));
    const guardResult = executeGuard(route, state) as UrlTree;

    expect(guardResult).toBeInstanceOf(UrlTree);
    expect(guardResult.queryParams).toEqual({ next: state.url });
    expect(createUrlTreeSpy).toHaveBeenCalledWith(
      [`/${profileRoutes.login.path}`],
      {
        queryParams: { next: state.url },
      }
    );
  });

  it("should redirect to the login page if the user isn't authenticated", async () => {
    vi.spyOn(localStorageProto, 'getItem').mockReturnValue(mockToken);
    mockChefService.chef.mockReturnValue(undefined);
    mockChefService.getChef.mockReturnValue(throwError(() => 'mock error'));
    const guardResult = executeGuard(route, state) as Observable<UrlTree>;

    guardResult.subscribe((result) => {
      expect(result).toBeInstanceOf(UrlTree);
      expect(result.queryParams).toEqual({ next: state.url });
      expect(createUrlTreeSpy).toHaveBeenCalledWith(
        [`/${profileRoutes.login.path}`],
        {
          queryParams: { next: state.url },
        }
      );
    });
  });

  it("should redirect to the login page if the user didn't verify their email", async () => {
    vi.spyOn(localStorageProto, 'getItem').mockReturnValue(mockToken);
    mockChefService.chef.mockReturnValue(undefined);
    mockChefService.getChef.mockReturnValue(
      of({
        ...mockChef,
        emailVerified: false,
      })
    );
    const guardResult = executeGuard(route, state) as Observable<UrlTree>;

    guardResult.subscribe((result) => {
      expect(result).toBeInstanceOf(UrlTree);
      expect(result.queryParams).toEqual({ next: state.url });
      expect(createUrlTreeSpy).toHaveBeenCalledWith(
        [`/${profileRoutes.login.path}`],
        {
          queryParams: { next: state.url },
        }
      );
    });
  });
});
