import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasskeyButtonComponent } from './passkey-button.component';

describe('PasskeyButtonComponent', () => {
  let component: PasskeyButtonComponent;
  let fixture: ComponentFixture<PasskeyButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasskeyButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasskeyButtonComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
