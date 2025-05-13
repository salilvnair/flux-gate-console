import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ViewportService {
  getViewWidth(): number {
    return window.innerWidth;
  }
}