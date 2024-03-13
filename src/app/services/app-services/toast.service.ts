import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  showToast = false;
  message = '';

  constructor() { }

  showMessage(message: string) {
    this.message = message;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 2000);
  }
}
