import { Component } from '@angular/core';
import { ChannelMenuComponent } from "./channel-menu/channel-menu.component";
import { ChatComponent } from "./chat/chat.component";
import { ThreadComponent } from "./thread/thread.component";
import { PrivateChatComponent } from "./private-chat/private-chat.component";

@Component({
    selector: 'app-dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    imports: [ChannelMenuComponent, ChatComponent, ThreadComponent, PrivateChatComponent]
})
export class DashboardComponent {

}
