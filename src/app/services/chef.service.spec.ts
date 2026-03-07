import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { expect, vi } from 'vitest';

import { ChefService } from './chef.service';
import {
  mockAuthUrls,
  mockChef,
  mockChefEmailResponse,
  mockLoginResponse,
  mockPasskeyCreationOptions,
  mockPasskeyRequestOptions,
} from '../models/profile.mock';
import Constants from '../constants/constants';
import { environment } from 'src/environments/environment';
import {
  ChefUpdate,
  ChefUpdateType,
  LoginCredentials,
  Provider,
} from '../models/profile.model';
import { mockToken } from '../models/recipe.mock';

describe('ChefService', () => {
  let chefService: ChefService;
  let httpTestingController: HttpTestingController;

  const baseUrl = `${environment.serverBaseUrl}${Constants.chefsPath}`;
  const mockError = new ProgressEvent('error');
  const mockErrorMessage =
    'An unexpected error occurred. The server may be down or there may be network issues. ' +
    'Please try again later.';

  const mockLocalStorage = (token: string | null = mockChef.token) => {
    const localStorageProto = Object.getPrototypeOf(localStorage);
    vi.spyOn(localStorageProto, 'getItem').mockReturnValue(token);
    vi.spyOn(localStorageProto, 'setItem').mockImplementation(() => undefined);
    vi.spyOn(localStorageProto, 'removeItem').mockImplementation(
      () => undefined,
    );
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    chefService = TestBed.inject(ChefService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(chefService).toBeTruthy();
  });

  it('should get a chef', async () => {
    mockLocalStorage();
    const chefPromise = firstValueFrom(chefService.getChef());

    const req = httpTestingController.expectOne({
      method: 'GET',
      url: baseUrl,
    });
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${mockChef.token}`,
    );
    req.flush(mockChef);

    await expect(chefPromise).resolves.toBe(mockChef);
    expect(chefService.chef()).toBe(mockChef);
  });

  it('should return an error if the GET chef API fails', async () => {
    mockLocalStorage();
    const chefPromise = firstValueFrom(chefService.getChef());

    const req = httpTestingController.expectOne({
      method: 'GET',
      url: baseUrl,
    });
    req.error(mockError);

    await expect(chefPromise).rejects.toThrowError(mockErrorMessage);
    expect(chefService.chef()).toBeUndefined();
  });

  it('should create a chef', async () => {
    mockLocalStorage();
    const credentials: LoginCredentials = {
      email: mockChef.email,
      password: 'password',
    };
    const chefPromise = firstValueFrom(chefService.createChef(credentials));

    const req = httpTestingController.expectOne({
      method: 'POST',
      url: baseUrl,
    });
    expect(req.request.headers.get('Authorization')).toBeNull();
    expect(req.request.body).toBe(credentials);
    const loginResponse = mockLoginResponse(false);
    req.flush(loginResponse);

    await expect(chefPromise).resolves.toBe(loginResponse);
    expect(chefService.chef()).toEqual({
      uid: loginResponse.uid,
      email: credentials.email,
      emailVerified: false,
      providerData: [],
      passkeys: [],
      ratings: {},
      recentRecipes: {},
      favoriteRecipes: [],
      token: loginResponse.token,
    });
  });

  it('should return an error if the POST chef API fails', async () => {
    const credentials: LoginCredentials = {
      email: mockChef.email,
      password: 'password',
    };
    mockLocalStorage();
    const chefPromise = firstValueFrom(chefService.createChef(credentials));

    const req = httpTestingController.expectOne({
      method: 'POST',
      url: baseUrl,
    });
    req.error(mockError);

    await expect(chefPromise).rejects.toThrowError(mockErrorMessage);
    expect(chefService.chef()).toBeUndefined();
  });

  it('should update a chef', async () => {
    const fields: ChefUpdate = {
      type: ChefUpdateType.Password,
      email: mockChef.email,
      password: 'newpassword',
    };
    mockLocalStorage();
    const chefPromise = firstValueFrom(chefService.updateChef(fields));

    const req = httpTestingController.expectOne({
      method: 'PATCH',
      url: baseUrl,
    });
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${mockChef.token}`,
    );
    expect(req.request.body).toBe(fields);
    req.flush(mockChefEmailResponse);

    await expect(chefPromise).resolves.toBe(mockChefEmailResponse);
  });

  it('should update a chef without a token', async () => {
    const fields: ChefUpdate = {
      type: ChefUpdateType.Password,
      email: mockChef.email,
    };
    mockLocalStorage(null);
    const chefPromise = firstValueFrom(chefService.updateChef(fields));

    const req = httpTestingController.expectOne({
      method: 'PATCH',
      url: baseUrl,
    });
    expect(req.request.headers.get('Authorization')).toBeNull();
    expect(req.request.body).toBe(fields);
    req.flush(mockChefEmailResponse);

    await expect(chefPromise).resolves.toBe(mockChefEmailResponse);
  });

  it('should return an error if the PATCH chef API fails', async () => {
    const fields: ChefUpdate = {
      type: ChefUpdateType.Email,
      email: mockChef.email,
    };
    mockLocalStorage();
    const chefPromise = firstValueFrom(chefService.updateChef(fields));

    const req = httpTestingController.expectOne({
      method: 'PATCH',
      url: baseUrl,
    });
    req.error(mockError);

    await expect(chefPromise).rejects.toThrowError(mockErrorMessage);
  });

  it('should delete a chef', async () => {
    mockLocalStorage();
    const chefPromise = firstValueFrom(chefService.deleteChef());

    const req = httpTestingController.expectOne({
      method: 'DELETE',
      url: baseUrl,
    });
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${mockChef.token}`,
    );
    req.flush(null);

    await expect(chefPromise).resolves.toBe(null);
    expect(chefService.chef()).toBeUndefined();
  });

  it('should return an error if the DELETE chef API fails', async () => {
    mockLocalStorage();
    const chefPromise = firstValueFrom(chefService.deleteChef());

    const req = httpTestingController.expectOne({
      method: 'DELETE',
      url: baseUrl,
    });
    req.error(mockError);

    await expect(chefPromise).rejects.toThrowError(mockErrorMessage);
    expect(chefService.chef()).toBeUndefined();
  });

  it('should verify an email', async () => {
    mockLocalStorage();
    const chefPromise = firstValueFrom(chefService.verifyEmail());

    const req = httpTestingController.expectOne({
      method: 'POST',
      url: `${baseUrl}/verify`,
    });
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${mockChef.token}`,
    );
    expect(req.request.body).toBeNull();
    req.flush(mockChefEmailResponse);

    await expect(chefPromise).resolves.toBe(mockChefEmailResponse);
  });

  it('should return an error if the verify email API fails', async () => {
    mockLocalStorage();
    const chefPromise = firstValueFrom(chefService.verifyEmail());

    const req = httpTestingController.expectOne({
      method: 'POST',
      url: `${baseUrl}/verify`,
    });
    req.error(mockError);

    await expect(chefPromise).rejects.toThrowError(mockErrorMessage);
  });

  it('should login', async () => {
    const credentials: LoginCredentials = {
      email: mockChef.email,
      password: 'password',
    };
    mockLocalStorage();
    const chefPromise = firstValueFrom(chefService.login(credentials));

    const req = httpTestingController.expectOne({
      method: 'POST',
      url: `${baseUrl}/login`,
    });
    expect(req.request.headers.get('Authorization')).toBeNull();
    expect(req.request.body).toBe(credentials);
    const loginResponse = mockLoginResponse();
    req.flush(loginResponse);

    await expect(chefPromise).resolves.toBe(loginResponse);
    expect(chefService.chef()).toEqual({
      uid: loginResponse.uid,
      email: credentials.email,
      emailVerified: true,
      providerData: [],
      passkeys: [],
      ratings: {},
      recentRecipes: {},
      favoriteRecipes: [],
      token: loginResponse.token,
    });
  });

  it('should return an error if the login API fails', async () => {
    const credentials: LoginCredentials = {
      email: mockChef.email,
      password: 'password',
    };
    mockLocalStorage();
    const chefPromise = firstValueFrom(chefService.login(credentials));

    const req = httpTestingController.expectOne({
      method: 'POST',
      url: `${baseUrl}/login`,
    });
    req.error(mockError);

    await expect(chefPromise).rejects.toThrowError(mockErrorMessage);
    expect(chefService.chef()).toBeUndefined();
  });

  it('should logout', async () => {
    mockLocalStorage();
    const chefPromise = firstValueFrom(chefService.logout());

    const req = httpTestingController.expectOne({
      method: 'POST',
      url: `${baseUrl}/logout`,
    });
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${mockChef.token}`,
    );
    expect(req.request.body).toBeNull();
    req.flush(null);

    await expect(chefPromise).resolves.toBe(null);
    expect(chefService.chef()).toBeUndefined();
  });

  it('should return an error if the logout API fails', async () => {
    mockLocalStorage();
    const chefPromise = firstValueFrom(chefService.logout());

    const req = httpTestingController.expectOne({
      method: 'POST',
      url: `${baseUrl}/logout`,
    });
    req.error(mockError);

    await expect(chefPromise).rejects.toThrowError(mockErrorMessage);
    expect(chefService.chef()).toBeUndefined();
  });

  it('should return all the auth URLs', async () => {
    mockLocalStorage();
    const chefPromise = firstValueFrom(chefService.getAuthUrls());

    const req = httpTestingController.expectOne({
      method: 'GET',
      url: `${baseUrl}/oauth?redirectUrl=${Constants.redirectUrl}`,
    });
    req.flush(mockAuthUrls);

    await expect(chefPromise).resolves.toBe(mockAuthUrls);
  });

  it('should return an error if the auth URL API fails', async () => {
    mockLocalStorage();
    const chefPromise = firstValueFrom(chefService.getAuthUrls());

    const req = httpTestingController.expectOne({
      method: 'GET',
      url: `${baseUrl}/oauth?redirectUrl=${Constants.redirectUrl}`,
    });
    req.error(mockError);

    await expect(chefPromise).rejects.toThrowError(mockErrorMessage);
  });

  it('should login with an OAuth provider without a token', async () => {
    const oAuthRequest: Parameters<typeof chefService.loginWithOAuth>[0] = {
      code: 'code',
      providerId: Provider.Google,
    };
    mockLocalStorage(null);
    const chefPromise = firstValueFrom(
      chefService.loginWithOAuth(oAuthRequest),
    );

    const oauthReq = httpTestingController.expectOne({
      method: 'POST',
      url: `${baseUrl}/oauth`,
    });
    expect(oauthReq.request.headers.get('Authorization')).toBeNull();
    expect(oauthReq.request.body).toStrictEqual({
      ...oAuthRequest,
      redirectUrl: Constants.redirectUrl,
    });
    const loginResponse = mockLoginResponse();
    oauthReq.flush(loginResponse);

    // Since localStorage is mocked to not have a token, GET chef fails in this case
    await expect(chefPromise).rejects.toThrowError(Constants.noTokenFound);
  });

  it('should link an OAuth provider with a token', async () => {
    const oAuthRequest: Parameters<typeof chefService.loginWithOAuth>[0] = {
      code: 'code',
      providerId: Provider.Google,
    };
    mockLocalStorage();
    const chefPromise = firstValueFrom(
      chefService.loginWithOAuth(oAuthRequest),
    );

    const oauthReq = httpTestingController.expectOne({
      method: 'POST',
      url: `${baseUrl}/oauth`,
    });
    expect(oauthReq.request.headers.get('Authorization')).toBe(
      `Bearer ${mockChef.token}`,
    );
    expect(oauthReq.request.body).toStrictEqual({
      ...oAuthRequest,
      redirectUrl: Constants.redirectUrl,
    });
    const loginResponse = mockLoginResponse();
    oauthReq.flush(loginResponse);

    const chefReq = httpTestingController.expectOne({
      method: 'GET',
      url: baseUrl,
    });
    expect(chefReq.request.headers.get('Authorization')).toBe(
      `Bearer ${mockChef.token}`,
    );
    chefReq.flush(mockChef);

    await expect(chefPromise).resolves.toBe(mockChef);
    expect(chefService.chef()).toBe(mockChef);
  });

  it('should return an error if the OAuth login API fails', async () => {
    const oAuthRequest: Parameters<typeof chefService.loginWithOAuth>[0] = {
      code: 'code',
      providerId: Provider.Google,
    };
    mockLocalStorage();
    const chefPromise = firstValueFrom(
      chefService.loginWithOAuth(oAuthRequest),
    );

    const req = httpTestingController.expectOne({
      method: 'POST',
      url: `${baseUrl}/oauth`,
    });
    req.error(mockError);

    await expect(chefPromise).rejects.toThrowError(mockErrorMessage);
  });

  it('should unlink an OAuth provider', async () => {
    const provider = Provider.Facebook;
    mockLocalStorage();
    const chefPromise = firstValueFrom(
      chefService.unlinkOAuthProvider(provider),
    );

    const oauthReq = httpTestingController.expectOne({
      method: 'DELETE',
      url: `${baseUrl}/oauth?providerId=${provider}`,
    });
    expect(oauthReq.request.headers.get('Authorization')).toBe(
      `Bearer ${mockChef.token}`,
    );
    oauthReq.flush(mockToken);

    const chefReq = httpTestingController.expectOne({
      method: 'GET',
      url: baseUrl,
    });
    expect(chefReq.request.headers.get('Authorization')).toBe(
      `Bearer ${mockChef.token}`,
    );
    chefReq.flush(mockChef);

    await expect(chefPromise).resolves.toBe(mockChef);
    expect(chefService.chef()).toBe(mockChef);
  });

  it('should return an error if the unlink OAuth API fails', async () => {
    const provider = Provider.Facebook;
    mockLocalStorage();
    const chefPromise = firstValueFrom(
      chefService.unlinkOAuthProvider(provider),
    );

    const req = httpTestingController.expectOne({
      method: 'DELETE',
      url: `${baseUrl}/oauth?providerId=${provider}`,
    });
    req.error(mockError);

    await expect(chefPromise).rejects.toThrowError(mockErrorMessage);
    expect(chefService.chef()).toBeUndefined();
  });

  it('should get a new passkey challenge', async () => {
    mockLocalStorage();
    const chefPromise = firstValueFrom(chefService.getNewPasskeyChallenge());

    const req = httpTestingController.expectOne({
      method: 'GET',
      url: `${baseUrl}/passkey/create`,
    });
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${mockChef.token}`,
    );
    req.flush(mockPasskeyCreationOptions);

    await expect(chefPromise).resolves.toBe(mockPasskeyCreationOptions);
  });

  it('should return an error if the create passkey challenge API fails', async () => {
    mockLocalStorage();
    const chefPromise = firstValueFrom(chefService.getNewPasskeyChallenge());

    const req = httpTestingController.expectOne({
      method: 'GET',
      url: `${baseUrl}/passkey/create`,
    });
    req.error(mockError);

    await expect(chefPromise).rejects.toThrowError(mockErrorMessage);
  });

  it('should get an existing passkey challenge', async () => {
    const email = 'test@example.com';
    const chefPromise = firstValueFrom(
      chefService.getExistingPasskeyChallenge(email),
    );

    const req = httpTestingController.expectOne({
      method: 'GET',
      url: `${baseUrl}/passkey/auth?email=${email}`,
    });
    req.flush(mockPasskeyRequestOptions);

    await expect(chefPromise).resolves.toBe(mockPasskeyRequestOptions);
  });

  it('should return an error if the existing passkey challenge API fails', async () => {
    const email = 'test@example.com';
    const chefPromise = firstValueFrom(
      chefService.getExistingPasskeyChallenge(email),
    );

    const req = httpTestingController.expectOne({
      method: 'GET',
      url: `${baseUrl}/passkey/auth?email=${email}`,
    });
    req.error(mockError);

    await expect(chefPromise).rejects.toThrowError(mockErrorMessage);
  });

  it('should validate a new passkey', async () => {
    const credential: Credential = {
      id: 'abc123',
      type: 'public-key',
    };
    mockLocalStorage();
    const chefPromise = firstValueFrom(chefService.validatePasskey(credential));

    const validateReq = httpTestingController.expectOne({
      method: 'POST',
      url: `${baseUrl}/passkey/verify`,
    });
    expect(validateReq.request.headers.get('Authorization')).toBe(
      `Bearer ${mockChef.token}`,
    );
    expect(validateReq.request.body).toStrictEqual(credential);
    validateReq.flush(mockToken);

    const chefReq = httpTestingController.expectOne({
      method: 'GET',
      url: baseUrl,
    });
    expect(chefReq.request.headers.get('Authorization')).toBe(
      `Bearer ${mockChef.token}`,
    );
    chefReq.flush(mockChef);

    await expect(chefPromise).resolves.toBe(mockChef);
    expect(chefService.chef()).toBe(mockChef);
  });

  it('should validate an existing passkey', async () => {
    const credential: Credential = {
      id: 'abc123',
      type: 'public-key',
    };
    const email = 'test@example.com';
    mockLocalStorage();
    const chefPromise = firstValueFrom(
      chefService.validatePasskey(credential, email),
    );

    const validateReq = httpTestingController.expectOne({
      method: 'POST',
      url: `${baseUrl}/passkey/verify?email=${email}`,
    });
    expect(validateReq.request.headers.get('Authorization')).toBe(
      `Bearer ${mockChef.token}`,
    );
    expect(validateReq.request.body).toStrictEqual(credential);
    validateReq.flush(mockToken);

    const chefReq = httpTestingController.expectOne({
      method: 'GET',
      url: baseUrl,
    });
    expect(chefReq.request.headers.get('Authorization')).toBe(
      `Bearer ${mockChef.token}`,
    );
    chefReq.flush(mockChef);

    await expect(chefPromise).resolves.toBe(mockChef);
    expect(chefService.chef()).toBe(mockChef);
  });

  it('should return an error if the validate passkey API fails', async () => {
    const credential: Credential = {
      id: 'abc123',
      type: 'public-key',
    };
    mockLocalStorage();
    const chefPromise = firstValueFrom(chefService.validatePasskey(credential));

    const req = httpTestingController.expectOne({
      method: 'POST',
      url: `${baseUrl}/passkey/verify`,
    });
    req.error(mockError);

    await expect(chefPromise).rejects.toThrowError(mockErrorMessage);
    expect(chefService.chef()).toBeUndefined();
  });

  it('should delete a passkey', async () => {
    const id = 'abc123';
    mockLocalStorage();
    const chefPromise = firstValueFrom(chefService.deletePasskey(id));

    const deleteReq = httpTestingController.expectOne({
      method: 'DELETE',
      url: `${baseUrl}/passkey?id=${id}`,
    });
    expect(deleteReq.request.headers.get('Authorization')).toBe(
      `Bearer ${mockChef.token}`,
    );
    deleteReq.flush(mockToken);

    const chefReq = httpTestingController.expectOne({
      method: 'GET',
      url: baseUrl,
    });
    expect(chefReq.request.headers.get('Authorization')).toBe(
      `Bearer ${mockChef.token}`,
    );
    chefReq.flush(mockChef);

    await expect(chefPromise).resolves.toBe(mockChef);
    expect(chefService.chef()).toBe(mockChef);
  });

  it('should return an error if the delete passkey API fails', async () => {
    const id = 'abc123';
    mockLocalStorage();
    const chefPromise = firstValueFrom(chefService.deletePasskey(id));

    const req = httpTestingController.expectOne({
      method: 'DELETE',
      url: `${baseUrl}/passkey?id=${id}`,
    });
    req.error(mockError);

    await expect(chefPromise).rejects.toThrowError(mockErrorMessage);
    expect(chefService.chef()).toBeUndefined();
  });
});
