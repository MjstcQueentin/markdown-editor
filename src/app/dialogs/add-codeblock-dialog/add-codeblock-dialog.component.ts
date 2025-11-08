
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-add-codeblock-dialog',
    imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
],
    templateUrl: './add-codeblock-dialog.component.html',
    styleUrl: './add-codeblock-dialog.component.scss'
})
export class AddCodeblockDialogComponent {
  formGroup = new FormGroup({
    language: new FormControl<string>(""),
    code: new FormControl<string>("", [Validators.required]),
  });

  constructor(
    public dialogRef: MatDialogRef<AddCodeblockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {}
  ) { }

  closeWithData(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dialogRef.close(this.formGroup.value);
    }
  }
}
