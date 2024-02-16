import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalFunctionsService {
  
  active: boolean = false;
  channel: boolean =false;

  menuClicked() {
    this.active = !this.active;
    if (this.active) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto'; 

  }

  openOverlay() {
    this.channel = !this.channel;
    if (this.channel) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto'; 

  }

  stopPropagation(e:Event) {
    e.stopPropagation();
}
  constructor() { }
}
