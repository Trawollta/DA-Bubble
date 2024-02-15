import { Component } from '@angular/core';
import { ChannelMenuComponent } from "./channel-menu/channel-menu.component";
import { ChatComponent } from "./chat/chat.component";

@Component({
    selector: 'app-dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    imports: [ChannelMenuComponent, ChatComponent]
})
export class DashboardComponent {

}
