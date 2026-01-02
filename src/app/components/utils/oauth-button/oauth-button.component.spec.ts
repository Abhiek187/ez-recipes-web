import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OauthButtonComponent } from './oauth-button.component';

describe('OauthButtonComponent', () => {
  let component: OauthButtonComponent;
  let fixture: ComponentFixture<OauthButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OauthButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OauthButtonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
