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
import { ChatChannel } from 'app/models/chatChannel.class';
import { FormsModule } from '@angular/forms';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';

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
  openReaction: boolean = false;
  selectedMessage: string = '';

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
  editMessage: boolean = false;
  msgEmojis: any[] = []; // Initialisieren Sie msgEmojis als leeres Array

  unsubUser;
  userId: string = 'guest';
  answerKey: string = '';
  answercount: number = 0;
  lastAnswerTime: number = 0;

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
  }

  /**
   * this function gets all information needed for answers
   */
  fillAnswerVariables(){
    let answerInfo = this.globalFunctions.getAnswerInfo(this.message);
    this.lastAnswerTime = answerInfo.lastAnswerTime;
    this.answercount = answerInfo.answerCount;
    this.answerKey = answerInfo.answerKey;
  }

  /**
   * this function providesall relevant information for the answer section
   */
/*   getAnswerInfo(message:any){
    this.answerKey = message.userId + '_' + message.timestamp.toString();
    console.log('lokale Variable: ',this.answerKey);
    let filteredMessages = this.globalVariables.chatChannel.messages.filter(
      (message) => message.answerto === this.answerKey
    );
    this.answercount = filteredMessages.length;
    if (
      filteredMessages.length > 0 &&
      filteredMessages[filteredMessages.length - 1].timestamp
    )
      this.lastAnswerTime =
        filteredMessages[filteredMessages.length - 1].timestamp;
  } */

  openEmojis() {
    let emojiDiv = document.getElementById('emojis');
    if (emojiDiv && emojiDiv.classList.contains('d-none')) {
      emojiDiv.classList.remove('d-none');
    } else if (emojiDiv && emojiDiv.classList.contains('d-none') == false) {
      emojiDiv.classList.add('d-none');
    }
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
    this.globalVariables.messageThreadStart.message = this.message.message;
    this.globalVariables.messageThreadStart.userId = this.message.userId;
    this.globalVariables.messageThreadStart.timestamp = this.message.timestamp;
    this.globalVariables.messageThreadStart.userName = this.user.name;
    this.globalVariables.messageThreadStart.img = this.user.img;
  }

  onSelectMessage(message: string) {
    this.selectedMessage = message;
    this.openReaction = true;
  }

  onCloseReactions() {
    this.openReaction = false;
    this.selectedMessage = '';
  }

  @HostListener('document:click', ['$event'])
  onClick(event: any) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.onCloseReactions();
    }
  }

/*   editOpen() {
    this.editMessage = true;
    this.copyHelper();
  }

  editClose() {
    this.editMessage = false;
  }

  editSave() {
    this.editMessage = false;
    this.globalVariables.messageData = this.message;
    this.firebaseChatService.sendMessage(this.globalVariables.openChannel.chatId, 'chatchannels');
    if (this.originalMessage.message !== this.message.message)
      this.remove(this.globalVariables.openChannel.chatId);
  } */

  remove(chatId: string) {
    return updateDoc(doc(this.firestore, 'chatchannels', chatId), {
      messages: arrayRemove(this.originalMessage),
    });
  }

  copyHelper() {
    this.originalMessage.message = this.message.message;
    this.originalMessage.answerto = this.message.answerto;
    this.originalMessage.timestamp = this.message.timestamp;
    this.originalMessage.userId = this.message.userId;
    this.originalMessage.emoji = [];

    this.message.emoji.forEach((element: any) => {
      this.originalMessage.emoji.push({
        icon: element.icon,
        userId: [element.userId],
        iconId: element.iconId,
      });
    });
    console.log('current original Message: ', this.originalMessage);
  }

  addUserIdToEmoji(emoji: any): void {
    debugger;
    if (emoji && emoji.userId && Array.isArray(emoji.userId)) {
      const activeID = this.globalVariables.activeID;
      if (emoji.userId.includes(activeID)) {
        emoji.userId = emoji.userId.filter((id: any) => id !== activeID);
      } else {
        emoji.userId.push(activeID);
      }
    }
  }

  emojiCount(emoji: any): number {
    return emoji.userId.length;
  }
}
