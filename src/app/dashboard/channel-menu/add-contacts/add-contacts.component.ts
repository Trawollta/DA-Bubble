import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { ButtonComponent } from 'app/shared/button/button.component';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { AddNewChannelComponent } from '../add-new-channel/add-new-channel.component';
import { FirebaseChatService } from 'app/services/firebase-services/firebase-chat.service';
import { FirebaseCannelService } from 'app/services/firebase-services/firebase-cannel.service';


@Component({
  selector: 'app-add-contacts',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    InputfieldComponent,
    AddNewChannelComponent
  ],
  templateUrl: './add-contacts.component.html',
  styleUrl: './add-contacts.component.scss'
})
export class AddContactsComponent {

  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);
  firebaseChatService = inject(FirebaseChatService);
  firebaseChannelService = inject(FirebaseCannelService);

  addedChannelId: string = '';
  addedChatId: string = '';

  [x: string]: any;

  constructor() { }

  async addNewChannel() {
    //add new chanel and return channelId
    await this.globalFunctions.addData('channels', this.globalVariables.channelData).then(response => {
      this.addedChannelId = response.id;
    }).catch(error => {
      console.error('Fehler beim Hinzufügen des Kanals:', error);
    });
   // console.log('channel added: ', this.addedChannelId);
    // add new chat and save channelID in it and return chatId

    await this.firebaseChatService.addChat(this.addedChannelId).then(response => {
      this.addedChatId = response.id;
    }).catch(error => {
      console.error('Fehler beim Hinzufügen des Chats:', error);
    });
   // console.log('chat added: ', this.addedChatId);

    //add chatId to channel
    await this.firebaseChannelService.updateChannel(this.addedChannelId, { chatId: this.addedChatId });
    // hier benötige ich noch eine Funktion, die einen Chat erstellt. In diesen Chat speichere ich die 
    // von diesem Chat
    this.globalVariables.openChannel.titel = this.globalVariables.channelData.channelName;
    this.globalVariables.channelData.channelName = '';
    this.globalVariables.channelData.description = '';
    this.globalVariables.channelData.chatId = '';
    this.globalFunctions.closeUserOverlay();
  }

}
