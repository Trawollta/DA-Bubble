import { Component } from '@angular/core';
import { ChannelMenuComponent } from "./channel-menu/channel-menu.component";

@Component({
    selector: 'app-dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    imports: [ChannelMenuComponent]
})
export class DashboardComponent {

}
