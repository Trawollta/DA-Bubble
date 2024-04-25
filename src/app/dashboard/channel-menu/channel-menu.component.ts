import { Component, inject } from '@angular/core';
//import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { AddNewChannelComponent } from './add-new-channel/add-new-channel.component';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { FirebaseChatService } from 'app/services/firebase-services/firebase-chat.service';
import { FirebaseUserService } from 'app/services/firebase-services/firebase-user.service';
import { SearchbarComponent } from 'app/shared/searchbar/searchbar/searchbar.component';
import { FirebaseChannelService } from 'app/services/firebase-services/firebase-channel.service';

@Component({
  selector: 'app-channel-menu',
  standalone: true,
  templateUrl: './channel-menu.component.html',
  styleUrl: './channel-menu.component.scss',
  imports: [
    //RouterLink,
    CommonModule,
    AddNewChannelComponent,
    InputfieldComponent,
    SearchbarComponent,
  ],
})
export class ChannelMenuComponent {
  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);
  firebaseChatService = inject(FirebaseChatService);
  firebasUserService = inject(FirebaseUserService);
  firebaseChannelService = inject(FirebaseChannelService)
 
  //allUsers: any = [];
  channelToDisplay: any = [];
  selectedChannel: any; 
  isChannelMenuOpen: boolean = true;
  isUserlMenuOpen: boolean = true;
 

  constructor() {}

  /**
   * this function just opens and close the menu for selecting a channel
   */
  openChannelMenu() {
    this.isChannelMenuOpen = !this.isChannelMenuOpen;
  }
  

  /**
   * this function just opens and close the menu for selecting a user chat
   */
  openDirectMessageMenu() {
    this.isUserlMenuOpen = !this.isUserlMenuOpen;
  }
   

 /*  async ngAfterViewInit() {
    await this.globalFunctions.getCollection('users', this.allUsers);  
  } */

  

  /**
   * this funktion sets the flag to show the header for channels and take over information of the related channel object to global variables
   * @param channel - object which contains information of selecet channel
   */
  async openChannel(channel: string) {
    let selectedChannel = await this.firebaseChannelService.getChannelData(channel);
    selectedChannel!['id'] = channel;
    this.selectedChannel = selectedChannel;
    this.globalFunctions.openChannel(selectedChannel);
    this.globalFunctions.triggerFocus();
   // console.log('alle',this.globalVariables.allUsers);
   // console.log('nur chat',this.globalVariables.openChannelUser);
   // console.log('nicht im chat',this.globalVariables.notInOpenChannelUser);
  }

  async openDirectMessageUser(user: any){
    this.globalFunctions.openDirectMessageUser(user);
    this.globalFunctions.triggerFocus();
  }


  openChannelOverlay() {
    this.globalVariables.showAddChannel = true;
    document.body.style.overflow = 'hidden';
  }



}
