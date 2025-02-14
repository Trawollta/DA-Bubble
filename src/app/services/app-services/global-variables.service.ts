import { Injectable } from '@angular/core';
import { ChatChannelService } from 'app/services/chat-channel.service';
import { ChatChannel } from '../../models/chatChannel.class';
import { Channel } from 'app/models/channel.class';

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
  scrolledToBottom: boolean = false;
  isMembersPopupOpen: boolean = false;

  currentChannel: Channel | null = null;
  currentChannelId: string = '';
  selectedChannel: Channel | null = null;

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


  // currentChannelId: string = '';



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
    titel: '',
    desc: '',
    id: 'fsjWrBdDhpg1SvocXmxS',
    chatId: 'NQMdt08FAcXbVroDLhvm',
    creator: '',
    memberCount: 0
  };

  //this Array contains all users of the active chat
  openChannelUser: { name: string; id: string; img: string, isActive: boolean}[] = [];

  allUsers: { name: string; id: string; img: string, isActive: boolean }[] = [];

  notInOpenChannelUser : { name: string; id: string; img: string, isActive: boolean}[] = [];

  viewableChannel : Array<string> = [];
  viewableChannelplusId =[{channelName:'', chatId:'', channelId:''}];


  //wird in edit-channel.component, add-contacts.component und add-to-channel.component verwendet
  channelData = {
    description: '',
    channelName: '',
    chatId: '',
    id: '',
    creator: '',
    members: [] as any[],
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

  imprintActive = false;
  showSplashScreen = false;

  allChannels: any = {name: [], id: []};
  messages: any[] = [];

  constructor(private chatChannelService: ChatChannelService) { }


  setSelectedChannel(channel: any) {
    console.log("✅ `selectedChannel` wird gesetzt:", channel);
    this.selectedChannel = channel;
    console.log("📌 Neuer Wert von `selectedChannel`:", this.selectedChannel);
}


 
  loadMessages() {
    console.log("🔍 `loadMessages()` wurde aufgerufen!");
    console.log("🛠 Aktuelles `selectedChannel`:", this.selectedChannel);

    if (!this.selectedChannel || !this.selectedChannel.id) {
        console.warn("⚠️ `loadMessages()` abgebrochen: Kein `selectedChannel` gesetzt.");
        return;
    }

    const channelId = Number(this.selectedChannel.id);
    console.log("📩 Lade Nachrichten für Channel ID:", channelId);

    this.chatChannelService.getMessages(channelId).subscribe({
        next: (messages) => {
            console.log("📩 Nachrichten erfolgreich geladen:", messages);
            this.messages = [...messages];  // ❗ Array-Kopie erstellen, damit Angular es erkennt
        },
        error: (error) => {
            console.error("❌ Fehler beim Laden der Nachrichten:", error);
        }
    });
}



}
