import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyEmailComponent } from './verify-email.component';

describe('VerifyEmailComponent', () => {
  let verifyEmailComponent: VerifyEmailComponent;
  let fixture: ComponentFixture<VerifyEmailComponent>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let rootElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyEmailComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyEmailComponent);
    verifyEmailComponent = fixture.componentInstance;
    rootElement = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(verifyEmailComponent).toBeTruthy();
  });
});
