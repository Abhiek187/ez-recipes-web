import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  convertToParamMap,
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

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));
  const route: ActivatedRouteSnapshot = {
    url: [],
    params: {},
    queryParams: {},
    fragment: null,
    data: {},
    outlet: '',
    component: null,
    routeConfig: null,
    title: undefined,
    root: new ActivatedRouteSnapshot(),
    parent: null,
    firstChild: null,
    children: [],
    pathFromRoot: [],
    paramMap: convertToParamMap({}),
    queryParamMap: convertToParamMap({}),
  };
  const state: RouterStateSnapshot = { url: '/mock/url', root: route };

  // SpyObj used to mock an injected service, Spy used to keep real implementation
  let mockChefService: jasmine.SpyObj<ChefService>;
  let createUrlTreeSpy: jasmine.Spy<
    (
      commands: (string | undefined)[],
      navigationExtras?: UrlCreationOptions
    ) => UrlTree
  >;

  beforeEach(() => {
    mockChefService = jasmine.createSpyObj('ChefService', ['getChef']);
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

  it('should return true if the user is authenticated', (done) => {
    mockChefService.getChef.and.returnValue(of(mockChef));
    const guardResult = executeGuard(route, state) as Observable<boolean>;

    guardResult.subscribe((result) => {
      expect(result).toBeTrue();
      done();
    });
  });

  it("should redirect to the login page if the user isn't authenticated", (done) => {
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
});
