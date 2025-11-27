import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';

import { devGuard } from './dev.guard';

describe('devGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => devGuard(...guardParameters));
  const route = new ActivatedRouteSnapshot();
  const state: RouterStateSnapshot = { url: '', root: route };

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true in dev', () => {
    expect(executeGuard(route, state)).toBe(true);
  });
});
