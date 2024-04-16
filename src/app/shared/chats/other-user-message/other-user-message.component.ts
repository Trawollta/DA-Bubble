import {
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
} from '@angular/core';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { FirebaseChatService } from 'app/services/firebase-services/firebase-chat.service';
import {
  Firestore,
  doc,
  updateDoc,
  arrayRemove,
} from '@angular/fire/firestore';

import { User } from 'app/models/user.class';
import { DatePipe, CommonModule } from '@angular/common';
import { ReactionsComponent } from '../../reactions/reactions.component';
import { FirebaseUserupdateService } from 'app/services/firebase-services/firebase-userupdate.service';
import { FirebaseUserService } from 'app/services/firebase-services/firebase-user.service';

interface Emoji {
  icon: string;
  iconId: string;
  userId: string;
}

@Component({
  selector: 'app-other-user-message',
  standalone: true,
  templateUrl: './other-user-message.component.html',
  styleUrl: './other-user-message.component.scss',
  imports: [DatePipe, ReactionsComponent, CommonModule],
})
export class OtherUserMessageComponent {
  firestore: Firestore = inject(Firestore);
  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);
  firebaseChatService = inject(FirebaseChatService);
  firebaseUpdate = inject(FirebaseUserupdateService);
  firebaseUser = inject(FirebaseUserService);

  openReaction: boolean = false;
  @Input() message: any;
  @Input() isThread: boolean = false;

  emojiArray: Emoji[] = [];
  postingTime: string | null = null;
  user: User = new User();
  originalMessage = {
    message: '',
    answerto: '',
    userId: '',
    timestamp: 0,
    emoji: [{ icon: '', userId: [] as any[], iconId: '' }],
  };

  messageInfo = { hasUrl: false, message: '', textAfterUrl: '', messageImgUrl: '' };
  userId: string = 'guest';
  answerKey: string = '';
  answercount: number = 0;
  lastAnswerTime: number = 0;

  profile: User = { img: '', name: '', isActive: false, email: '', relatedChats: [] };
  mouseover: boolean = false;
  hoverUser: string = '';
  hoverIndex: number = 0;
  count: number = 0;
  isImage: boolean = false;

  constructor(private elementRef: ElementRef) {

  }

  async getUser2(id: string) {
    this.user = new User(await this.firebaseUser.getUserData(id));
  }

  /**
   * this function calls function getUser() for providing userdata for the post
   */
  ngOnInit() {
    this.getUser2(this.message.userId);
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
    this.openReaction = !this.openReaction; //geändert, damit man es auch wieder schließen kann, wenn mannochmal auf das Element klickt
    this.globalVariables.editMessage = false;
  }

  /**
   * this listener is for closing the emoji container
   * @param event - click event
   */
  @HostListener('document:click', ['$event'])
  onClick(event: any) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.onCloseReactions();
    }
  }
  /**
   * just set flags for closing emoji container
   */
  onCloseReactions() {
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
