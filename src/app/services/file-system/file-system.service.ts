import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileSystemService {

  public readonly enabled: boolean;
  public currentFile?: FileSystemFileHandle;

  constructor() {
    this.enabled = 'showOpenFilePicker' in window && typeof window.showOpenFilePicker === "function";
  }

  public async openFile(): Promise<string> {
    if (!this.enabled) throw new Error("File System API is not supported in this browser.");
    const [fileHandle] = await window.showOpenFilePicker({
      "types": [
        { "accept": { "text/markdown": ".md" }, "description": "Fichier Markdown" },
        { "accept": { "text/plain": ".txt" }, "description": "Fichier texte" }
      ]
    });
    this.currentFile = fileHandle;
    return (await fileHandle.getFile()).text();
  }

  public async saveFile(newContent: string): Promise<void> {
    if (this.enabled && this.currentFile) {
      const writable = await this.currentFile.createWritable();
      await writable.write(newContent);
      await writable.close();
    } else {
      await this.triggerDownload(newContent);
    }
  }

  public async triggerDownload(data: string): Promise<void> {
    var a = document.createElement("a");
    a.href = window.URL.createObjectURL(new Blob([data], { type: "text/markdown" }));
    a.download = `markdown-editor-${Date.now()}.md`;
    a.click();
  }

  public closeFile(): void {
    delete this.currentFile;
  }
}
