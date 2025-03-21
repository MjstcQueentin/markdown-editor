import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EditorSettingsService } from 'src/app/services/editor-options/editor-options.service';

@Component({
  selector: 'app-add-image-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule
  ],
  templateUrl: './add-image-dialog.component.html',
  styleUrl: './add-image-dialog.component.scss'
})
export class AddImageDialogComponent {
  formGroup = new FormGroup({
    link: new FormControl<string>("", [Validators.required]),
    alt: new FormControl<string>(""),
    title: new FormControl<string>("")
  });

  constructor(
    public dialogRef: MatDialogRef<AddImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {},
    private _editorSettings: EditorSettingsService
  ) {
    if (this._editorSettings.getSetting("forceAltText", false)) {
      this.formGroup.get('alt')?.addValidators(Validators.required);
    }
  }

  closeWithData(): void {
    this.formGroup.markAllAsTouched();
    if (this.formGroup.valid) {
      this.dialogRef.close(this.formGroup.value);
    }
  }
}
