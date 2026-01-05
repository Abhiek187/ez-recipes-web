import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DialogComponent, DialogData } from './dialog.component';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let rootElement: HTMLElement;

  const dialogData: DialogData = {
    title: 'Title',
    message: 'This is a test',
    dismissText: 'Back',
    confirmText: 'Continue',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: dialogData,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    rootElement = fixture.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(rootElement.textContent).toContain(dialogData.title);
    expect(rootElement.textContent).toContain(dialogData.message);
    expect(rootElement.textContent).toContain(dialogData.dismissText);
    expect(rootElement.textContent).toContain(dialogData.confirmText);
  });
});
