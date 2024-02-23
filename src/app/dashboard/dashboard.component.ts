import { Component, inject } from '@angular/core';
import { ChannelMenuComponent } from './channel-menu/channel-menu.component';
import { ChatComponent } from './chat/chat.component';
import { ThreadComponent } from './thread/thread.component';
import { PrivateChatComponent } from './private-chat/private-chat.component';
import { GlobalVariablesService } from 'app/services/global-variables.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [
    ChannelMenuComponent,
    ChatComponent,
    ThreadComponent,
    PrivateChatComponent,
    CommonModule,
  ],
})
export class DashboardComponent {
  globalVariables = inject(GlobalVariablesService);
}
