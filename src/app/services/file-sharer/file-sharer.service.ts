import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileSharerService {

  public readonly enabled: boolean = false;

  constructor() {
    this.enabled = 'share' in navigator;
  }

  public async share(data?: ShareData) {
    if (!this.enabled) throw new Error("The Web Share API is not supported by this browser.");
    if (!navigator.canShare(data)) throw new Error("Your browser rejected your sharing request.");

    return navigator.share(data);
  }
}

