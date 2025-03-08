import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
    selector: 'app-add-list-dialog',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatTableModule
    ],
    templateUrl: './add-list-dialog.component.html',
    styleUrl: './add-list-dialog.component.scss'
})
export class AddListDialogComponent {
  formArray = new FormArray([
    new FormControl<string>("")
  ]);

  constructor(
    public dialogRef: MatDialogRef<AddListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type: "bulleted" | "numbered" }
  ) { }

  addLine(): void {
    this.formArray.controls = this.formArray.controls.concat(new FormControl());
  }

  removeLine(at: number) {
    this.formArray.controls = this.formArray.controls.slice(0, at).concat(this.formArray.controls.slice(at + 1));
  }

  closeWithData(): void {
    if (this.formArray.value) {
      this.dialogRef.close(this.formArray.controls.map(c => c.value ?? ""));
    }
  }
}
