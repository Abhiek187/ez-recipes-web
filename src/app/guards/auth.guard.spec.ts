import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlCreationOptions,
  UrlTree,
} from '@angular/router';
import { Observable, of, throwError } from 'rxjs';

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
  let mockChefService: jasmine.SpyObj<ChefService>;
  let createUrlTreeSpy: jasmine.Spy<
    (
      commands: (string | undefined)[],
      navigationExtras?: UrlCreationOptions
    ) => UrlTree
  >;
  const localStorageProto = Object.getPrototypeOf(localStorage);

  beforeEach(() => {
    mockChefService = jasmine.createSpyObj('ChefService', ['chef', 'getChef']);
    createUrlTreeSpy = spyOn(
      Router.prototype,
      'createUrlTree'
    ).and.callThrough();

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
    spyOn(localStorageProto, 'getItem').and.returnValue(mockToken);
    mockChefService.chef.and.returnValue(mockChef);
    mockChefService.getChef.and.returnValue(of(mockChef));
    const guardResult = executeGuard(route, state) as Observable<boolean>;

    expect(guardResult).toBeTrue();
  });

  it('should return true if the user is authenticated', (done) => {
    spyOn(localStorageProto, 'getItem').and.returnValue(mockToken);
    mockChefService.chef.and.returnValue(undefined);
    mockChefService.getChef.and.returnValue(of(mockChef));
    const guardResult = executeGuard(route, state) as Observable<boolean>;

    guardResult.subscribe((result) => {
      expect(result).toBeTrue();
      done();
    });
  });

  it("should redirect to the login page if there's no token in localStorage", () => {
    spyOn(localStorageProto, 'getItem').and.returnValue(null);
    mockChefService.chef.and.returnValue(undefined);
    mockChefService.getChef.and.returnValue(throwError(() => 'mock error'));
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

  it("should redirect to the login page if the user isn't authenticated", (done) => {
    spyOn(localStorageProto, 'getItem').and.returnValue(mockToken);
    mockChefService.chef.and.returnValue(undefined);
    mockChefService.getChef.and.returnValue(throwError(() => 'mock error'));
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
      done();
    });
  });

  it("should redirect to the login page if the user didn't verify their email", (done) => {
    spyOn(localStorageProto, 'getItem').and.returnValue(mockToken);
    mockChefService.chef.and.returnValue(undefined);
    mockChefService.getChef.and.returnValue(
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
      done();
    });
  });
});
