import {
  Component,
  inject,
  ChangeDetectorRef,
  AfterContentChecked,
  Input,
  ElementRef,
  ViewChild,
  AfterViewChecked,
} from '@angular/core';
import { OtherUserMessageComponent } from 'app/shared/chats/other-user-message/other-user-message.component';
import { CurrentUserMessageComponent } from 'app/shared/chats/current-user-message/current-user-message.component';
import { ChatChannel } from 'app/models/chatChannel.class';
import { ChatUsers } from 'app/models/chatUsers.class';
import { FirebaseChatService } from 'app/services/firebase-services/firebase-chat.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { CommonModule, DatePipe, ViewportScroller } from '@angular/common';
import { ReactionsComponent } from '../../reactions/reactions.component';
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
    DatePipe,
  ],
})
export class AllMessagesComponent implements AfterViewChecked {
  firebaseChatService = inject(FirebaseChatService);
  globalVariablesService = inject(GlobalVariablesService);
  GlobalFunctionsService = inject(GlobalFunctionsService);

  chatChannel: ChatChannel = new ChatChannel();
  chatUsers: ChatUsers = new ChatUsers();
  postingTime: string | null = null;
  index: number = 0;

  lastDisplayedDate: Date = new Date();

  @Input() isChat: boolean = false;
  @Input() isThread: boolean = false;
  @ViewChild('scrolldown') scrollDownElement!: ElementRef;

  constructor(private changeDetector: ChangeDetectorRef) { }

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
  ngAfterContentChecked(): void {
    this.changeDetector.detectChanges();
  }

  ngOnInit() {
    if (this.globalVariablesService.chatChannel.messages.length > 0) {
      this.lastDisplayedDate = new Date(
        this.globalVariablesService.chatChannel.messages[0].timestamp
      );
    }
  }

  filterMessages() {
    let messages = this.globalVariablesService.chatChannel.messages;
    //console.log('messages: ', this.globalVariablesService.chatChannel.messages);
   // console.log('filtered messages: ', this.globalVariablesService.chatChannel.messages.filter(message => message.answerto === this.globalVariablesService.answerKey));
    const channelChat = messages.filter(message => message.answerto === '');
    const threadChat = messages.filter(message => message.answerto === this.globalVariablesService.answerKey);
    const userchat = messages;
    if (this.globalVariablesService.isUserChat) {
      // console.log('ein user Chat');
      return userchat;
    } else {
      // console.log('ein channel Chat');
      return this.isThread ? threadChat : channelChat;
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
    return today ? 'Heute' : new Date(timestamp).toLocaleDateString('de-DE', { weekday: 'long' });
  }

  /**
   * this function returns false if the previous message has the same date like the current massage
   * it also overwrites the lastDisplayedDate if displayDate == true
   * @param messageTimestamp - timestamp of message
   * @returns - boolean
   */
  showDateBar(messageTimestamp: number, answerTo: string, index: number): boolean {
    //debugger;
    let displayDate = false;
    if (this.isChat || this.isThread) {
      if (index == 0)
        displayDate = true;
      else {
        displayDate = (this.lastDisplayedDate.toLocaleDateString() !== new Date(messageTimestamp).toLocaleDateString())
          && answerTo == '';
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
  meetContitionsCurrentUser(message: {
    answerto: string;
    message: string;
    timestamp: number;
    userId: string;
  }) {
    // return (message.userId === this.globalVariablesService.activeID && message.message != '' && message.answerto =='');
    let conditionTest: boolean = false;
    if (this.isChat)
      conditionTest = message.userId == this.globalVariablesService.activeID && message.answerto == ''; /* message.message != '' && */
    else if (this.isThread) {
      conditionTest =
        message.userId === this.globalVariablesService.activeID &&
        message.message != '' &&
        message.answerto === this.globalVariablesService.answerKey;
    }
    else conditionTest = false;
    return conditionTest;
  }

  /**
   * this function is for setting the conditions for showing all messages from other users which are not an answer
   * @param message - object
   * @returns - boolean
   */
  meetContitionsOtherUser(message: { answerto: string; message: string; timestamp: number; userId: string; }) {
    let conditionTest: boolean = false;
    if (this.isChat)
      conditionTest =
        message.userId !== this.globalVariablesService.activeID &&
        message.message != '' &&
        message.answerto == '';
    else if (this.isThread) {
      conditionTest =
        message.userId !== this.globalVariablesService.activeID &&
        message.message != '' &&
        message.answerto === this.globalVariablesService.answerKey;
    }
    else conditionTest = false;
    return conditionTest;
  }

/*   logBefehl(i: number) {
    console.log(i);
  } */
}
