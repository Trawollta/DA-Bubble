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
  openReaction: boolean = false;

  unsubUser;
  userId: string = 'guest';
  answerKey: string = '';
  answercount: number = 0;
  lastAnswerTime: number = 0;

  hoverIndex: number = 0;
  count: number = 0;
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
    this.unsubUser();
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

  onSelectMessage() {
    if(!this.activeMessage)this.globalVariables.editMessage = false;
    this.activeMessage = true;
    this.openReaction = true;
    
  }

  @HostListener('document:click', ['$event'])
  onClick(event: any) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      if(!this.globalVariables.editMessage)
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
  async getFirstUserOfEmoji(index: number) {
    let length = this.message.emoji[index].userId.length;
    let userId = this.message.emoji[index].userId[0];
    if (userId !== '') {
      let userData = await this.firebaseUpdate.getUserData(userId);
      this.profile = new User(userData);
      this.hoverUser = this.profile.name;
      this.count = length - 1;
    }
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
 
}
