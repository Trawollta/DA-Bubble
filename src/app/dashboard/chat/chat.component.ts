import { Component, inject } from '@angular/core';
import { InputfieldComponent } from '../../shared/inputfield/inputfield.component';
import { CommonModule, ViewportScroller } from '@angular/common';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { EditChannelComponent } from '../channel-menu/edit-channel/edit-channel.component';
import { AllMessagesComponent } from 'app/shared/chats/all-messages/all-messages.component';
import { AddContactsComponent } from '../channel-menu/add-contacts/add-contacts.component';
import { AddToChannelComponent } from "../channel-menu/add-to-channel/add-to-channel.component";
import { ShowContactsComponent } from '../channel-menu/show-contacts/show-contacts.component';
import { FormsModule } from '@angular/forms';
import { FirebaseChatService } from 'app/services/firebase-services/firebase-chat.service';
import { FirebaseChannelService } from 'app/services/firebase-services/firebase-channel.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  imports: [
    InputfieldComponent,
    CommonModule,
    EditChannelComponent,
    AllMessagesComponent,
    AddContactsComponent,
    AddToChannelComponent,
    ShowContactsComponent,
    FormsModule
  ]
})
export class ChatComponent {
  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);
  firebaseChatService = inject(FirebaseChatService);
  firebaseChannelService = inject (FirebaseChannelService);
  //scroller = inject(ViewportScroller);
  allUserMessages: string = '';
  newMessage = '';

  constructor(private scroller: ViewportScroller){
    this.scroller.scrollToAnchor("scrolldown");
  }
  openEmojis() {
    let emojiDiv = document.getElementById('emojis');
    if (emojiDiv && emojiDiv.classList.contains('d-none')) {
      emojiDiv.classList.remove('d-none');
    } else if (emojiDiv && emojiDiv.classList.contains('d-none') == false) {
      emojiDiv.classList.add('d-none');
    }
  }

  ngOnInit(){
    this.scroller.scrollToAnchor("scrolldown");
  }
  goDown() {
    this.scroller.scrollToAnchor("scrolldown");
  }


  openAnswers() {
    this.globalVariables.showThread = !this.globalVariables.showThread;
    if (window.innerWidth < 1100)
      this.globalVariables.showChannelMenu = false;
  }

  sendMessage() {

    if (this.newMessage !== '') {
      this.globalVariables.messageData.userId = this.globalVariables.activeID;
      this.globalVariables.messageData.timestamp = new Date().getTime();
      this.globalVariables.messageData.answerto = '';
      this.globalVariables.messageData.message = this.newMessage;
      this.globalVariables.messageData.emoji = [{ icon: '', userId: [] as any[], iconId: '' }];
//console.log('elcher Channel ist offen: ',this.globalVariables.openChannel);
//console.log('chatId:', this.globalVariables.openChannel.chatId );
      let chatFamiliy = this.globalVariables.isUserChat ? 'chatusers' : 'chatchannels';
      // hier benötige ich die chatId und muss chatusers wählen wenn this.globalVariablesService.isUserChat
      
        this.firebaseChatService.sendMessage(this.globalVariables.openChannel.chatId, chatFamiliy);
      
      
      this.globalVariables.messageData.message = '';
      this.newMessage = '';
    }
    //this.goDown();
  }

  submitChannelNameChange(newTitle: string): void {
    const channelId = this.globalVariables.openChannel.id; // Die ID des aktuellen Kanals
    this.firebaseChannelService.updateChannelTitle(channelId, newTitle);
  }
}
