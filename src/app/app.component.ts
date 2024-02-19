import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AboutDialogComponent } from './dialogs/about-dialog/about-dialog.component';
import { AddImageDialogComponent } from './dialogs/add-image-dialog/add-image-dialog.component';
import { AddLinkDialogComponent } from './dialogs/add-link-dialog/add-link-dialog.component';
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
    this.addConcat("```\ncode here\n```");
  }

  list_bulleted(): void {
    this.addConcat("- Element 1\n- Element 2\n- Element 3");
  }

  list_numbered(): void {
    this.addConcat("1. First element\n2. Second element\n3. Third element");
  }

  table(): void {
    this.addConcat("| Tables        | Are           | Cool  |\n| ------------- |:-------------:| -----:|\n| col 3 is      | right-aligned | $1600 |\n| col 2 is      | centered      |   $12 |\n| zebra stripes | are neat      |    $1 |");
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
