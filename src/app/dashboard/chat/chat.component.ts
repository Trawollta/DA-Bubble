import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
// import { EditChannelComponent } from '../channel-menu/edit-channel/edit-channel.component';
import { AllMessagesComponent } from 'app/shared/chats/all-messages/all-messages.component';
import { AddContactsComponent } from '../channel-menu/add-contacts/add-contacts.component';
import { AddToChannelComponent } from "../channel-menu/add-to-channel/add-to-channel.component";
import { ShowContactsComponent } from '../channel-menu/show-contacts/show-contacts.component';
import { FormsModule } from '@angular/forms';
import { ClickedOutsideDirective } from 'app/directives/clicked-outside.directive';
import { TextareaChatThreadComponent } from 'app/shared/textarea/textarea-chat-thread/textarea-chat-thread.component';
import { ChatChannelService } from 'app/services/chat-channel.service';
import { Channel } from 'app/models/channel.class';



@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  imports: [
    CommonModule,
    // EditChannelComponent,
    AllMessagesComponent,
    // AddContactsComponent,
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
  chatChannelService = inject(ChatChannelService);
  
  headerShowMembers: boolean = false;
  selectedChannel: Channel | null = null;
  messages: any[] = [];
 
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
    console.log("🔍 GlobalVariables Current Channel beim Start:", this.globalVariables.currentChannel);

    setTimeout(() => {
        if (this.globalVariables.currentChannel) {
            this.selectedChannel = this.globalVariables.currentChannel;
            console.log("✅ `selectedChannel` wurde gesetzt:", this.selectedChannel);
            this.loadMessages();
        } else {
            console.warn("⚠️ `selectedChannel` ist NULL beim Laden.");
        }
    }, 100);
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

    openChannel(channel: Channel) {
      console.log("📢 Channel geöffnet:", channel);
      this.selectedChannel = channel;
      this.globalVariables.currentChannel = channel;
      this.globalVariables.currentChannelId = channel.id;
  
      this.loadMessages();
  }
  

  loadMessages() {
    console.log("🔍 `loadMessages()` wurde aufgerufen!");
    console.log("🛠 Aktuelles `selectedChannel`:", this.selectedChannel);

    if (!this.selectedChannel) {
        console.warn("⚠️ `loadMessages()` abgebrochen: Kein `selectedChannel` gesetzt.");
        return;
    }

    const channelId = Number(this.selectedChannel.id);
    console.log("📩 Lade Nachrichten für Channel ID:", channelId);

    this.chatChannelService.getMessages(channelId).subscribe({
        next: (messages) => {
            console.log("📩 Nachrichten erfolgreich geladen:", messages);
            this.messages = messages;
        },
        error: (error) => {
            console.error("❌ Fehler beim Laden der Nachrichten:", error);
        }
    });
}





sendMessage(content: string) {
  if (!this.selectedChannel || !content.trim()) return;

  this.chatChannelService.sendMessage(Number(this.selectedChannel.id), content).subscribe({
    next: (message) => {
      console.log("📩 Nachricht gesendet:", message);
      this.messages.push(message); // Direkt ins UI hinzufügen
    },
    error: (error) => {
      console.error("❌ Fehler beim Senden der Nachricht:", error);
    }
  });
}

}
