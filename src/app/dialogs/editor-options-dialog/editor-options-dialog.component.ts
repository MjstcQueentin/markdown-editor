import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Subject, takeUntil } from 'rxjs';
import { EditorSettingsService } from 'src/app/services/editor-options/editor-options.service';

@Component({
  selector: 'app-editor-options-dialog',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatSlideToggleModule,
    ReactiveFormsModule
  ],
  templateUrl: './editor-options-dialog.component.html',
  styleUrl: './editor-options-dialog.component.scss'
})
export class EditorOptionsDialogComponent implements OnInit, OnDestroy {

  private _unsub = new Subject<void>();

  formGroup = new FormGroup({
    spellcheck: new FormControl<boolean>(true),
    forceAltText: new FormControl<boolean>(false)
  });

  constructor(
    public dialogRef: MatDialogRef<EditorOptionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {},
    private _settingsService: EditorSettingsService
  ) { }

  ngOnInit(): void {
    this.formGroup.setValue({
      spellcheck: this._settingsService.getSetting("spellcheck", true),
      forceAltText: this._settingsService.getSetting("forceAltText", false)
    });

    this.formGroup.valueChanges.pipe(takeUntil(this._unsub)).subscribe(value => {
      this._settingsService.setSetting("spellcheck", value.spellcheck);
      this._settingsService.setSetting("forceAltText", value.forceAltText);
    });
  }

  ngOnDestroy(): void {
    this._unsub.next();
    this._unsub.complete();
  }
}
