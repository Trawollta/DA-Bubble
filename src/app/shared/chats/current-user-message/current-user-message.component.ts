import { Component, inject, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Firestore, doc, collection, onSnapshot, } from '@angular/fire/firestore';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { ReactionsComponent } from 'app/shared/reactions/reactions.component';
import { FirebaseChatService } from 'app/services/firebase-services/firebase-chat.service';
import { User } from 'app/models/user.class';


@Component({
  selector: 'app-current-user-message',
  standalone: true,
  imports: [
    ReactionsComponent,
    CommonModule,
    DatePipe
  ],
  templateUrl: './current-user-message.component.html',
  styleUrl: './current-user-message.component.scss',
})



export class CurrentUserMessageComponent {

  firestore: Firestore = inject(Firestore);
  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);
  firebaseChatService = inject(FirebaseChatService);

  @Input() message: any;

  postingTime: string | null = null;
  user: User = new User;

  unsubUser;
  userId:string = 'guest';

  constructor() {
    this.unsubUser = this.getUser(this.userId);
    
  }

  ngOnDestroy() {
    this.unsubUser;
  }


  getUserRef(docId: string) {
    return doc(collection(this.firestore, 'users'), docId);
  }


  getUser(id: string) {
     onSnapshot(this.getUserRef(id), (user) => {
      if(user.data()){
        this.user = new User(user.data());
      }
    });
    return 
  }


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
    this.globalVariables.openChat = 'isChatVisable';
    if (window.innerWidth < 1100) this.globalVariables.showChannelMenu = false;
    if (window.innerWidth < 700) {
      this.globalVariables.showChannelMenu = false;
      this.globalVariables.isChatVisable = false;
    }
  }

  openReactionDialog() {
    console.log('test');
  }
}
