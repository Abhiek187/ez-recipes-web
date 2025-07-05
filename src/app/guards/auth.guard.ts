import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { ChefService } from '../services/chef.service';
import { profileRoutes } from '../app-routing.module';
import Constants from '../constants/constants';

// If the user is authenticated, navigate to the route. Otherwise, redirect to the login page.
export const authGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  const chefService = inject(ChefService);

  const token = localStorage.getItem(Constants.LocalStorage.token);
  const loginRedirect = router.createUrlTree([`/${profileRoutes.login.path}`], {
    // state.url contains the full path, whereas route.url only contains the child path
    queryParams: { next: state.url },
  });

  if (token === null) {
    return loginRedirect;
  } else if (chefService.chef() !== undefined) {
    return true;
  }

  return chefService.getChef(token).pipe(
    map(() => true),
    catchError(() => of(loginRedirect))
  );
};
