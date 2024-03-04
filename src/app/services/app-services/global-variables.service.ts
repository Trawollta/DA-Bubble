import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalVariablesService {
  desktop600: boolean = window.innerWidth > 600;
  desktop700: boolean = window.innerWidth > 700;
  desktop900: boolean = window.innerWidth > 900;
  login: boolean = false;
  signup: boolean = false;
  accountAdjustment: boolean = false;
  showWriteMessage: boolean = false;

  //flags for profile
  showProfileMenu: boolean = false;
  showProfile: boolean = false;
  showEditProfile: boolean = false;
  isProfileOfCurrentUser: boolean = true;

  //flags for showing the dashboard main elements
  showChannelMenu: boolean = true;
  isChatVisable: boolean = false;
  isPrivatChatVisable: boolean = false;
  showThread: boolean = false;

  openChat: string = ''; // used in openAnswers() to come back to the chat

  // userToChatWith: any = [];
  userToChatWith = {
    name: '',
    img: '',
  };

  showChannels: boolean = false;
  gotoChannel: any = [];
  isChannelVisible: boolean = true;

  openChannel: string = '';
  openChannelDesc: string = '';
  channelData: {
    description: string;
    channelName: string;
  } = {
    description: '',
    channelName: '',
  };

  currentUser = {
    name: 'Guest',
    email: 'muster@mail.de',
    img: 'assets/img/avatars/avatar_3.svg',
    isActive: true,
  };
  //this is for test purpose. It could be take over when working.
  // variable is used in profile card and firebase-user.service.ts
  activeID: string = 'gvmQbxpAqE8t1ftC2BOp'; // this is the id of guest user of testusers

  constructor() {}

  //eine Idee:
  //wir müssen die User überall mit der ID ansprechen und nur wenn wir den Namen brauchen holen wir ihn.
  //wir müssten also inern ausschließlich mit den IDs arbeiten und  nur wenn wir den Profilnamen anzeigen lassen wollen wird hier hin verwiesen.
  // dadurch können user auch den gleichen Namen haben.
  allUserIDs = [
    {
      userId: '',
      userName: '',
    },
  ];
}
