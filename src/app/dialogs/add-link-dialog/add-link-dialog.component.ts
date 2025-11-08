
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-link-dialog',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
],
  templateUrl: './add-link-dialog.component.html',
  styleUrl: './add-link-dialog.component.scss'
})
export class AddLinkDialogComponent {
  private readonly urlRegex = /^\w+\:\/\/.+$/i;

  formGroup = new FormGroup({
    link: new FormControl<string>("", [Validators.required, Validators.pattern(this.urlRegex)]),
    title: new FormControl<string>("", [Validators.required])
  });

  constructor(
    public dialogRef: MatDialogRef<AddLinkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      selectedText?: string;
    }
  ) {
    if (data.selectedText) {
      if (this.urlRegex.test(data.selectedText)) {
        this.formGroup.get('link')?.setValue(data.selectedText);
      } else {
        this.formGroup.get('title')?.setValue(data.selectedText);
      }
    }
  }

  closeWithData(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dialogRef.close(this.formGroup.value);
    }
  }
}
