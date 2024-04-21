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
import { user } from '@angular/fire/auth';
import { SearchbarComponent } from 'app/shared/searchbar/searchbar/searchbar.component';

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
    SearchbarComponent,
  ],
})
export class ChannelMenuComponent {
  globalVariables = inject(GlobalVariablesService);
  firebaseChatService = inject(FirebaseChatService);
  firebasUserService = inject(FirebaseUserService);
  allChannels: any = [];
  allUsers: any = [];
  channelToDisplay: any = [];
  selectedChannel: any; 

  constructor(public globalFunctions: GlobalFunctionsService) {}

  /**
   * this function just opens and close the menu for selecting a channel
   */
  async openChannelMenu() {
    await this.getChannel();
    const channelMsg = document.getElementById(
      'channelMsgArrow'
    ) as HTMLImageElement | null;
    let channelDiv = document.getElementById('channels');
    if (channelDiv) {
      if (channelDiv.classList.contains('d-none')) {
        channelDiv.classList.remove('d-none');
        if (channelMsg) {
          channelMsg.src = './assets/img/icons/arrow_drop_down.svg';
        }
      } else {
        channelDiv.classList.add('d-none');
        this.channelToDisplay = [];
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

  async ngAfterViewInit() {
    await this.globalFunctions.getCollection('channels', this.allChannels);
    await this.globalFunctions.getCollection('users', this.allUsers);   
    this.openDirectMessageMenu();
    setTimeout(() => {
      this.openChannelMenu();
    }, 2000);
  }



  async filterChannelsByActiveID(activeID: string) {
    let channelsWithActiveID: any[] = [];
    this.allChannels.forEach((channel: any) => {
      if (channel.members.includes(activeID)) {
        channelsWithActiveID.push(channel);
      }
    });
    return channelsWithActiveID;
  }

  async getChannel() {
    const filteredChannels = await this.filterChannelsByActiveID(
      this.globalVariables.activeID
    );
    if (filteredChannels.length > 0) {
      this.channelToDisplay.push(...filteredChannels);
    }
  }

  /**
   * this funktion sets the flag to show the header for channels and take over information of the related channel object to global variables
   * @param channel - object which contains information of selecet channel
   */
  openChannel(channel: any) {
    this.selectedChannel = channel;
    this.globalFunctions.openChannel(channel);
  }


  openChannelOverlay() {
    this.globalVariables.showAddChannel = true;
    document.body.style.overflow = 'hidden';
  }

  updateChannelArray() {
    this.openChannelMenu();
  }

}
