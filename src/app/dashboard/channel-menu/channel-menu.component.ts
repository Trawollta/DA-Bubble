import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { AddNewChannelComponent } from './add-new-channel/add-new-channel.component';

@Component({
  selector: 'app-channel-menu',
  standalone: true,
  templateUrl: './channel-menu.component.html',
  styleUrl: './channel-menu.component.scss',
  imports: [RouterLink, CommonModule, AddNewChannelComponent],
})
export class ChannelMenuComponent {
  globalVariables = inject(GlobalVariablesService);
  allChannels: any = [];
  allUsers: any = [];

  constructor(public globalFunctions: GlobalFunctionsService) { }

  openChannels() {
    let channelDiv = document.getElementById('channels');
    if (channelDiv && channelDiv.classList.contains('d-none')) {
      channelDiv.classList.remove('d-none');
    } else if (channelDiv && channelDiv.classList.contains('d-none') == false) {
      channelDiv.classList.add('d-none');
    }
  }

  openDirectMessage() {
    let channelDiv = document.getElementById('directMessage');
    if (channelDiv && channelDiv.classList.contains('d-none')) {
      channelDiv.classList.remove('d-none');
    } else if (channelDiv && channelDiv.classList.contains('d-none') == false) {
      channelDiv.classList.add('d-none');
    }
  }

  ngOnInit() {
    this.globalFunctions.getCollection('channels', this.allChannels);
    this.globalFunctions.getCollection('users', this.allUsers);
  }
  openChannelChat(){
    this.globalVariables.isChatVisable = true;
    this.globalVariables.isPrivatChatVisable = false;
  }
}
