import { Component } from '@angular/core';
import { OtherUserMessageComponent } from 'app/shared/chats/other-user-message/other-user-message.component';
import { CurrentUserMessageComponent } from 'app/shared/chats/current-user-message/current-user-message.component';
import { ChatChannel } from 'app/models/chatChannel.class';
import { ChatUsers } from 'app/models/chatUsers.class';


@Component({
  selector: 'app-all-messages',
  standalone: true,
  imports: [
    OtherUserMessageComponent,
    CurrentUserMessageComponent
  ],
  templateUrl: './all-messages.component.html',
  styleUrl: './all-messages.component.scss'
})
export class AllMessagesComponent {

  chatChannel: ChatChannel = new ChatChannel;
  chatUsers: ChatUsers = new ChatUsers;

}
