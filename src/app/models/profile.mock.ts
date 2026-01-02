import {
  AuthUrl,
  Chef,
  ChefEmailResponse,
  LoginResponse,
  Provider,
} from './profile.model';

export const mockChef: Chef = {
  uid: 'oJG5PZ8KIIfvQMDsQzOwDbu2m6O2',
  email: 'test@email.com',
  emailVerified: true,
  providerData: [
    { email: 'test@email.com', providerId: 'password', uid: 'test@email.com' },
    {
      email: 'test@email.com',
      providerId: Provider.GitHub,
      uid: '29958092',
    },
    {
      email: 'test@email.com',
      providerId: Provider.Facebook,
      uid: '4260456714231215',
    },
    {
      email: 'test@email.com',
      providerId: Provider.Google,
      uid: '111444254381322957655',
    },
    {
      email: 'test2@email2.com',
      providerId: Provider.Google,
      uid: '100853917476273280774',
    },
  ],
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

export const mockAuthUrls: AuthUrl[] = [
  { providerId: Provider.Google, authUrl: 'https://www.google.com' },
  { providerId: Provider.Facebook, authUrl: 'https://www.facebook.com' },
  { providerId: Provider.GitHub, authUrl: 'https://github.com' },
];
