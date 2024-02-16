import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Subject, takeUntil } from 'rxjs';
import { EditorSettingsService } from 'src/app/services/editor-options/editor-options.service';

@Component({
  selector: 'app-editor-options-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatSlideToggleModule,
    ReactiveFormsModule
  ],
  templateUrl: './editor-options-dialog.component.html',
  styleUrl: './editor-options-dialog.component.scss'
})
export class EditorOptionsDialogComponent implements OnInit, OnDestroy {

  private _unsub = new Subject<void>();

  formGroup = new FormGroup({
    spellcheck: new FormControl<boolean>(true)
  });

  constructor(
    private _settingsService: EditorSettingsService
  ) { }

  ngOnInit(): void {
    this.formGroup.setValue({
      spellcheck: this._settingsService.getSetting("spellcheck", true)
    });

    this.formGroup.valueChanges.pipe(takeUntil(this._unsub)).subscribe(value => {
      this._settingsService.setSetting("spellcheck", value.spellcheck);
    });
  }

  ngOnDestroy(): void {
    this._unsub.next();
    this._unsub.complete();
  }
}
