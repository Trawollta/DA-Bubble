import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, UserService } from 'app/services/user.service';
import { ChannelService } from 'app/services/channel.service';
import { SearchbarComponent } from 'app/shared/searchbar/searchbar/searchbar.component';
import { Channel } from 'app/models/channel.class';
import { ChatChannelService } from 'app/services/chat-channel.service';
import { AddNewChannelComponent } from './add-new-channel/add-new-channel.component';
import { AddToChannelComponent } from './add-to-channel/add-to-channel.component';

@Component({
  selector: 'app-channel-menu',
  standalone: true,
  imports: [CommonModule, SearchbarComponent, AddNewChannelComponent, AddToChannelComponent],
  templateUrl: './channel-menu.component.html',
  styleUrl: './channel-menu.component.scss',
})
export class ChannelMenuComponent implements OnInit {
  private userService = inject(UserService);
  private channelService = inject(ChannelService);
  private chatChannelService = inject(ChatChannelService);
  private cdr = inject(ChangeDetectorRef); 

  isChannelMenuOpen: boolean = true;
  isUserlMenuOpen: boolean = true;
  selectedChannel: Channel | null = null;
  selectedChannelId: number = 0; 
  channels: Channel[] = [];
  messages: any[] = [];
  isDesktop700 = window.innerWidth > 700;
  isDesktop900 = window.innerWidth > 900;
  users: User[] = []; 
  showAddChannelOverlay: boolean = false;
  showAddContactsOverlay: boolean = false;
  channelData: { name: string; description: string } = { name: '', description: '' };

  constructor() {}

  ngOnInit() {
    this.loadUsers();
    this.loadChannels();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
      },
      error: (error) => {
        console.error("🔴 Fehler beim Laden der Nutzer:", error);
      }
    });
  }

  loadChannels() {
    this.channelService.getChannels().subscribe({
      next: (channels) => {
        this.channels = channels;
      },
      error: (error) => {
        console.error("🔴 Fehler beim Laden der Channels:", error);
      }
    });
  }
  

  openChannel(channel: Channel) {
    
    if (!channel || !channel.id) {
      console.warn("⚠️ Ungültiger Channel:", channel);
      return;
    }
    
    this.selectedChannel = channel;
    this.selectedChannelId = Number(channel.id);
    console.log("📌 Neuer ausgewählter Channel:", this.selectedChannel);
    this.chatChannelService.setSelectedChannel(channel);
    
    this.loadMessages();
    this.cdr.detectChanges();
  }

  openChannelOverlay() {
    this.showAddChannelOverlay = true;
    this.cdr.detectChanges();
  }

  closeChannelOverlay() {
    this.showAddChannelOverlay = false;
    this.cdr.detectChanges();
  }

  nextOverlay(data: { name: string; description: string }) {
    this.channelData = data; // Speichert Channel-Daten
    this.showAddChannelOverlay = false;
    this.showAddContactsOverlay = true; // Öffnet das nächste Overlay
  }

  // Schließen des "Add To Channel"-Overlays
  closeAddContactsOverlay() {
    this.showAddContactsOverlay = false;
    this.cdr.detectChanges();
  }
  
  
  



  loadMessages() {
    if (!this.selectedChannel) {
        console.warn("⚠️ Kein `selectedChannel` gesetzt.");
        return;
    }

    const channelId = Number(this.selectedChannel.id);

    this.chatChannelService.getMessages(channelId).subscribe({
        next: (messages) => {
            this.messages = [...messages];
            this.cdr.detectChanges();
        },
        error: (error) => {
            console.error("❌ Fehler beim Laden der Nachrichten:", error);
        }
    });
  }
}
