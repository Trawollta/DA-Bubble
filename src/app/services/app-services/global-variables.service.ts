import { Injectable } from '@angular/core';
import { ChatChannel } from '../../models/chatChannel.class';

@Injectable({
  providedIn: 'root',
})
export class GlobalVariablesService {
  desktop500: boolean = window.innerWidth > 500;
  desktop600: boolean = window.innerWidth > 600;
  desktop700: boolean = window.innerWidth > 700;
  desktop800: boolean = window.innerWidth > 800;
  desktop900: boolean = window.innerWidth > 900;
  desktop1200: boolean = window.innerWidth > 1200;
  login: boolean = false;
  logout: boolean = false;
  signup: boolean = false;
  accountAdjustment: boolean = false;

  activeID: string = 'guest'; // this is the id of guest user of testusers

  //flags for profile
  showProfileMenu: boolean = false;
  showProfile: boolean = false;
  ownprofile: boolean = true;
  showEditProfile: boolean = false;
  isProfileOfCurrentUser: boolean = true;
  profileUserId: string = '';

  // Flags to manage chat
  showAddChannel: boolean = false;
  adduser: boolean = false;
  openReaction: boolean = false;
  editChannelOverlayOpen: boolean = false;
  editChannel: boolean = false;
  showContacts: boolean = false;
  memberlist: boolean = false;
  newChannelname: boolean = false;
  isEditingChannel: boolean = false;
  headerShowMembers: boolean = false;
  newMessage: string = '';
  //showEmojiContainer: boolean = false;
  scrolledToBottom: boolean = false;
  isMembersPopupOpen: boolean = false;

  //take over selected Emoji
  selectedEmoji = {
    character: '',
    codePoint: ''
  };


  //flags for showing the dashboard main elements
  showChannelMenu: boolean = true;
  isChatVisable: boolean = false;
  showThread: boolean = false;
  bufferThreadOpen: boolean = false;
  isMenuOpen: boolean = false;


  openChat: string = ''; // used in openAnswers() to come back to the chat
  isUserChat: boolean = false; //used as flag to show in chat the header for user chat
  answerChatKey: string = ''; //used by open chat between 2 members and contains the chat key

  // userToChatWith: any = [];
  userToChatWith = {
    name: '',
    img: '',
    email: '',
    id: '',
    isActive: false
  };

  showChannels: boolean = false;
  gotoChannel: any = [];
  isChannelVisible: boolean = true;


  currentChannelId: string = '';



  //this is the object for collecting message data from input field in chat
  messageData = {
    message: '',
    answerto: '',
    userId: '',
    timestamp: 0,
    emoji: [{ icon: '', userId: [] as any[], iconId: '' }],
  };
  //this is the object for collecting message data from input field in thread
  messageThreadData = {
    message: '',
    answerto: '',
    userId: '',
    timestamp: 0,
    emoji: [{ icon: '', userId: [] as any[], iconId: '' }],
  };
  //for filtering the thread
  answerKey: string = '';
  answerCount: number = 0;

  //this is the object for collecting message data for first message in thread
  messageThreadStart = {
    message: '',
    userId: '',
    timestamp: 0,
    userName: '',
    userImgPath: '',
  };

  //this is the object for the active channel information. Used in channel-menu
  openChannel = {
    titel: 'Willkommen',
    desc: 'moin',
    id: 'fsjWrBdDhpg1SvocXmxS',
    chatId: 'NQMdt08FAcXbVroDLhvm',
    creator: 'v7pZ6K5geifCK8a30Epa1YuSlER2',
    memberCount: 11
  };

  //this Array contains all users of the active chat
  openChannelUser = [
    {
      id: '',
      name: '',
      img: ''
    }
  ]


  //wird in edit-channel.component, add-contacts.component und add-to-channel.component verwendet
  channelData = {
    description: '',
    channelName: '',
    chatId: '',
    id: '',
    creator: '',
    members: [] as any[],
    /* owner: '',
    allowedUser: ['id1', '1d2'] */
  };

  //variable for chats
  activeChatId: string = ''; // used to identify the releated chat
  chatChannel: ChatChannel = new ChatChannel();

  //this is for test purpose. It could be take over when working.
  // variable is used in profile card and firebase-user.service.ts
  currentUser = {
    name: '',
    email: '',
    img: '',
    isActive: false,
    relatedChats: ['NQMdt08FAcXbVroDLhvm']
  };

  choosedEmoji: any = { icon: '', userID: '' }; // this is the emoji which is choosen in emoji-picker
  message: any;

  editMessage: boolean = false;

  imprintActive = false;
  showSplashScreen = false;

  constructor() { }

  //eine Idee:
  //wir müssen die User überall mit der ID ansprechen und nur wenn wir den Namen brauchen holen wir ihn.
  //wir müssten also inern ausschließlich mit den IDs arbeiten und  nur wenn wir den Profilnamen anzeigen lassen wollen wird hier hin verwiesen.
  // dadurch können user auch den gleichen Namen haben.
  /*  allUserIDs = [
     {
       userId: '',
       userName: '',
     },
   ]; */
}
