import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

export interface DialogData {
  title?: string;
  message: string;
  dismissText?: string;
  confirmText?: string;
  isConfirmDestructive?: boolean;
}

@Component({
  selector: 'app-dialog',
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  private dialogData = inject<DialogData>(MAT_DIALOG_DATA);

  readonly title = this.dialogData.title;
  readonly message = this.dialogData.message;
  readonly dismissText = this.dialogData.dismissText;
  readonly confirmText = this.dialogData.confirmText ?? 'OK';
  readonly isConfirmDestructive = this.dialogData.isConfirmDestructive ?? false;
}
