import { Component, inject, Input } from '@angular/core';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { FirebaseChatService } from 'app/services/firebase-services/firebase-chat.service';
import { Firestore, doc, collection, onSnapshot, } from '@angular/fire/firestore';


import { User } from 'app/models/user.class';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-other-user-message',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './other-user-message.component.html',
  styleUrl: './other-user-message.component.scss'
})


export class OtherUserMessageComponent {

  firestore: Firestore = inject(Firestore);
  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);
  firebaseChatService = inject(FirebaseChatService);
  @Input() message: any;

  postingTime: string | null = null;
  user: User = new User;

  unsubUser;
  userId: string = 'guest';

  constructor() {
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
    this.globalVariables.openChat = 'isPrivatChatVisable';
    if (window.innerWidth < 1100)
      this.globalVariables.showChannelMenu = false;
    if (window.innerWidth < 700) {
      this.globalVariables.showChannelMenu = false;
      // this.globalVariables.isPrivatChatVisable = false;
    }
  }

}
