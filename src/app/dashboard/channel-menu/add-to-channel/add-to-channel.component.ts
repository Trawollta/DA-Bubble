import { Component } from '@angular/core';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModel } from '@angular/forms';
import { ButtonComponent } from 'app/shared/button/button.component';
import { AddContactsComponent } from '../add-contacts/add-contacts.component';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';


@Component({
  selector: 'app-add-to-channel',
  standalone: true,
  imports: [
    CommonModule, ButtonComponent, AddContactsComponent
  ],
  templateUrl: './add-to-channel.component.html',
  styleUrl: './add-to-channel.component.scss'
})
export class AddToChannelComponent {

  
  globalFunctions = inject(GlobalFunctionsService);
  globalVariables= inject (GlobalVariablesService)

  addNewChannel() {

    this.globalFunctions.addData('channels', this.globalVariables.channelData);
    this.globalVariables.openChannel.titel = this.globalVariables.channelData.channelName;
    this.globalVariables.channelData.channelName = '';
    this.globalVariables.channelData.description = '';
    this.globalVariables.channelData.chatId = '';
    this.globalFunctions.closeUserOverlay();
  }

}
