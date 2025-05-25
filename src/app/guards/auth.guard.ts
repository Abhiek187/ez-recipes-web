import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { ChefService } from '../services/chef.service';
import { profileRoutes, routes } from '../app-routing.module';

// If the user is authenticated, navigate to the route. Otherwise, redirect to the login page.
export const authGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  const chefService = inject(ChefService);

  return chefService.getChef('').pipe(
    map(() => {
      return true;
    }),
    catchError(() => {
      return of(
        router.createUrlTree(
          ['/', routes.profile.path, profileRoutes.login.path],
          {
            // state.url contains the full path, whereas route.url only contains the child path
            queryParams: { next: state.url },
          }
        )
      );
    })
  );
};
