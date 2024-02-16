import { Injectable, inject } from '@angular/core';
import { GlobalVariablesService } from './global-variables.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalFunctionsService {
  globalVariables = inject (GlobalVariablesService);
  
  
  channel: boolean =false;

  menuClicked() {
    this.globalVariables.showMenu = !this.globalVariables.showMenu;
    if (this.globalVariables.showMenu) document.body.style.overflow = 'hidden';
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
