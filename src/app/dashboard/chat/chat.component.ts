import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { EditChannelComponent } from '../channel-menu/edit-channel/edit-channel.component';
import { AllMessagesComponent } from 'app/shared/chats/all-messages/all-messages.component';
import { AddContactsComponent } from '../channel-menu/add-contacts/add-contacts.component';
import { AddToChannelComponent } from "../channel-menu/add-to-channel/add-to-channel.component";
import { ShowContactsComponent } from '../channel-menu/show-contacts/show-contacts.component';
import { FormsModule } from '@angular/forms';
import { ClickedOutsideDirective } from 'app/directives/clicked-outside.directive';
import { TextareaChatThreadComponent } from 'app/shared/textarea/textarea-chat-thread/textarea-chat-thread.component';



@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  imports: [
    CommonModule,
    EditChannelComponent,
    AllMessagesComponent,
    AddContactsComponent,
    AddToChannelComponent,
    ShowContactsComponent,
    FormsModule,
    ClickedOutsideDirective,
    TextareaChatThreadComponent
  ]
})
export class ChatComponent {
  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);
  
  headerShowMembers: boolean = false;
 
  constructor() {

  }
  openEmojis() {
    let emojiDiv = document.getElementById('emojis');
    if (emojiDiv && emojiDiv.classList.contains('d-none')) {
      emojiDiv.classList.remove('d-none');
    } else if (emojiDiv && emojiDiv.classList.contains('d-none') == false) {
      emojiDiv.classList.add('d-none');
    }
  }

  ngOnInit() {
    this.globalVariables.scrolledToBottom = false;
  }

  openAnswers() {
    this.globalVariables.showThread = !this.globalVariables.showThread;
    if (window.innerWidth < 1100)
      this.globalVariables.showChannelMenu = false;
  }

  showMembers(headerShowMembers: boolean) { 
    this.globalVariables.memberlist = true;
    this.globalVariables.headerShowMembers = this.globalVariables.memberlist && headerShowMembers ? true : false;
    this.globalFunctions.freezeBackground(this.globalVariables.memberlist);   
  }


  checkIfFileIsValidImgFile() {

  }

    openContactsPopup(){
      this.globalVariables.desktop700 ? this.globalFunctions.openAddContactsOverlay() : this.showMembers(true);
    }

}
