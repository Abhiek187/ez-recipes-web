import { CanActivateFn } from '@angular/router';

import { environment } from 'src/environments/environment';

// Block access to routes until they're ready for production
export const devGuard: CanActivateFn = () => {
  return !environment.production;
};
