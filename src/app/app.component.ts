import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { AboutDialogComponent } from './dialogs/about-dialog/about-dialog.component';
import { AddCodeblockDialogComponent } from './dialogs/add-codeblock-dialog/add-codeblock-dialog.component';
import { AddImageDialogComponent } from './dialogs/add-image-dialog/add-image-dialog.component';
import { AddLinkDialogComponent } from './dialogs/add-link-dialog/add-link-dialog.component';
import { AddListDialogComponent } from './dialogs/add-list-dialog/add-list-dialog.component';
import { AddTableDialogComponent } from './dialogs/add-table-dialog/add-table-dialog.component';
import { EditorOptionsDialogComponent } from './dialogs/editor-options-dialog/editor-options-dialog.component';
import { EditorSettingsService } from './services/editor-options/editor-options.service';
import { FileSystemService } from './services/file-system/file-system.service';
import { FileSharerService } from './services/file-sharer/file-sharer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  @ViewChild("text") textarea: ElementRef<HTMLTextAreaElement>;
  formControl = new FormControl<string>("", { nonNullable: true, validators: [Validators.required] });
  spellcheck: boolean = true;

  screenState: "pad-only" | "result-only" | "both";
  get fileSystemEnabled(): boolean { return this._fileSystem.enabled ?? false; }
  get fileSystemFileHandle(): FileSystemFileHandle | null { return this._fileSystem.currentFile ?? null; }

  get fileSharerEnabled(): boolean { return this._fileSharer.enabled ?? false; }

  constructor(
    private _title: Title,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _settingsService: EditorSettingsService,
    private _fileSystem: FileSystemService,
    private _fileSharer: FileSharerService
  ) { }

  ngOnInit(): void {
    this.refreshLayout();

    this._settingsService.settings.subscribe(settings => {
      this.spellcheck = settings["spellcheck"] ?? true;
    });

    if ('launchQueue' in window) {
      window.launchQueue.setConsumer(launchParams => {
        if (launchParams.files && launchParams.files.length > 0) {
          this._fileSystem.handleLaunch(launchParams.files[0]).then(str => {
            this.formControl.reset(str);
            this._title.setTitle(`${this._fileSystem.currentFile?.name ?? "Fichier ouvert localement"} | Éditeur Markdown`);
          });
        }
      });
    }
  }

  @HostListener('window:resize', [])
  refreshLayout() {
    this.screenState = window.innerWidth > 720 ? "both" : "pad-only";
  }

  private addParagraph(prefix: string, placeholder: string) {
    const start = this.textarea.nativeElement.selectionStart;
    const end = this.textarea.nativeElement.selectionEnd;

    if (start == end) {
      this.formControl.setValue(
        (this.formControl.value ?? "").substring(0, start)
          .concat(`\n\n${prefix}${placeholder}`)
          .concat((this.formControl.value ?? "").substring(end))
      );

      this.textarea.nativeElement.setSelectionRange(start + 2 + prefix.length, end + 2 + prefix.length + placeholder.length);
    } else {
      this.formControl.setValue(
        (this.formControl.value ?? "").substring(0, start)
          .concat(`${prefix}`)
          .concat((this.formControl.value ?? "").substring(start, end))
          .concat((this.formControl.value ?? "").substring(end))
      );

      this.textarea.nativeElement.setSelectionRange(start + prefix.length, end + prefix.length);
    }

    this.textarea.nativeElement.focus();
  }

  private addMarkers(marker: string, placeholder: string) {
    const start = this.textarea.nativeElement.selectionStart;
    const end = this.textarea.nativeElement.selectionEnd;
    if (start == end) {
      this.formControl.setValue(
        (this.formControl.value ?? "").substring(0, start)
          .concat(marker)
          .concat((this.formControl.value ?? "").substring(start, end))
          .concat(placeholder)
          .concat(marker)
          .concat((this.formControl.value ?? "").substring(end))
      );

      this.textarea.nativeElement.setSelectionRange(start + marker.length, end + placeholder.length + marker.length);
    } else {
      this.formControl.setValue(
        (this.formControl.value ?? "").substring(0, start)
          .concat(marker)
          .concat((this.formControl.value ?? "").substring(start, end))
          .concat(marker)
          .concat((this.formControl.value ?? "").substring(end))
      );

      this.textarea.nativeElement.setSelectionRange(start + marker.length, end + marker.length);
    }

    this.textarea.nativeElement.focus();
  }

  private addBlock(block: string): void {
    const start = this.textarea.nativeElement.selectionStart;
    const end = this.textarea.nativeElement.selectionEnd;

    this.formControl.setValue(
      (this.formControl.value ?? "").substring(0, start)
        .concat(block)
        .concat((this.formControl.value ?? "").substring(end))
    );

    this.textarea.nativeElement.setSelectionRange(end + block.length, end + block.length);

    this.textarea.nativeElement.focus();
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

  @HostListener('window:keydown.control.q', ['$event'])
  quote(e?: KeyboardEvent): void {
    e?.preventDefault();
    this.addParagraph(">", "Quote");
  }

  @HostListener('window:keydown.control.k', ['$event'])
  link(e?: KeyboardEvent): void {
    e?.preventDefault();
    if (!this._dialog.openDialogs.some(ref => ref.componentInstance instanceof AddLinkDialogComponent)) {
      this._dialog.open(AddLinkDialogComponent).afterClosed().subscribe(dialogResponse => {
        if (dialogResponse) {
          this.addBlock(`[${dialogResponse.title ?? dialogResponse.link}](${dialogResponse.link})`);
        }
      });
    }
  }

  image(): void {
    if (!this._dialog.openDialogs.some(ref => ref.componentInstance instanceof AddImageDialogComponent)) {
      this._dialog.open(AddImageDialogComponent).afterClosed().subscribe(dialogResponse => {
        if (dialogResponse) {
          this.addBlock(`![${dialogResponse.alt}](${dialogResponse.link} "${dialogResponse.title}")`);
        }
      });
    }
  }

  code(): void {
    if (!this._dialog.openDialogs.some(ref => ref.componentInstance instanceof AddCodeblockDialogComponent)) {
      this._dialog.open(AddCodeblockDialogComponent, { width: "98%", maxWidth: "800px" }).afterClosed().subscribe(dialogResponse => {
        if (dialogResponse) {
          this.addBlock("```".concat(dialogResponse.language, "\n", dialogResponse.code, "\n```"));
        }
      });
    }
  }

  list_bulleted(): void {
    if (!this._dialog.openDialogs.some(ref => ref.componentInstance instanceof AddListDialogComponent)) {
      this._dialog.open(AddListDialogComponent, { width: "98%", maxWidth: "800px", data: { type: "bulleted" } }).afterClosed().subscribe((dialogResponse: string[]) => {
        if (dialogResponse) {
          this.addBlock(dialogResponse.map(s => `- ${s}`).join("\n"));
        }
      });
    }
  }

  list_numbered(): void {
    if (!this._dialog.openDialogs.some(ref => ref.componentInstance instanceof AddListDialogComponent)) {
      this._dialog.open(AddListDialogComponent, { width: "98%", maxWidth: "800px", data: { type: "numbered" } }).afterClosed().subscribe((dialogResponse: string[]) => {
        if (dialogResponse) {
          this.addBlock(dialogResponse.map((s, i) => `${i + 1}. ${s}`).join("\n"));
        }
      });
    }
  }

  table(): void {
    if (!this._dialog.openDialogs.some(ref => ref.componentInstance instanceof AddTableDialogComponent)) {
      this._dialog.open(AddTableDialogComponent).afterClosed().subscribe(dialogResponse => {
        var tableBlock = "";

        if (dialogResponse) {
          let header = "|";
          for (let c = 1; c <= dialogResponse.columns; c += 1) {
            header = header.concat(` Colonne ${c} |`);
          }
          tableBlock = header;

          let headerSeparation = "|";
          for (let c = 1; c <= dialogResponse.columns; c += 1) {
            headerSeparation = headerSeparation.concat(` --------- |`);
          }
          tableBlock = tableBlock.concat("\n", headerSeparation);

          for (let r = 1; r <= dialogResponse.rows; r += 1) {
            let row = "|";
            for (let c = 1; c <= dialogResponse.columns; c += 1) {
              row = row.concat(` L${r}C${c} |`);
            }
            tableBlock = tableBlock.concat("\n", row);
          }

          this.addBlock(tableBlock);
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

    this.addParagraph(`${str} `, `Header ${level}`);
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

  @HostListener('window:keydown.control.o', ['$event'])
  async openFile(e?: KeyboardEvent): Promise<void> {
    if (this._fileSystem.enabled) {
      e?.preventDefault();

      if (this.formControl.pristine || confirm("Il reste des modifications non enregistrées. Si vous changez de fichier, elles seront définitivement perdues.")) {
        try {
          this.formControl.reset(await this._fileSystem.openFile());
          this._title.setTitle(`${this._fileSystem.currentFile?.name ?? "Fichier ouvert localement"} | Éditeur Markdown`);
        } catch (e) {
          if (e instanceof Error) {
            this._snackBar.open(e.message, "Masquer", { duration: 5000 });
          }
        }
      }
    }
  }

  @HostListener('window:keydown.control.s', ['$event'])
  async saveFile(e?: KeyboardEvent): Promise<void> {
    e?.preventDefault();
    try {
      await this._fileSystem.saveFile(this.formControl.value ?? "");
      this.formControl.markAsPristine();
      this._snackBar.open("Enregistré avec succès.", "Masquer", { duration: 5000 });
    } catch (e) {
      if (e instanceof Error) {
        this._snackBar.open(e.message, "Masquer", { duration: 5000 });
      }
    }
  }

  shareFile(): void {
    if (!this.formControl.value) return;
    const fileName = this.fileSystemFileHandle?.name ?? `markdown-editor-${Date.now()}.txt`;
    const file = new File([this.formControl.value], fileName, { 'type': 'text/plain' });

    this._fileSharer.share({
      title: fileName,
      files: [file]
    }).catch(reason => this._snackBar.open(`Impossible de demander à votre système de partager : ${reason.message ?? reason.toString()}`, "Fermer"));
  }

  closeFile(): void {
    if (this.formControl.pristine || confirm("Il reste des modifications non enregistrées. Si vous fermez le fichier, elles seront définitivement perdues.")) {
      this._fileSystem.closeFile();
      this.formControl.reset("");
      this._title.setTitle(`Éditeur Markdown`);
    }
  }
}