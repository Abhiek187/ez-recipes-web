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
import { mockChef } from '../models/profile.mock';
import Constants from '../constants/constants';
import { environment } from 'src/environments/environment';

describe('ChefService', () => {
  let chefService: ChefService;
  let httpTestingController: HttpTestingController;

  const baseUrl = `${environment.serverBaseUrl}${Constants.chefsPath}`;
  const mockError = new ProgressEvent('error');
  const mockErrorMessage = `Http failure response for ${baseUrl}: 0 `;

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

    await expectAsync(chefPromise).toBeRejectedWithError(mockErrorMessage);
  });
});
