import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { AddNewChannelComponent } from './add-new-channel/add-new-channel.component';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';

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
  allChannels: any = [];
  allUsers: any = [];

  constructor(public globalFunctions: GlobalFunctionsService) {}

  /**
   * this function just opens and close the menu for selecting a channel
   */
  openChannels() {
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
        if (channelMsg) {
          channelMsg.src = './assets/img/icons/arrow_drop_down_default.svg';
        }
      }
    }
  }

  /**
   * this function just opens and close the menu for selecting a user chat
   */
  openDirectMessage() {
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
  /*  openChannelChat() {
    this.globalVariables.isChatVisable = true;
    this.globalVariables.isPrivatChatVisable = false;
  } */

  /**
   * this funktion sets the flag to show the header for channels and take over information of the related channel object to global variables
   * @param channel - object which contains information of selecet channel
   */
  openChannelList(channel: any) {
    // console.log(channel);
    // this.openChannelDescribe(channel.description);
    this.globalVariables.isUserChat = false;
    this.globalVariables.openChannelDesc = channel.description;
    this.globalVariables.openChannel = channel.channelName;
    this.showChat();
    /*  this.globalVariables.isPrivatChatVisable = false;
     if(!this.globalVariables.desktop700){
       this.globalVariables.isChannelVisible = true;
       this.globalVariables.showChannelMenu = false;
     } else this.globalVariables.isChannelVisible = true; */
  }

  /* openChannelDescribe(desc: string) {
     this.globalVariables.openChannelDesc = desc;
      this.globalVariables.isPrivatChatVisable = false;
     if(!this.globalVariables.desktop700){
       this.globalVariables.isChannelVisible = true;
       this.globalVariables.showChannelMenu = false;
     } else this.globalVariables.isChannelVisible = true; 
     
   }*/
  openDirectMessageUser(user: any) {
    //let userToChatWith = [user];
    this.globalVariables.isUserChat = true;
    this.globalVariables.userToChatWith.name = user.name;
    this.globalVariables.userToChatWith.img = user.img;
    this.showChat();
    /*  this.globalVariables.isPrivatChatVisable = true;*/
    /*  this.globalVariables.isChatVisable = true;
    if(!this.globalVariables.desktop700){
      //this.globalVariables.isPrivatChatVisable = true;
      this.globalVariables.showChannelMenu = false;
    } //else this.globalVariables.isPrivatChatVisable = true;  */
  }

  /**
   * this function stets the flag for visability for chat
   */
  showChat() {
    this.globalVariables.isChatVisable = true;
    if (!this.globalVariables.desktop700) {
      this.globalVariables.showChannelMenu = false;
    }
  }
}
