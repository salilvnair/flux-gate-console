import { Injectable } from '@angular/core';
declare const window: any;

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
    
  private config: any;

  envConfig() {
    return window.envConfig
  }
}
