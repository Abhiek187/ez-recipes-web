import { Chef, ChefEmailResponse, LoginResponse } from './profile.model';
import { Token } from './recipe.model';

export const mockChef: Chef = {
  uid: 'oJG5PZ8KIIfvQMDsQzOwDbu2m6O2',
  email: 'test@email.com',
  emailVerified: true,
  ratings: { '641024': 5, '663849': 3 },
  recentRecipes: {
    '641024': '2024-10-17T02:54:07.471Z',
    '663849': '2024-10-17T22:28:27.387Z',
  },
  favoriteRecipes: ['641024'],
  token: 'e30.e30.e30',
};

export const mockLoginResponse = (emailVerified = true): LoginResponse => ({
  uid: mockChef.uid,
  token: mockChef.token,
  emailVerified,
});

export const mockChefEmailResponse: ChefEmailResponse = {
  kind: 'identitytoolkit#GetOobConfirmationCodeResponse',
  email: mockChef.email,
  token: mockChef.token,
};
