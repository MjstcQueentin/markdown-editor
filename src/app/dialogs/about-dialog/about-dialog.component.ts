
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-about-dialog',
    imports: [
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule
],
    templateUrl: './about-dialog.component.html',
    styleUrl: './about-dialog.component.scss'
})
export class AboutDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AboutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {}
  ) { }
}
