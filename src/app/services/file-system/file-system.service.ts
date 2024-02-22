import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileSystemService {

  public readonly enabled: boolean;

  public currentWritable: FileSystemWritableFileStream;

  constructor() {
    this.enabled = 'showOpenFilePicker' in window && typeof window.showOpenFilePicker === "function";
  }

  public async openFile(): Promise<string> {
    if (!this.enabled) throw new Error("File System API is not supported in this browser.");
    const [fileHandle] = await window.showOpenFilePicker();
    this.currentWritable = await fileHandle.createWritable();
    return (await fileHandle.getFile()).text();
  }
}
