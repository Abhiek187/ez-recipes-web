import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TermsService } from './terms.service';
import Term from '../models/term.model';
import Constants from '../constants/constants';
import { mockTerms } from '../models/term.mock';
import {
  mockDate,
  mockTermStore,
  mockTermStoreStr,
} from '../models/term-store.mock';

describe('TermsService', () => {
  let termsService: TermsService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  const testUrl = Constants.termsPath;
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
    httpClient = TestBed.inject(HttpClient);
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

  it('should fetch all the terms', () => {
    // Check that getTerms returns an array of mock terms
    httpClient
      .get<Term[]>(testUrl)
      .subscribe((data) => expect(data).toBe(mockTerms));

    const req = httpTestingController.expectOne(testUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTerms);
  });

  it('should return an error if the terms API fails', () => {
    // Check that getTerms returns an error if the request failed
    const mockError = new ProgressEvent('error');

    httpClient.get<Term[]>(testUrl).subscribe({
      next: () => fail('should have failed with the network error'),
      error: (error: HttpErrorResponse) => {
        expect(error.error).toBe(mockError);
      },
    });

    const req = httpTestingController.expectOne(testUrl);
    req.error(mockError);
  });

  it('should return the mock terms', (done) => {
    // Check that getMockTerms returns an array of mock terms
    termsService.getMockTerms().subscribe((data) => {
      expect(data).toBe(mockTerms);
      done();
    });
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
