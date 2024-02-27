import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalVariablesService {
  
  desktop600: boolean = window.innerWidth > 600;
  desktop900: boolean = window.innerWidth > 900;
  login: boolean = false;
  signup: boolean = false;
  accountAdjustment: boolean = false;
  showProfile: boolean = false;
  showMenu: boolean = false;
  showWriteMessage: boolean = false;
  showEditProfile: boolean = false;
  isChatVisable: boolean = true;
  userToChatWith: any = [];
  showThread: boolean = false;
  showChannelMenu: boolean = true; 
  showChannels: boolean = false;
  gotoChannel: any = [];
  isChannelVisible: boolean = true;
  
  openChannel:string='';
  channelData: {
    description: string;
    channelName: string;
  } = {
    description: '',
    channelName: ''
  };


  //this is for test purpose. It could be take over when working.
  // variable is used in profile card and firebase-user.service.ts
  activeID:string = 'gvmQbxpAqE8t1ftC2BOp'; // this is the id of guest user of testusers
  constructor() { }
}
