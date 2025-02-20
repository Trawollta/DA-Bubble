import { Component, inject, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { AllMessagesComponent } from 'app/shared/chats/all-messages/all-messages.component';
import { AddToChannelComponent } from "../channel-menu/add-to-channel/add-to-channel.component";
import { ShowContactsComponent } from '../channel-menu/show-contacts/show-contacts.component';
import { FormsModule } from '@angular/forms';
import { ClickedOutsideDirective } from 'app/directives/clicked-outside.directive';
import { TextareaChatThreadComponent } from 'app/shared/textarea/textarea-chat-thread/textarea-chat-thread.component';
import { ChatChannelService } from 'app/services/chat-channel.service';
import { Channel } from 'app/models/channel.class';
import { Store } from '@ngrx/store';
import { addMessage, Message } from 'app/store/actions/chat.actions';
import { AppState } from 'app/store/state/app.state';
import { map } from 'rxjs';
import { setMessages } from 'app/store/actions/chat.actions';
import { EditChannelComponent } from '../channel-menu/edit-channel/edit-channel.component';


@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  imports:[
    CommonModule,
    AllMessagesComponent,
    AddToChannelComponent,
    ShowContactsComponent,
    FormsModule,
    ClickedOutsideDirective,
    TextareaChatThreadComponent,
    EditChannelComponent
  ]
})
export class ChatComponent {
  // globalFunctions = inject(GlobalFunctionsService);
  chatChannelService = inject(ChatChannelService);
  
  headerShowMembers: boolean = false;
  memberlist: boolean = false;
  isUserChat: boolean = false;
  showContacts: boolean = false;
  selectedChannel: Channel | null = null;
  selectedChannelId: number = 0;
  userToChatWith = { name: '', img: '', id: '' }; 
  messages: any[] = [];
  desktop700: boolean = window.innerWidth > 700;
  messages$ = this.store.select(state => state.chat.messages);
  showEditChannelOverlay: boolean = false;
  selectedChannelData: { id: number; name: string; description: string; creator: string } | null = null;

  constructor(private cdr: ChangeDetectorRef, private store: Store<AppState>) {
    console.log("🟢 ChatComponent wurde geladen!");
  }

  ngOnInit() {
    this.messages$.subscribe(messages => {
      console.log("📩 Nachrichten im Store angekommen:", messages);
    });
  
    this.chatChannelService.selectedChannel$.subscribe(channel => {
      console.log("📩 ChatComponent hat neuen Channel erhalten:", channel);
  
      this.selectedChannel = channel;
      if (channel) {
        this.selectedChannelId = Number(channel.id);
        this.loadMessages();
      }
      this.cdr.detectChanges();
    });
  }
  
  closeEditChannelOverlay() {
    console.log("❌ Edit-Channel-Overlay wird geschlossen!");
    this.showEditChannelOverlay = false;
    this.cdr.detectChanges(); // UI Update erzwingen
}
  
  

openEditChannelOverlay() {
  if (!this.selectedChannel) {
    console.error("❌ Kein Channel ausgewählt!");
    return;
  }
  
  this.selectedChannelData = {   
    id: Number(this.selectedChannel.id),
    name: this.selectedChannel.name || 'Unbekannter Channel',
    description: this.selectedChannel.description || 'Keine Beschreibung verfügbar',
    // Extrahiere den Benutzernamen aus dem creator-Objekt
    creator: this.selectedChannel.creator?.username ?? 'Unbekannt'
  };
  console.log("Hallo Channel! Daten:", this.selectedChannelData);
  this.showEditChannelOverlay = true;
  console.log("showEditChannelOverlay",this.showEditChannelOverlay)
}

// Test-Klick-Handler (zusätzlich ein Button im Template)
testButtonClicked() {
  console.log("Testbutton: openEditChannelOverlay() wurde aufgerufen.");
  this.openEditChannelOverlay();
}







  openProfile(userId: string) {
    console.log(`👤 Profil geöffnet: ${userId}`);
  }

  openContactsPopup() {
    console.log("➕ Kontakte-Popup geöffnet");
    this.showContacts = true;
  }

  closeContactsPopup() {
    console.log("Contacts overlay closed");
    this.showContacts = false;
    this.cdr.detectChanges();
  }

  openChannel(channel: Channel) {
    this.selectedChannel = channel;
    this.selectedChannelId = Number(channel.id);
    this.cdr.detectChanges();
    this.loadMessages();
  }

  loadMessages() {
    if (!this.selectedChannel) return;
    
    const channelId = Number(this.selectedChannel.id);
  
    this.chatChannelService.getMessages(channelId).subscribe({
      next: (messages) => {
        console.log("✅ Nachrichten erhalten:", messages);
        
        this.store.dispatch(setMessages({ messages }));  // 🔥 Store-Update hier
      },
      error: (error) => {
        console.error("❌ Fehler beim Laden der Nachrichten:", error);
      }
    });
  }
  
  // sendMessage(content: string) {
  //   if (!this.selectedChannel || !content.trim()) return;
  
  //   this.chatChannelService.sendMessage(Number(this.selectedChannel.id), content).subscribe({
  //     next: (message) => {
  //       console.log("📩 Nachricht erfolgreich gesendet:", message);
        
  //       this.store.dispatch(addMessage({ message }));  // 🔥 Store-Update hier
  //     },
  //     error: (error) => {
  //       console.error("❌ Fehler beim Senden der Nachricht:", error);
  //     }
  //   });
  // }
  
  

  

  // sendMessage(content: string) {
  //   if (!this.selectedChannel || !content.trim()) return;

  //   this.chatChannelService.sendMessage(Number(this.selectedChannel.id), content).subscribe({
  //     next: (message) => {
  //       this.messages.push(message);
  //       this.cdr.detectChanges();
  //     },
  //     error: (error) => {
  //       console.error("❌ Fehler beim Senden der Nachricht:", error);
  //     }
  //   });
  // }

  showMembers(headerShowMembers: boolean) { 
    this.memberlist = true;
    this.headerShowMembers = this.memberlist && headerShowMembers ? true : false;
  }

  closeMembers(){
    
  }
}
