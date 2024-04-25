import { Component, inject } from '@angular/core';
import { ChannelMenuComponent } from './channel-menu/channel-menu.component';
import { ChatComponent } from './chat/chat.component';
import { ThreadComponent } from './thread/thread.component';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { CommonModule } from '@angular/common';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { FirebaseChannelService } from 'app/services/firebase-services/firebase-channel.service';
import { FirebaseUserService } from 'app/services/firebase-services/firebase-user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [
    ChannelMenuComponent,
    ChatComponent,
    ThreadComponent,
    CommonModule,
  ],
})

export class DashboardComponent {
  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);
  firebaseChannelService = inject(FirebaseChannelService);
  firebaseUserService = inject(FirebaseUserService);

  constructor() {
    this.globalVariables.login = false;
    this.globalVariables.imprintActive = false;
  }
  ngOnInit() {
    this.globalVariables.isChatVisable = window.innerWidth > 800;
    this.globalVariables.bufferThreadOpen = this.globalVariables.showThread;
    this.firebaseChannelService.getChannelsWhereUserIsMember();
    this.firebaseUserService.getAllUser();
    this.globalFunctions.getStartChannel();
  }

  toggleChannelMenu() {
    this.globalVariables.showChannelMenu = !this.globalVariables.showChannelMenu;
    if (this.globalVariables.desktop800 && !this.globalVariables.desktop1200 && this.globalVariables.bufferThreadOpen)
      this.globalVariables.showThread = !this.globalVariables.showThread;
    this.globalVariables.isMenuOpen = !this.globalVariables.isMenuOpen;
  }


}
