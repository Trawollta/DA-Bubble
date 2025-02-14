import {
  Component,
  inject,
  ChangeDetectorRef,
 AfterContentChecked,
  Input,
  ElementRef,
  ViewChild,
  AfterViewChecked,
  OnChanges,
  OnInit
} from '@angular/core';
import { OtherUserMessageComponent } from 'app/shared/chats/other-user-message/other-user-message.component';
import { CurrentUserMessageComponent } from 'app/shared/chats/current-user-message/current-user-message.component';
import { ChatChannel } from 'app/models/chatChannel.class';
import { ChatUsers } from 'app/models/chatUsers.class';
// import { FirebaseChatService } from 'app/services/firebase-services/firebase-chat.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactionsComponent } from '../../reactions/reactions.component';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-all-messages',
  standalone: true,
  templateUrl: './all-messages.component.html',
  styleUrl: './all-messages.component.scss',

  imports: [
    CommonModule,
    OtherUserMessageComponent,
    CurrentUserMessageComponent,
    // ReactionsComponent,
    DatePipe,
  ],
})
export class AllMessagesComponent implements AfterViewChecked, OnInit {
  // firebaseChatService = inject(FirebaseChatService);
  globalVariablesService = inject(GlobalVariablesService);
  GlobalFunctionsService = inject(GlobalFunctionsService);

  chatChannel: ChatChannel = new ChatChannel();

  chatUsers: ChatUsers = new ChatUsers(); // das wird denke ich nicht gebraucht
  postingTime: string | null = null;
  index: number = 0;
  userName: string = '';
  userImgPath: string = '';

  lastDisplayedDate: Date = new Date();

  @Input() isChat: boolean = false;
  @Input() isThread: boolean = false;
  @Input() messages: any[] = [];
  @ViewChild('scrolldown') scrollDownElement!: ElementRef;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    console.log("🚀 AllMessagesComponent gestartet");
    
    // Hole Benutzer-ID aus LocalStorage, falls nicht gesetzt
    if (!this.globalVariablesService.activeID || this.globalVariablesService.activeID === 'guest') {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            this.globalVariablesService.activeID = storedUserId;
            console.log("✅ Benutzer-ID aus LocalStorage geladen:", this.globalVariablesService.activeID);
        } else {
            console.log("⚠️ Keine Benutzer-ID im LocalStorage gefunden!");
        }
    }
}






  /**
   * this function checks if the chat is scrolled down
   */
  ngAfterViewChecked() {
    if (!this.globalVariablesService.scrolledToBottom) {
      setTimeout(() => {
        this.scrollToElement();
        this.globalVariablesService.scrolledToBottom = true;
      }, 400);
    }
  }

  /**
   * this function scrolls down the chat
   */
  scrollToElement() {
    this.scrollDownElement.nativeElement.scrollIntoView({ behavior: 'auto', block: 'end', inline: 'nearest' });
  }


  //this function avoids the ExpressionChangedAfterItHasBeenCheckedError in the developer Mode
/*   ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }


  /**
   * this function filters all messages if they are answers of a message or not and returns the chat 
   * @returns - chat
   */
  filterMessages() {
    console.log("🔍 `filterMessages()` wurde aufgerufen!");
    console.log("📩 Nachrichten vor Filterung:", this.messages);

    let messages = this.messages.filter(message => message.content); // Falls `null` oder `undefined` entfernt werden soll

    console.log("📊 Nachrichten nach Filterung:", messages);
    
    if (messages.length === 0) {
        console.warn("⚠️ KEINE Nachrichten gefunden! Überprüfe API-Daten.");
    }

    return messages; 
}




  /**
   * this function returns the weekday in German of the day of the message timestamp
   * this function needs to reviewed in case other langeuages should be supported
   * @param timestamp - the timestamp of the message
   * @returns - weekday as string
   */
  getWeekDay(timestamp: number): string {
    const today = new Date(timestamp).toDateString() == new Date().toDateString();
    return today ? 'Heute' : new Date(timestamp).toLocaleDateString('de-DE', { weekday: 'long' });
  }

  /**
   * this function returns false if the previous message has the same date like the current massage
   * it also overwrites the lastDisplayedDate if displayDate == true
   * @param messageTimestamp - timestamp of message
   * @returns - boolean
   */
  showDateBar(messageTimestamp: number, index: number, message: string): boolean {
    let displayDate = false;
    if(message === ''){
      return displayDate = false;
    }
    if (this.isChat || this.isThread) {
      if (index == 0)
        return displayDate = true;
      else {
        displayDate = (this.lastDisplayedDate.toLocaleDateString() !== new Date(messageTimestamp).toLocaleDateString());
      }
    }
    if (displayDate && messageTimestamp != 0) {
      this.lastDisplayedDate = new Date(messageTimestamp);
    }
    return displayDate;
  }

  /**
   * this function is for setting the conditions for showing all messages from current users which are not an answer
   * @param message - object
   * @returns - boolean
   */
  meetContitionsCurrentUser(userId: number) {
    console.log("👤 Checking meetContitionsCurrentUser:");
    console.log("🔹 userId:", userId);
    console.log("🔹 activeID:", this.globalVariablesService.activeID);

    return userId === Number(this.globalVariablesService.activeID);
}

meetContitionsOtherUser(userId: number) {
    console.log("👤 Checking meetContitionsOtherUser:");
    console.log("🔹 userId:", userId);
    console.log("🔹 activeID:", this.globalVariablesService.activeID);

    return userId !== Number(this.globalVariablesService.activeID);
}


}
