import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { AddNewChannelComponent } from './add-new-channel/add-new-channel.component';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { FirebaseChatService } from 'app/services/firebase-services/firebase-chat.service';
import { channel } from 'app/models/channel.class';
import { FirebaseUserService } from 'app/services/firebase-services/firebase-user.service';

@Component({
  selector: 'app-channel-menu',
  standalone: true,
  templateUrl: './channel-menu.component.html',
  styleUrl: './channel-menu.component.scss',
  imports: [
    RouterLink,
    CommonModule,
    AddNewChannelComponent,
    InputfieldComponent,
  ],
})
export class ChannelMenuComponent {
  globalVariables = inject(GlobalVariablesService);
  firebaseChatService = inject(FirebaseChatService);
  firebasUserService = inject(FirebaseUserService);
  allChannels: any = [];
  allUsers: any = [];

  constructor(public globalFunctions: GlobalFunctionsService) { }

  /**
   * this function just opens and close the menu for selecting a channel
   */
  openChannelMenu() {
    const channelMsg = document.getElementById('channelMsgArrow') as HTMLImageElement | null;
    let channelDiv = document.getElementById('channels');
    if (channelDiv) {
      if (channelDiv.classList.contains('d-none')) {
        channelDiv.classList.remove('d-none');
        if (channelMsg) {
          channelMsg.src = './assets/img/icons/arrow_drop_down.svg';
        }
      } else {
        channelDiv.classList.add('d-none');
        if (channelMsg) {
          channelMsg.src = './assets/img/icons/arrow_drop_down_default.svg';
        }
      }
    }
  }

  /**
   * this function just opens and close the menu for selecting a user chat
   */
  openDirectMessageMenu() {
    const arrowMsg = document.getElementById(
      'msgActiveArrow'
    ) as HTMLImageElement | null;
    let channelDiv = document.getElementById('directMessage');

    if (channelDiv) {
      if (channelDiv.classList.contains('d-none')) {
        channelDiv.classList.remove('d-none');
        if (arrowMsg) {
          arrowMsg.src = './assets/img/icons/arrow_drop_down.svg';
        }
      } else {
        channelDiv.classList.add('d-none');
        if (arrowMsg) {
          arrowMsg.src = './assets/img/icons/arrow_drop_down_default.svg';
        }
      }
    }
  }

  ngOnInit() {
    this.globalFunctions.getCollection('channels', this.allChannels);
    this.globalFunctions.getCollection('users', this.allUsers);
  }


  /**
   * this funktion sets the flag to show the header for channels and take over information of the related channel object to global variables
   * @param channel - object which contains information of selecet channel
   */
  openChannel(channel: any) {
    this.globalVariables.scrolledToBottom = false;
    this.globalVariables.isUserChat = false;
    this.getChatUserData(channel.members);
    this.globalVariables.openChannel.desc = channel.description;
    this.globalVariables.openChannel.titel = channel.channelName;
    this.globalVariables.openChannel.id = channel.id;
    this.globalVariables.openChannel.chatId = channel.chatId;
    this.firebaseChatService.activeChatId = channel.chatId;
    this.globalFunctions.showChat();
  }

  /**
   * This function fills the channelUser Array with all relevant data
   * @param member - Array of member ids
   */
  async getChatUserData(member: string[]) {
    this.globalVariables.openChannelUser = [];
    const userDataList = await Promise.all(this.getMemberData(member));
    const filteredUserDataList = userDataList.filter(userData => userData !== null) as { id: string, name: string, img: string }[];
    this.globalVariables.openChannelUser.push(...filteredUserDataList);
    //console.log('Benutzerdaten:', this.globalVariables.openChannelUser);
  }

  /**
   * this function returns an array with user data for all user listed for the channel
   * @param member - Array of member ids
   * @returns - returns an array with uid, name and image path
   */
  getMemberData(member: string[]) {
    return member.map(async (userId) => {
      const memberData = await this.firebasUserService.getUserData(userId);
      if (memberData) {
        return { id: userId, name: memberData['name'], img: memberData['img'] };
      } else {
        return null;
      }
    });
  }

}
