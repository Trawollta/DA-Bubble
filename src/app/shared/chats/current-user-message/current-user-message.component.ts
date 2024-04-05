import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  Firestore,
  doc,
  collection,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from '@angular/fire/firestore';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { ReactionsComponent } from 'app/shared/reactions/reactions.component';
import { FirebaseChatService } from 'app/services/firebase-services/firebase-chat.service';
import { User } from 'app/models/user.class';
import { FormsModule } from '@angular/forms';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { FirebaseUserupdateService } from 'app/services/firebase-services/firebase-userupdate.service';

@Component({
  selector: 'app-current-user-message',
  standalone: true,
  imports: [
    ReactionsComponent,
    CommonModule,
    DatePipe,
    FormsModule,
    InputfieldComponent,
  ],
  templateUrl: './current-user-message.component.html',
  styleUrl: './current-user-message.component.scss',
})
export class CurrentUserMessageComponent {
  firestore: Firestore = inject(Firestore);
  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);
  firebaseChatService = inject(FirebaseChatService);
  firebaseUpdate = inject(FirebaseUserupdateService);
  openReaction: boolean = false;

  @Input() message: any;
  @Input() index: any;
  @Input() isThread: boolean = false;

  postingTime: string | null = null;
  user: User = new User();
  originalMessage = {
    message: '',
    answerto: '',
    userId: '',
    timestamp: 0,
    emoji: [{ icon: '', userId: [] as any[], iconId: '' }],
  };
  activeMessage: boolean = false; // for flagging this specific message
  messageInfo = { hasUrl: false, message: '', textAfterUrl: '', messageImgUrl: '' };

  profile: User = { img: '', name: '', isActive: false, email: '', relatedChats: [] };
  mouseover: boolean = false;
  hoverUser: string = '';

  unsubUser;
  userId: string = 'guest';
  answerKey: string = '';
  answercount: number = 0;
  lastAnswerTime: number = 0;
  //messageImgUrl: string = '';
  // messageText: string = '';
  // textAfterUrl: string = '';
  // notAllowedChars: string = '';

  count = '';
  isImage: boolean = false;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {
    this.unsubUser = this.getUser(this.userId);
  }

  /**
   * this function unsubscribes the containing content
   */
  ngOnDestroy() {
    this.unsubUser;
  }

  /**
   * thsi function returns the reference to the user doc
   * @param docId - id of user
   * @returns - referenz of document
   */
  getUserRef(docId: string) {
    return doc(collection(this.firestore, 'users'), docId);
  }

  /**
   * this function get data of user and saves it in lokal user object
   * @param id - id of user
   * @returns - onSnapshot object
   */
  getUser(id: string) {
    return onSnapshot(this.getUserRef(id), (user) => {
      if (user.data()) {
        this.user = new User(user.data());
      }
    });
  }

  /**
   * this function calls function getUser() for providing userdata for the post
   */
  ngOnInit() {
    this.getUser(this.message.userId);
    this.postingTime = this.message.timestamp;
    this.fillAnswerVariables();
    this.cloneOriginalMessage();
    this.messageInfo = this.globalFunctions.checkMessage(this.message.message);
    this.isImage = this.messageInfo.hasUrl;
  }

  /**
   * 
   * @param message 
   * @returns 
   */
  /*  checkMessage(message: string): boolean {
    // const urlPattern = /(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    // const urlMatch = message.match(urlPattern);
   const urlMatch = this.globalFunctions.checkForURL(message);
     if (urlMatch) {
       this.messageImgUrl = urlMatch;
       const textBeforeUrl = message.split(urlMatch)[0].trim();
       this.textAfterUrl = message.split(urlMatch)[1].trim();
       //this.notAllowedChars = this.globalFunctions.isMessageValid(this.textAfterUrl);
      // this.notAllowedChars += this.globalFunctions.isMessageValid(textBeforeUrl);
        this.messageText = textBeforeUrl;
     } else { // if no URL in message:
       this.messageText = message;
       //der check, ob es sich um erlaupten Input handelst muss in die Eingabe
      // this.notAllowedChars = this.globalFunctions.isMessageValid(message);
      }
     return !!urlMatch;
   } */




  /**
   * this function clones the original message object for later remove logic
   */
  cloneOriginalMessage() {
    this.originalMessage = { ...this.message }; //clone first layer
    this.originalMessage.emoji = this.message.emoji.map((emoji: any) => ({
      //clone second layer
      ...emoji,
      userId: [...emoji.userId], // clone third layer
    }));
  }

  /**
   * this function gets all information needed for answers
   */
  fillAnswerVariables() {
    let answerInfo = this.globalFunctions.getAnswerInfo(this.message);
    this.lastAnswerTime = answerInfo.lastAnswerTime;
    this.answercount = answerInfo.answerCount;
    this.answerKey = answerInfo.answerKey;
  }


  openAnswers() {
    this.globalVariables.showThread = !this.globalVariables.showThread;
    this.globalVariables.answerKey = this.answerKey;
    this.globalVariables.answerCount = this.answercount;
    this.fillInitialUserObj();
    this.globalVariables.openChat = 'isChatVisable';
    this.globalVariables.messageData.answerto =
      this.message.userId + '_' + this.message.timestamp.toString();
    this.globalFunctions.showDashboardElement(1200);
    if (window.innerWidth < 800) {
      this.globalVariables.showChannelMenu = false;
      this.globalVariables.isChatVisable = false;
    }
  }

  fillInitialUserObj() {
    const { message, userId, timestamp } = this.message;
    const { name: userName, img: userImgPath } = this.user;
    this.globalVariables.messageThreadStart = { message, userId, timestamp, userName, userImgPath };
  }

  onSelectMessage() {
    this.activeMessage = !this.activeMessage;
    this.openReaction = !this.openReaction;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: any) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.onCloseReactions();
    }
  }

  onCloseReactions() {
    this.activeMessage = false
    this.openReaction = false;
  }

  addUserIdToEmoji(emoji: any, index: number) {
    const activeID = this.globalVariables.activeID;
    if (emoji.userId.includes(activeID) && emoji.userId.length === 1) {
      if (this.message.emoji.length == 1) {
        emoji.userId = [];
        emoji.iconId = '';
        emoji.icon = '';
      } else this.message.emoji.splice(index, 1);
    } else if (emoji.userId.includes(activeID)) emoji.userId = emoji.userId.filter((id: string) => id !== activeID);
    else emoji.userId.push(activeID);
    this.updateMessage();
  }

  updateMessage() {
    this.globalVariables.messageData = this.message;
    let chatFamiliy = this.globalVariables.isUserChat ? 'chatusers' : 'chatchannels';
    this.firebaseChatService.sendMessage(
      this.globalVariables.openChannel.chatId,
      chatFamiliy
    );
    this.remove(this.globalVariables.openChannel.chatId, chatFamiliy); // es kommt zu einem Springen des chats, wenn Function ausgeführt wird
  }

  remove(chatId: string, chatFamiliy: string) {
    return updateDoc(doc(this.firestore, chatFamiliy, chatId), {
      messages: arrayRemove(this.originalMessage),
    });
  }

  /**
   *
   * @returns - name of first user of emoji
   */
  async getFirstUserOfEmoji() {
    let lenght = this.message.emoji[0].userId.length - 1;
    let userId = this.message.emoji[0].userId[0];
    if (userId !== '') {
      let x = await this.firebaseUpdate.getUserData(userId);
      this.profile = new User(x);
      this.hoverUser = this.profile.name;
      this.count = lenght.toString();
    }
  }

  @HostListener('mouseover')
  onMouseOver() {
    if (this.message.emoji[0].icon) {
      this.mouseover = true;
      this.getFirstUserOfEmoji();
    }
  }

  @HostListener('mouseout')
  onMouseOut() {
    this.mouseover = false;
  }



}
