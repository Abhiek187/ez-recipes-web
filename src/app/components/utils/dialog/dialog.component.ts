import { Component, inject, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface DialogData {
  title?: string;
  message?: string;
  input?: string;
  inputLabel?: string;
  dismissText?: string;
  confirmText?: string;
  isConfirmDestructive?: boolean;
}

export interface DialogResult {
  didConfirm: boolean;
  input?: string;
}

@Component({
  selector: 'app-dialog',
  imports: [
    FormField,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  private dialogData = inject<DialogData>(MAT_DIALOG_DATA);

  readonly title = this.dialogData.title;
  readonly message = this.dialogData.message;
  readonly input = this.dialogData.input;
  readonly inputLabel = this.dialogData.inputLabel;
  readonly dismissText = this.dialogData.dismissText;
  readonly confirmText = this.dialogData.confirmText ?? 'OK';
  readonly isConfirmDestructive = this.dialogData.isConfirmDestructive ?? false;

  // Pre-fill input if provided
  private _input = signal(this.input ?? '');
  inputForm = form(this._input, (_input) => {
    // Ignore validations if no input was provided
    if (this.input !== undefined) {
      required(_input, { message: 'This field is required' });
    }
  });
}
