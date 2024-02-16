import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalFunctionsService {
  
  active: boolean = false;

  menuClicked() {
    this.active = !this.active;
    if (this.active) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto'; 

  }

  stopPropagation(e:Event) {
    e.stopPropagation();
}
  constructor() { }
}
