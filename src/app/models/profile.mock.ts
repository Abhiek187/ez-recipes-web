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
  passkeys: [
    {
      webAuthnUserID: 'tgPWAI3qZg2Fpy2USU0s2B5TGeoNg3XeaoNmnzyIKXk',
      id: 'maixhQnppPzK4cOySLxXfA',
      publicKey:
        'pQECAyYgASFYIGOmskty53DP+KNGrIxCVizp+rp8WReliMavPe7PFBsuIlggb6b5zDKjL3T1NdX2TWING3MCuz6C7V1aHcE71hh1XWY=',
      counter: 0,
      transports: ['hybrid', 'internal'],
      deviceType: 'multiDevice',
      backedUp: true,
      name: 'Google Password Manager',
      lastUsed: '2026-01-19T03:37:48.876Z',
      iconLight:
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vc' +
        'mcvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDE5MiAxOTIiIGhl' +
        'aWdodD0iMjRweCIgdmlld0JveD0iMCAwIDE5MiAxOTIiIHdpZHRoPSIyNHB4Ij48cmV' +
        'jdCBmaWxsPSJub25lIiBoZWlnaHQ9IjE5MiIgd2lkdGg9IjE5MiIgeT0iMCIvPjxnPj' +
        'xwYXRoIGQ9Ik02OS4yOSwxMDZjLTMuNDYsNS45Ny05LjkxLDEwLTE3LjI5LDEwYy0xM' +
        'S4wMywwLTIwLTguOTctMjAtMjBzOC45Ny0yMCwyMC0yMCBjNy4zOCwwLDEzLjgzLDQu' +
        'MDMsMTcuMjksMTBoMjUuNTVDOTAuMyw2Ni41NCw3Mi44Miw1Miw1Miw1MkMyNy43NCw' +
        '1Miw4LDcxLjc0LDgsOTZzMTkuNzQsNDQsNDQsNDRjMjAuODIsMCwzOC4zLTE0LjU0LD' +
        'QyLjg0LTM0IEg2OS4yOXoiIGZpbGw9IiM0Mjg1RjQiLz48cmVjdCBmaWxsPSIjRkJCQ' +
        'zA0IiBoZWlnaHQ9IjI0IiB3aWR0aD0iNDQiIHg9Ijk0IiB5PSI4NCIvPjxwYXRoIGQ9' +
        'Ik05NC4zMiw4NEg2OHYwLjA1YzIuNSwzLjM0LDQsNy40Nyw0LDExLjk1cy0xLjUsOC4' +
        '2MS00LDExLjk1VjEwOGgyNi4zMiBjMS4wOC0zLjgyLDEuNjgtNy44NCwxLjY4LTEyUz' +
        'k1LjQxLDg3LjgyLDk0LjMyLDg0eiIgZmlsbD0iI0VBNDMzNSIvPjxwYXRoIGQ9Ik0xO' +
        'DQsMTA2djI2aC0xNnYtOGMwLTQuNDItMy41OC04LTgtOHMtOCwzLjU4LTgsOHY4aC0x' +
        'NnYtMjZIMTg0eiIgZmlsbD0iIzM0QTg1MyIvPjxyZWN0IGZpbGw9IiMxODgwMzgiIGh' +
        'laWdodD0iMjQiIHdpZHRoPSI0OCIgeD0iMTM2IiB5PSI4NCIvPjwvZz48L3N2Zz4=',
      iconDark:
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcm' +
        'cvMjAwMC9zdmciIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDE5MiAxOTIiIGhla' +
        'WdodD0iMjRweCIgdmlld0JveD0iMCAwIDE5MiAxOTIiIHdpZHRoPSIyNHB4Ij48cmVj' +
        'dCBmaWxsPSJub25lIiBoZWlnaHQ9IjE5MiIgd2lkdGg9IjE5MiIgeT0iMCIvPjxnPjx' +
        'wYXRoIGQ9Ik02OS4yOSwxMDZjLTMuNDYsNS45Ny05LjkxLDEwLTE3LjI5LDEwYy0xMS' +
        '4wMywwLTIwLTguOTctMjAtMjBzOC45Ny0yMCwyMC0yMCBjNy4zOCwwLDEzLjgzLDQuM' +
        'DMsMTcuMjksMTBoMjUuNTVDOTAuMyw2Ni41NCw3Mi44Miw1Miw1Miw1MkMyNy43NCw1' +
        'Miw4LDcxLjc0LDgsOTZzMTkuNzQsNDQsNDQsNDRjMjAuODIsMCwzOC4zLTE0LjU0LDQ' +
        'yLjg0LTM0IEg2OS4yOXoiIGZpbGw9IiM0Mjg1RjQiLz48cmVjdCBmaWxsPSIjRkJCQz' +
        'A0IiBoZWlnaHQ9IjI0IiB3aWR0aD0iNDQiIHg9Ijk0IiB5PSI4NCIvPjxwYXRoIGQ9I' +
        'k05NC4zMiw4NEg2OHYwLjA1YzIuNSwzLjM0LDQsNy40Nyw0LDExLjk1cy0xLjUsOC42' +
        'MS00LDExLjk1VjEwOGgyNi4zMiBjMS4wOC0zLjgyLDEuNjgtNy44NCwxLjY4LTEyUzk' +
        '1LjQxLDg3LjgyLDk0LjMyLDg0eiIgZmlsbD0iI0VBNDMzNSIvPjxwYXRoIGQ9Ik0xOD' +
        'QsMTA2djI2aC0xNnYtOGMwLTQuNDItMy41OC04LTgtOHMtOCwzLjU4LTgsOHY4aC0xN' +
        'nYtMjZIMTg0eiIgZmlsbD0iIzM0QTg1MyIvPjxyZWN0IGZpbGw9IiMxODgwMzgiIGhl' +
        'aWdodD0iMjQiIHdpZHRoPSI0OCIgeD0iMTM2IiB5PSI4NCIvPjwvZz48L3N2Zz4=',
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

export const mockPasskeyCreationOptions: PublicKeyCredentialCreationOptionsJSON =
  {
    challenge: 'u6R7q8xK3eCCmCUpx1HR-WtuV9z2d4FCVlntZFDrsbQ',
    rp: {
      name: 'EZ Recipes Web',
      id: location.hostname,
    },
    user: {
      id: 'ccr9dy6B7OXMyeDW0KPEuPZ9MfKkHLtFPbhnscTXhbM',
      name: 'test@email.com',
      displayName: '',
    },
    pubKeyCredParams: [
      { alg: -8, type: 'public-key' },
      { alg: -7, type: 'public-key' },
      { alg: -257, type: 'public-key' },
    ],
    timeout: 60_000,
    attestation: 'none',
    excludeCredentials: [
      {
        id: 'Xfo96lb073r7xKvCF3fTEg',
        transports: ['hybrid', 'internal'],
        type: 'public-key',
      },
    ],
    authenticatorSelection: {
      requireResidentKey: true,
      residentKey: 'required',
      userVerification: 'required',
    },
    extensions: {
      credProps: true,
    },
    hints: [],
  };

export const mockPasskeyRequestOptions: PublicKeyCredentialRequestOptionsJSON =
  {
    rpId: location.hostname,
    challenge: '5Hl-eJcWE1L0G-6hOrCY2vMWIjzwBjbqn5T91DtSKbw',
    allowCredentials: [
      {
        id: 'Xfo96lb073r7xKvCF3fTEg',
        transports: ['hybrid', 'internal'],
        type: 'public-key',
      },
    ],
    timeout: 60_000,
    userVerification: 'required',
  };
