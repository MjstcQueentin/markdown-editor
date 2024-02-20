import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-table-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './add-table-dialog.component.html',
  styleUrl: './add-table-dialog.component.scss'
})
export class AddTableDialogComponent {
  formGroup = new FormGroup({
    columns: new FormControl<number>(3, [Validators.required, Validators.min(1)]),
    rows: new FormControl<number>(3, [Validators.required, Validators.min(1)])
  });

  constructor(
    public dialogRef: MatDialogRef<AddTableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {}
  ) { }

  closeWithData(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dialogRef.close(this.formGroup.value);
    }
  }
}
