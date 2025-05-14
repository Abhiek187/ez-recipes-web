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

import { ChefService } from './chef.service';
import {
  mockChef,
  mockChefEmailResponse,
  mockLoginResponse,
} from '../models/profile.mock';
import Constants from '../constants/constants';
import { environment } from 'src/environments/environment';
import {
  ChefUpdate,
  ChefUpdateType,
  LoginCredentials,
} from '../models/profile.model';

describe('ChefService', () => {
  let chefService: ChefService;
  let httpTestingController: HttpTestingController;

  const baseUrl = `${environment.serverBaseUrl}${Constants.chefsPath}`;
  const mockError = new ProgressEvent('error');
  const mockErrorMessage = (url: string) =>
    `Http failure response for ${url}: 0 `;

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
    const chefPromise = firstValueFrom(chefService.getChef(mockChef.token));

    const req = httpTestingController.expectOne({
      method: 'GET',
      url: baseUrl,
    });
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${mockChef.token}`
    );
    req.flush(mockChef);

    await expectAsync(chefPromise).toBeResolvedTo(mockChef);
  });

  it('should return an error if the GET chef API fails', async () => {
    const chefPromise = firstValueFrom(chefService.getChef(mockChef.token));

    const req = httpTestingController.expectOne({
      method: 'GET',
      url: baseUrl,
    });
    req.error(mockError);

    await expectAsync(chefPromise).toBeRejectedWithError(
      mockErrorMessage(baseUrl)
    );
  });

  it('should create a chef', async () => {
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
    req.flush(mockLoginResponse());

    await expectAsync(chefPromise).toBeResolvedTo(mockLoginResponse());
  });

  it('should return an error if the POST chef API fails', async () => {
    const credentials: LoginCredentials = {
      email: mockChef.email,
      password: 'password',
    };
    const chefPromise = firstValueFrom(chefService.createChef(credentials));

    const req = httpTestingController.expectOne({
      method: 'POST',
      url: baseUrl,
    });
    req.error(mockError);

    await expectAsync(chefPromise).toBeRejectedWithError(
      mockErrorMessage(baseUrl)
    );
  });

  it('should update a chef', async () => {
    const fields: ChefUpdate = {
      type: ChefUpdateType.Password,
      email: mockChef.email,
      password: 'newpassword',
    };
    const chefPromise = firstValueFrom(
      chefService.updateChef(fields, mockChef.token)
    );

    const req = httpTestingController.expectOne({
      method: 'PATCH',
      url: baseUrl,
    });
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${mockChef.token}`
    );
    expect(req.request.body).toBe(fields);
    req.flush(mockChefEmailResponse);

    await expectAsync(chefPromise).toBeResolvedTo(mockChefEmailResponse);
  });

  it('should update a chef without a token', async () => {
    const fields: ChefUpdate = {
      type: ChefUpdateType.Email,
      email: mockChef.email,
    };
    const chefPromise = firstValueFrom(chefService.updateChef(fields));

    const req = httpTestingController.expectOne({
      method: 'PATCH',
      url: baseUrl,
    });
    expect(req.request.headers.get('Authorization')).toBeNull();
    expect(req.request.body).toBe(fields);
    req.flush(mockChefEmailResponse);

    await expectAsync(chefPromise).toBeResolvedTo(mockChefEmailResponse);
  });

  it('should return an error if the PATCH chef API fails', async () => {
    const fields: ChefUpdate = {
      type: ChefUpdateType.Email,
      email: mockChef.email,
    };
    const chefPromise = firstValueFrom(chefService.updateChef(fields));

    const req = httpTestingController.expectOne({
      method: 'PATCH',
      url: baseUrl,
    });
    req.error(mockError);

    await expectAsync(chefPromise).toBeRejectedWithError(
      mockErrorMessage(baseUrl)
    );
  });

  it('should delete a chef', async () => {
    const chefPromise = firstValueFrom(chefService.deleteChef(mockChef.token));

    const req = httpTestingController.expectOne({
      method: 'DELETE',
      url: baseUrl,
    });
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${mockChef.token}`
    );
    req.flush(null);

    await expectAsync(chefPromise).toBeResolvedTo(null);
  });

  it('should return an error if the DELETE chef API fails', async () => {
    const chefPromise = firstValueFrom(chefService.deleteChef(mockChef.token));

    const req = httpTestingController.expectOne({
      method: 'DELETE',
      url: baseUrl,
    });
    req.error(mockError);

    await expectAsync(chefPromise).toBeRejectedWithError(
      mockErrorMessage(baseUrl)
    );
  });

  it('should verify an email', async () => {
    const chefPromise = firstValueFrom(chefService.verifyEmail(mockChef.token));

    const req = httpTestingController.expectOne({
      method: 'POST',
      url: `${baseUrl}/verify`,
    });
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${mockChef.token}`
    );
    expect(req.request.body).toBeNull();
    req.flush(mockChefEmailResponse);

    await expectAsync(chefPromise).toBeResolvedTo(mockChefEmailResponse);
  });

  it('should return an error if the verify email API fails', async () => {
    const chefPromise = firstValueFrom(chefService.verifyEmail(mockChef.token));

    const req = httpTestingController.expectOne({
      method: 'POST',
      url: `${baseUrl}/verify`,
    });
    req.error(mockError);

    await expectAsync(chefPromise).toBeRejectedWithError(
      mockErrorMessage(`${baseUrl}/verify`)
    );
  });

  it('should login', async () => {
    const credentials: LoginCredentials = {
      email: mockChef.email,
      password: 'password',
    };
    const chefPromise = firstValueFrom(chefService.login(credentials));

    const req = httpTestingController.expectOne({
      method: 'POST',
      url: `${baseUrl}/login`,
    });
    expect(req.request.headers.get('Authorization')).toBeNull();
    expect(req.request.body).toBe(credentials);
    req.flush(mockLoginResponse());

    await expectAsync(chefPromise).toBeResolvedTo(mockLoginResponse());
  });

  it('should return an error if the login API fails', async () => {
    const credentials: LoginCredentials = {
      email: mockChef.email,
      password: 'password',
    };
    const chefPromise = firstValueFrom(chefService.login(credentials));

    const req = httpTestingController.expectOne({
      method: 'POST',
      url: `${baseUrl}/login`,
    });
    req.error(mockError);

    await expectAsync(chefPromise).toBeRejectedWithError(
      mockErrorMessage(`${baseUrl}/login`)
    );
  });

  it('should logout', async () => {
    const chefPromise = firstValueFrom(chefService.logout(mockChef.token));

    const req = httpTestingController.expectOne({
      method: 'POST',
      url: `${baseUrl}/logout`,
    });
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${mockChef.token}`
    );
    expect(req.request.body).toBeNull();
    req.flush(null);

    await expectAsync(chefPromise).toBeResolvedTo(null);
  });

  it('should return an error if the logout API fails', async () => {
    const chefPromise = firstValueFrom(chefService.logout(mockChef.token));

    const req = httpTestingController.expectOne({
      method: 'POST',
      url: `${baseUrl}/logout`,
    });
    req.error(mockError);

    await expectAsync(chefPromise).toBeRejectedWithError(
      mockErrorMessage(`${baseUrl}/logout`)
    );
  });
});
