import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';

import { SignUpComponent } from './sign-up.component';
import { ChefService } from 'src/app/services/chef.service';

describe('SignUpComponent', () => {
  let signUpComponent: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let rootElement: HTMLElement;
  let router: Router;
  let mockChefService: jasmine.SpyObj<ChefService>;

  beforeEach(async () => {
    mockChefService = jasmine.createSpyObj('ChefService', [
      'createChef',
      'verifyEmail',
    ]);

    await TestBed.configureTestingModule({
      imports: [SignUpComponent, RouterModule.forRoot([])],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ChefService,
          useValue: mockChefService,
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(SignUpComponent);
    signUpComponent = fixture.componentInstance;
    rootElement = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(signUpComponent).toBeTruthy();
    expect(rootElement.textContent).toContain('Sign Up');
    expect(rootElement.textContent).toContain('Sign In');
    expect(rootElement.textContent).toContain('Email');
    expect(rootElement.textContent).toContain('Password');
    expect(rootElement.textContent).toContain('Confirm Password');
    expect(rootElement.textContent).toContain(
      'Password must be at least 8 characters long'
    );
  });
});
