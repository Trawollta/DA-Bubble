import {
  Component,
  ElementRef,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
// import {
//   Firestore,
//   doc,
//   collection,
//   onSnapshot,
//   updateDoc,
//   arrayRemove,
// } from '@angular/fire/firestore';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { ReactionsComponent } from 'app/shared/reactions/reactions.component';
// import { FirebaseChatService } from 'app/services/firebase-services/firebase-chat.service';
import { User } from 'app/models/user.class';
import { FormsModule } from '@angular/forms';
// import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
// import { FirebaseUserupdateService } from 'app/services/firebase-services/firebase-userupdate.service';

@Component({
  selector: 'app-current-user-message',
  standalone: true,
  imports: [
    ReactionsComponent,
    CommonModule,
    DatePipe,
    FormsModule,
    // InputfieldComponent,
  ],
  templateUrl: './current-user-message.component.html',
  styleUrl: './current-user-message.component.scss',
})
export class CurrentUserMessageComponent {
  // firestore: Firestore = inject(Firestore);
  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);
  // firebaseChatService = inject(FirebaseChatService);
  // firebaseUpdate = inject(FirebaseUserupdateService);


  @Input() message: any;
  @Input() index: any;
  @Input() isThread: boolean = false;

  @ViewChild('messageTextareaBubble', {static: false}) messageTextarea!: ElementRef<HTMLTextAreaElement>;

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
  openReaction: boolean = false;
  localEditMessage: boolean = false;

  unsubUser;
  userId: string = 'guest';
  answerKey: string = '';
  answercount: number = 0;
  lastAnswerTime: number = 0;

  hoverIndex: number = 0;
  count: number = 0;
  isImage: boolean = false;

  constructor() {
    this.unsubUser = this.getUser(this.userId);
  } 

  /**
   * this function unsubscribes the containing content
   */
  ngOnDestroy() {
    // this.unsubUser();
  }

  /**
   * this function returns the reference to the user doc
   * @param docId - id of user
   * @returns - referenz of document
   */
  getUserRef(docId: string) {
    // return doc(collection(this.firestore, 'users'), docId);
  }

  /**
   * this function get data of user and saves it in lokal user object
   * @param id - id of user
   * @returns - onSnapshot object
   */
  getUser(id: string) {
    // return onSnapshot(this.getUserRef(id), (user) => {
    //   if (user.data()) {
    //     this.user = new User(user.data());
    //   }
    // });
  }

  /**
   * this function calls function getUser() for providing userdata for the post
   */
  ngOnInit() {
    console.log("🚀 `app-current-user-message` wurde geladen!");
    console.log("📩 Nachricht erhalten:", this.message);

    if (!this.message || !this.message.content) {
        console.warn("⚠️ `message` ist nicht definiert oder hat keinen `content`.");
        return;
    }

    console.log("🔹 Nachricht-Inhalt:", this.message?.content);
    console.log("🔹 Sender-ID:", this.message?.sender?.id);

    this.messageInfo = this.globalFunctions.checkMessage(this.message.content);
}

  /**
   * this function clones the original message object for later remove logic
   */
  cloneOriginalMessage() {
    console.log("🔍 `cloneOriginalMessage()` aufgerufen!");
    console.log("📩 Originale Nachricht:", this.message);
    console.log("🔎 Existiert `emoji`?", this.message?.emoji);

    this.originalMessage = { ...this.message }; //clone first layer

    if (this.message?.emoji && Array.isArray(this.message.emoji)) { // ✅ Sicherstellen, dass emoji ein Array ist
        this.originalMessage.emoji = this.message.emoji.map((emoji: any) => ({
            ...emoji,
            userId: [...(emoji.userId || [])] // ✅ Falls `userId` undefined ist, setze leeres Array
        }));
    } else {
        console.warn("⚠️ `emoji` existiert nicht oder ist kein Array. Setze leeres Array.");
        this.originalMessage.emoji = []; // ✅ Falls emoji nicht existiert, setze leeres Array
    }
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
    this.globalVariables.bufferThreadOpen = !this.globalVariables.bufferThreadOpen;
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

  onMouseOver(index: number) {
    if (this.message.emoji[index].icon) {
      this.mouseover = true;
      this.hoverIndex = index;
      this.getFirstUserOfEmoji(index);
    }
  }

  onMouseOut() {
    this.mouseover = false;
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
    // this.globalVariables.messageData = this.message;
    // let chatFamiliy = this.globalVariables.isUserChat ? 'chatusers' : 'chatchannels';
    // this.firebaseChatService.sendMessage(
    //   this.globalVariables.openChannel.chatId,
    //   chatFamiliy
    // );
    // this.remove(this.globalVariables.openChannel.chatId, chatFamiliy); // es kommt zu einem Springen des chats, wenn Function ausgeführt wird
  }

  remove(chatId: string, chatFamiliy: string) {
    // return updateDoc(doc(this.firestore, chatFamiliy, chatId), {
    //   messages: arrayRemove(this.originalMessage),
    // });
  }

  /**
   *
   * @returns - name of first user of emoji
   */
  async getFirstUserOfEmoji(index: number) {
    // let length = this.message.emoji[index].userId.length;
    // let userId = this.message.emoji[index].userId[0];
    // if (userId !== '') {
    //   let userData = await this.firebaseUpdate.getUserData(userId);
    //   this.profile = new User(userData);
    //   this.hoverUser = this.profile.name;
    //   this.count = length - 1;
    // }
  }

  onSelectMessage() {
    //if (!this.activeMessage) this.globalVariables.editMessage = false;
    this.activeMessage = true;
    this.openReaction = true;
  }

  onLeaveMessage() {
    this.activeMessage = false;
    this.openReaction = false;
    this.localEditMessage = false;
  }

  showMessageBeforeImg(): boolean{
    let check = false;
    if(this.messageInfo.message !== '')check = true;
    if(this.localEditMessage) check = false;
    return check;
  }

  showMessageImage(): boolean {
    let check = false;
    if(this.messageInfo.hasUrl)check = true;
    if(this.localEditMessage) check = false;
    return check;
  }

  showMessageAfterImage(): boolean{
    let check = false;
    if(this.messageInfo.textAfterUrl !== '')check = true;
    if(this.localEditMessage) check = false;
    return check;
  }

 /**
  * this function sets the localEditMessage variable regarding edit button of app-reaction is hit
  * @param check - boolean true if edit was hit
  */
  isMessageEdit(check: boolean){
    this.localEditMessage = check;
    if (check) setTimeout(() => this.setFocusOnTextarea(), 100);
  }

  /**
   * this function sets the focus on the textarea of this element
   */
  setFocusOnTextarea() {
    if (this.messageTextarea) {
        const textareaElement = this.messageTextarea.nativeElement;
        if (textareaElement) textareaElement.focus();  
    }
}

}
