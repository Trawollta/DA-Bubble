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
  arrayRemove
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
  imports: [ReactionsComponent, CommonModule, DatePipe, FormsModule, InputfieldComponent],
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

  postingTime: string | null = null;
  user: User = new User();
  messageData = {
    message: '',
    answerto: '',
    userId: '',
    timestamp: 0,
    emoji: [{ icon: '', userId: '' }],
  };
  editMessage: boolean = false;
  readonly originalMessage: any;

  unsubUser;
  userId: string = 'guest';

  constructor(
    private changeDetector: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {
    this.unsubUser = this.getUser(this.userId);
    this.originalMessage = this.message;
    console.log('was steht lokal in originalMessage: ', this.originalMessage);
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
    this.user = this.message.userId;
    this.getUser(this.message.userId);
    this.postingTime = this.message.timestamp;

  }

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
    this.fillInitialUserObj();
    this.globalVariables.openChat = 'isChatVisable';
    this.globalVariables.messageData.answerto =
      this.message.userId + '_' + this.message.timestamp.toString();
    if (window.innerWidth < 1100) this.globalVariables.showChannelMenu = false;
    if (window.innerWidth < 700) {
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

  editOpen() {
    this.editMessage = true;

  }

  editClose() {
    this.editMessage = false;
  }

  editSave() {

    console.log('was steht lokal in originalMessage: ', this.originalMessage);
    this.editMessage = false;
    this.globalVariables.messageData = this.message;
    this.firebaseChatService.sendMessage(this.globalVariables.openChannel.chatId);
    this.remove(this.globalVariables.openChannel.chatId);


  }

  log() {
    console.log(this.index);
    //console.log(this.remove(this.globalVariables.openChannel.chatId));

  }

  remove(chatId: string) {
    console.log('was steht lokal in message beim löschen: ', this.message);
    console.log('was steht lokal in originalMessage beim löschen: ', this.originalMessage);
    return updateDoc(doc(this.firestore, 'chatchannels', chatId), {
      messages: arrayRemove(this.originalMessage),
    });
  }

  //hier muss im Grunde nur das Array mit den Emojjies bearbeitet werden. 
  // das Array wird dann this.global
  updateEmoji(chatId: string, messageIndex: number) {
    console.log(this.globalVariables.messageData);
    debugger;
    const updatedEmojis = arrayUnion(this.firebaseChatService.newEmojiToJson());
    this.message.emojis = updatedEmojis;
    console.log(this.message)
    console.log(this.globalVariables.messageData);

    return updateDoc(doc(this.firestore, 'chatchannels', chatId), {
      ['messages.' + messageIndex + '.emojis']: updatedEmojis,
    });
  }


}
