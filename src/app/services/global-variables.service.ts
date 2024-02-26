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

  constructor() { }
}
