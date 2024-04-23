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
import { FirebaseChannelService } from 'app/services/firebase-services/firebase-channel.service';

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
  firebaseChannelService = inject(FirebaseChannelService)
  allChannels: any = [];
  allUsers: any = [];
  channelToDisplay: any = [];
  selectedChannel: any; 
  private previousRelatedChats: string[] = [];

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

  ngOnInit(): void {
    this.watchRelatedChatsChanges();
  }

  watchRelatedChatsChanges() {
    setInterval(() => {
      if (this.isRelatedChatsChanged()) {
        this.getChannel();
      }
    }, 1000); 
  }

  isRelatedChatsChanged(): boolean {
    const currentRelatedChats = this.globalVariables.currentUser.relatedChats;
    if (this.previousRelatedChats && JSON.stringify(this.previousRelatedChats) !== JSON.stringify(currentRelatedChats)) {
      this.previousRelatedChats = currentRelatedChats;
      return true;
    }
    this.previousRelatedChats = currentRelatedChats;
    return false;
  }



  async getChannel() {
    this.allChannels = [];
    if (this.globalVariables.currentUser.relatedChats.length > 0) {
      for (let i = 0; i < this.globalVariables.currentUser.relatedChats.length; i++) {
        const channelId = this.globalVariables.currentUser.relatedChats[i];
        const channel = await this.firebaseChannelService.getDocId(channelId);
        channel.forEach(async channel => {
          let data = await this.firebaseChannelService.getChannelData(channel)
          console.log(data)
          this.allChannels.push(data);
        });
      }
      console.log(this.allChannels)
    } else {
      console.log("Der Benutzer hat keine Chatverbindungen.");
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
