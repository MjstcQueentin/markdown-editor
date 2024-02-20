import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AboutDialogComponent } from './dialogs/about-dialog/about-dialog.component';
import { AddCodeblockDialogComponent } from './dialogs/add-codeblock-dialog/add-codeblock-dialog.component';
import { AddImageDialogComponent } from './dialogs/add-image-dialog/add-image-dialog.component';
import { AddLinkDialogComponent } from './dialogs/add-link-dialog/add-link-dialog.component';
import { AddListDialogComponent } from './dialogs/add-list-dialog/add-list-dialog.component';
import { AddTableDialogComponent } from './dialogs/add-table-dialog/add-table-dialog.component';
import { EditorOptionsDialogComponent } from './dialogs/editor-options-dialog/editor-options-dialog.component';
import { EditorSettingsService } from './services/editor-options/editor-options.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild("text") textarea: ElementRef<HTMLTextAreaElement>;
  formControl = new FormControl<string>("");
  spellcheck: boolean = true;

  screenState: "pad-only" | "result-only" | "both";

  constructor(
    private _dialog: MatDialog,
    private _settingsService: EditorSettingsService
  ) { }

  ngOnInit(): void {
    this.refreshLayout();

    this._settingsService.settings.subscribe(settings => {
      this.spellcheck = settings["spellcheck"] ?? true;
    });
  }

  @HostListener('window:resize', [])
  refreshLayout() {
    this.screenState = window.innerWidth > 720 ? "both" : "pad-only";
  }

  private addConcat(newvalue: string): void {
    this.formControl.setValue((this.formControl.value ?? "").concat("\n", newvalue));
  }

  private addMarkers(marker: string, placeholder: string) {
    const start = this.textarea.nativeElement.selectionStart;
    const end = this.textarea.nativeElement.selectionEnd;
    if (start == end) {
      this.formControl.setValue((this.formControl.value ?? "").concat("\n", `${marker}${placeholder}${marker}`));
    } else {
      this.formControl.setValue(
        (this.formControl.value ?? "").substring(0, start)
          .concat(marker)
          .concat((this.formControl.value ?? "").substring(start, end))
          .concat(marker)
          .concat((this.formControl.value ?? "").substring(end))
      );

      this.textarea.nativeElement.setSelectionRange(end + marker.length, end + marker.length);
    }
  }

  @HostListener('window:keydown.control.b', ['$event'])
  bold(e?: KeyboardEvent): void {
    e?.preventDefault();
    this.addMarkers("**", "bold text here");
  }

  @HostListener('window:keydown.control.i', ['$event'])
  italic(e?: KeyboardEvent): void {
    e?.preventDefault();
    this.addMarkers("*", "italic text here");
  }

  @HostListener('window:keydown.control.shift.x', ['$event'])
  strikethrough(e?: KeyboardEvent): void {
    e?.preventDefault();
    this.addMarkers("~~", "stroked text here");
  }

  quote(): void {
    this.addConcat("> Quote");
    this.textarea.nativeElement.setSelectionRange((this.formControl.value ?? "").length - 5, (this.formControl.value ?? "").length);
    this.textarea.nativeElement.focus();
  }

  @HostListener('window:keydown.control.k', ['$event'])
  link(e?: KeyboardEvent): void {
    e?.preventDefault();
    if (!this._dialog.openDialogs.some(ref => ref.componentInstance instanceof AddLinkDialogComponent)) {
      this._dialog.open(AddLinkDialogComponent).afterClosed().subscribe(dialogResponse => {
        if (dialogResponse) {
          this.addConcat(`[${dialogResponse.title ?? dialogResponse.link}](${dialogResponse.link})`);
        }
      });
    }
  }

  image(): void {
    if (!this._dialog.openDialogs.some(ref => ref.componentInstance instanceof AddImageDialogComponent)) {
      this._dialog.open(AddImageDialogComponent).afterClosed().subscribe(dialogResponse => {
        if (dialogResponse) {
          this.addConcat(`![${dialogResponse.alt}](${dialogResponse.link} "${dialogResponse.title}")`);
        }
      });
    }
  }

  code(): void {
    if (!this._dialog.openDialogs.some(ref => ref.componentInstance instanceof AddCodeblockDialogComponent)) {
      this._dialog.open(AddCodeblockDialogComponent, { width: "98%", maxWidth: "800px" }).afterClosed().subscribe(dialogResponse => {
        if (dialogResponse) {
          this.addConcat("```".concat(dialogResponse.language, "\n", dialogResponse.code, "\n```"));
        }
      });
    }
  }

  list_bulleted(): void {
    if (!this._dialog.openDialogs.some(ref => ref.componentInstance instanceof AddListDialogComponent)) {
      this._dialog.open(AddListDialogComponent, { width: "98%", maxWidth: "800px", data: { type: "bulleted" } }).afterClosed().subscribe((dialogResponse: string[]) => {
        if (dialogResponse) {
          this.addConcat(dialogResponse.map(s => `- ${s}`).join("\n"));
        }
      });
    }
  }

  list_numbered(): void {
    if (!this._dialog.openDialogs.some(ref => ref.componentInstance instanceof AddListDialogComponent)) {
      this._dialog.open(AddListDialogComponent, { width: "98%", maxWidth: "800px", data: { type: "numbered" } }).afterClosed().subscribe((dialogResponse: string[]) => {
        if (dialogResponse) {
          this.addConcat(dialogResponse.map((s, i) => `${i + 1}. ${s}`).join("\n"));
        }
      });
    }
  }

  table(): void {
    if (!this._dialog.openDialogs.some(ref => ref.componentInstance instanceof AddTableDialogComponent)) {
      this._dialog.open(AddTableDialogComponent).afterClosed().subscribe(dialogResponse => {
        if (dialogResponse) {
          let header = "|";
          for (let c = 1; c <= dialogResponse.columns; c += 1) {
            header = header.concat(` Colonne ${c} |`);
          }
          this.addConcat(header);

          let headerSeparation = "|";
          for (let c = 1; c <= dialogResponse.columns; c += 1) {
            headerSeparation = headerSeparation.concat(` --------- |`);
          }
          this.addConcat(headerSeparation);

          for (let r = 1; r <= dialogResponse.rows; r += 1) {
            let row = "|";
            for (let c = 1; c <= dialogResponse.columns; c += 1) {
              row = row.concat(` L${r}C${c} |`);
            }
            this.addConcat(row);
          }
        }
      });
    }
  }

  header(level: number): void {
    if (level < 1 || level > 6) return;
    let str = "";
    for (let i = 0; i < level; i++) {
      str += "#";
    }
    this.addConcat(`${str} Header ${level}`);
  }

  save_to_file(): void {
    const data = this.formControl.value ?? "";
    var a = document.createElement("a");
    a.href = window.URL.createObjectURL(new Blob([data], { type: "text/markdown" }));
    a.download = "markdownfile.md";
    a.click();
  }

  @HostListener('window:keydown.F1', ['$event'])
  aboutDialog(e?: KeyboardEvent): void {
    e?.preventDefault();
    if (!this._dialog.openDialogs.some(ref => ref.componentInstance instanceof AboutDialogComponent)) {
      this._dialog.open(AboutDialogComponent);
    }
  }

  @HostListener('window:keydown.F2', ['$event'])
  optionsDialog(e?: KeyboardEvent): void {
    e?.preventDefault();
    if (!this._dialog.openDialogs.some(ref => ref.componentInstance instanceof EditorOptionsDialogComponent)) {
      this._dialog.open(EditorOptionsDialogComponent, {
        width: "99%",
        maxWidth: "700px"
      });
    }
  }
}
