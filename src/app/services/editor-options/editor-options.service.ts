import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditorSettingsService {

  private _currentSettings: EditorSettings;
  private _settingsEmitter: BehaviorSubject<EditorSettings>;

  constructor() {
    this._currentSettings = JSON.parse(localStorage.getItem("editorsettings") ?? "{}");
    this._settingsEmitter = new BehaviorSubject(this._currentSettings);
  }

  get settings(): Observable<EditorSettings> {
    return this._settingsEmitter.asObservable();
  }

  public getSetting<T>(settingName: string, fallbackValue: T): T {
    if (this._currentSettings[settingName]) {
      return this._currentSettings[settingName];
    } else {
      this.setSetting(settingName, fallbackValue);
      return fallbackValue;
    }
  }

  public setSetting<T>(settingName: string, settingValue: T): void {
    this._currentSettings[settingName] = settingValue;
    localStorage.setItem("editorsettings", JSON.stringify(this._currentSettings));
    this._settingsEmitter.next(this._currentSettings);
  }
}

export interface EditorSettings {
  [name: string]: any;
}