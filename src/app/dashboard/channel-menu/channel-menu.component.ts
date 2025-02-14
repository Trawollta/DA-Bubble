import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { UserService, User } from 'app/services/user.service';
import { ChannelService } from 'app/services/channel.service';
import { SearchbarComponent } from 'app/shared/searchbar/searchbar/searchbar.component';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { Channel } from 'app/models/channel.class';

@Component({
  selector: 'app-channel-menu',
  standalone: true,
  templateUrl: './channel-menu.component.html',
  styleUrl: './channel-menu.component.scss',
  imports: [CommonModule, SearchbarComponent],
})
export class ChannelMenuComponent implements OnInit {
  globalVariables: GlobalVariablesService = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);
  private userService = inject(UserService);
  private channelService = inject(ChannelService);

  isChannelMenuOpen: boolean = true;
  isUserlMenuOpen: boolean = true;
  selectedChannel: Channel | null = null;
  channels: Channel[] = [];

  constructor() {}

  ngOnInit() {
    console.log("🔄 ngOnInit() wurde aufgerufen...");
    this.loadUsers();
    this.loadChannels();
  }

  /**
   * Lädt Benutzer aus dem Backend
   */
  loadUsers() {
    console.log("🟡 loadUsers() wird aufgerufen...");
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        console.log("🟢 Benutzer erfolgreich geladen:", users);
        this.globalVariables.allUsers = users;
      },
      error: (error) => {
        console.error('🔴 Fehler beim Laden der Nutzer:', error);
      }
    });
  }

  /**
   * Lädt Channels aus dem Backend
   */
  loadChannels() {
    console.log("🟡 loadChannels() wird aufgerufen...");
    this.channelService.getChannels().subscribe({
      next: (channels: Channel[]) => {
        console.log("🟢 Channels erfolgreich geladen:", channels);
        this.globalVariables.viewableChannelplusId = channels.map(channel => ({
          channelId: channel.id,
          channelName: channel.name,
          chatId: channel.chatId
        }));
        console.log("📌 Updated viewableChannelplusId:", this.globalVariables.viewableChannelplusId);
      },
      error: (error) => {
        console.error('🔴 Fehler beim Laden der Channels:', error);
      }
    });
  }

  /**
   * Öffnet einen Channel
   */
  openChannel(channel: Channel) {
    console.log("📢 Channel geöffnet:", channel);
    
    // Setzt den ausgewählten Channel in GlobalVariablesService
    this.globalVariables.setSelectedChannel(channel);

    // Setzt auch die lokale Variable
    this.selectedChannel = channel;
    this.globalVariables.currentChannel = channel;
    this.globalVariables.currentChannelId = channel.id;

    setTimeout(() => {
      if (this.selectedChannel) {
        console.log("✅ `selectedChannel` wurde gesetzt:", this.selectedChannel);
        this.globalVariables.loadMessages();
      } else {
        console.warn("⚠️ `selectedChannel` ist immer noch nicht gesetzt.");
      }
    }, 100);
  }

  /**
   * Wechselt den Channel und lädt Nachrichten neu
   */
  changeChannel(channel: Channel) {
    console.log("🔄 Channel wird gewechselt:", channel);
    this.globalVariables.setSelectedChannel(channel);
    this.globalVariables.loadMessages();
  }
}
