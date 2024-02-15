import { Component } from '@angular/core';
import { AddNewChannelComponent } from './add-new-channel/add-new-channel.component';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-channel-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './channel-menu.component.html',
  styleUrl: './channel-menu.component.scss',
})
export class ChannelMenuComponent {


  openChannels() {}



}
