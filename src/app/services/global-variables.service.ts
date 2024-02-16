import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalVariablesService {

  desktop600: boolean = window.innerWidth > 600;
  desktop900: boolean = window.innerWidth > 900;
  login: boolean = false;
  accountAdjustment: boolean = false;
  showProfile:boolean = false;
  showMenu:boolean = false;
  showWriteMessage:boolean = false;
  showEditProfile:boolean = false;

  constructor() {

  }
}
