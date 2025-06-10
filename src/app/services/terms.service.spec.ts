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

import { TermsService } from './terms.service';
import Constants from '../constants/constants';
import { mockTerms } from '../models/term.mock';
import {
  mockDate,
  mockTermStore,
  mockTermStoreStr,
} from '../models/term-store.mock';
import { environment } from 'src/environments/environment';

describe('TermsService', () => {
  let termsService: TermsService;
  let httpTestingController: HttpTestingController;

  const baseUrl = `${environment.serverBaseUrl}${Constants.termsPath}`;
  const mockError = new ProgressEvent('error');
  const mockErrorMessage =
    'An unexpected error occurred. The server may be down or there may be network issues. ' +
    'Please try again later.';
  const localStorageProto = Object.getPrototypeOf(localStorage);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    termsService = TestBed.inject(TermsService);
    httpTestingController = TestBed.inject(HttpTestingController);

    // Mock dates to prevent tests from failing by a second
    jasmine.clock().install();
    jasmine.clock().mockDate(mockDate);
  });

  afterEach(() => {
    httpTestingController.verify();
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(termsService).toBeTruthy();
  });

  it('should fetch all the terms', async () => {
    // Check that getTerms returns an array of mock terms
    const termsPromise = firstValueFrom(termsService.getTerms());

    const req = httpTestingController.expectOne({
      method: 'GET',
      url: baseUrl,
    });
    req.flush(mockTerms);

    await expectAsync(termsPromise).toBeResolvedTo(mockTerms);
  });

  it('should return an error if the terms API fails', async () => {
    // Check that getTerms returns an error if the request failed
    const termsPromise = firstValueFrom(termsService.getTerms());

    const req = httpTestingController.expectOne({
      method: 'GET',
      url: baseUrl,
    });
    req.error(mockError);

    await expectAsync(termsPromise).toBeRejectedWithError(mockErrorMessage);
  });

  it('should return null if no terms are stored in localStorage', () => {
    spyOn(localStorageProto, 'getItem').and.returnValue(null);
    expect(termsService.getCachedTerms()).toBeNull();
  });

  it('should return null if the terms have expired', () => {
    spyOn(localStorageProto, 'getItem').and.returnValue(
      mockTermStoreStr(Date.now() - 1)
    );
    expect(termsService.getCachedTerms()).toBeNull();
  });

  it("should return all the cached terms if they're valid", () => {
    spyOn(localStorageProto, 'getItem').and.returnValue(mockTermStoreStr());
    expect(termsService.getCachedTerms()).toEqual(mockTermStore().terms);
  });

  it('should store all terms in localStorage', () => {
    spyOn(localStorageProto, 'setItem').and.callThrough();
    termsService.saveTerms(mockTerms);
    expect(localStorageProto.setItem).toHaveBeenCalledWith(
      Constants.LocalStorage.terms,
      mockTermStoreStr()
    );
  });
});
