import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { TermsService } from './terms.service';
import Term from '../models/term.model';
import Constants from '../constants/constants';
import { mockTerms } from '../models/term.mock';

describe('TermsService', () => {
  let termsService: TermsService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  const testUrl = Constants.termsPath;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    termsService = TestBed.inject(TermsService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
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

  it('should return the mock terms', () => {
    // Check that getMockTerms returns an array of mock terms
    termsService
      .getMockTerms()
      .subscribe((data) => expect(data).toBe(mockTerms));
  });
});
