import { Component, inject, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { OtherUserMessageComponent } from 'app/shared/chats/other-user-message/other-user-message.component';
import { CurrentUserMessageComponent } from 'app/shared/chats/current-user-message/current-user-message.component';
import { ChatChannel } from 'app/models/chatChannel.class';
import { ChatUsers } from 'app/models/chatUsers.class';
import { FirebaseChatService } from 'app/services/firebase-services/firebase-chat.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactionsComponent } from "../../reactions/reactions.component";
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';


@Component({
  selector: 'app-all-messages',
  standalone: true,
  templateUrl: './all-messages.component.html',
  styleUrl: './all-messages.component.scss',
  
  imports: [
    CommonModule,
    OtherUserMessageComponent,
    CurrentUserMessageComponent,
    ReactionsComponent,
    DatePipe
  ]
})
export class AllMessagesComponent {

  firebaseChatService = inject(FirebaseChatService);
  globalVariablesService = inject(GlobalVariablesService);
  GlobalFunctionsService = inject(GlobalFunctionsService);

  

  chatChannel: ChatChannel = new ChatChannel;
  chatUsers: ChatUsers = new ChatUsers;
  postingTime: string | null = null;

  lastDisplayedDate: Date = new Date();

  constructor(private changeDetector: ChangeDetectorRef){}
  ngOnInit() {
    //this.lastDisplayedDate = new Date()
     if (this.globalVariablesService.chatChannel.messages.length > 0) {
      this.lastDisplayedDate = new Date(this.globalVariablesService.chatChannel.messages[0].timestamp);
    }

  }

  /**
   * this function returns the weekday in German of the day of the message timestamp
   * this function needs to reviewed in case other langeuages should be supported
   * @param timestamp - the timestamp of the message
   * @returns - weekday as string
   */
  getWeekDay(timestamp: number): string {
    const today = new Date(timestamp).toDateString() == new Date().toDateString();
    return today? 'Heute' : new Date(timestamp).toLocaleDateString('de-DE', {weekday: 'long'});
  }

  /**
   * this function returns false if the previous message has the same date like the current massage
   * it also overwrites the lastDisplayedDate if displayDate == true
   * @param messageTimestamp - timestamp of message
   * @returns - boolean
   */
  showDateBar(messageTimestamp: number): boolean {
    const displayDate = this.lastDisplayedDate.toLocaleDateString() !== new Date(messageTimestamp).toLocaleDateString();
    if (displayDate && messageTimestamp !=0) {
      this.lastDisplayedDate = new Date(messageTimestamp);
    }
    return displayDate;
  }

//this function avoids the ExpressionChangedAfterItHasBeenCheckedError in the developer Mode
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

}
