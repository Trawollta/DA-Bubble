import { Component, Inject, inject } from '@angular/core';
import { OtherUserMessageComponent } from 'app/shared/chats/other-user-message/other-user-message.component';
import { CurrentUserMessageComponent } from 'app/shared/chats/current-user-message/current-user-message.component';
import { ChatChannel } from 'app/models/chatChannel.class';
import { ChatUsers } from 'app/models/chatUsers.class';
import { FirebaseChatService } from 'app/services/firebase-services/firebase-chat.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { CommonModule } from '@angular/common';
import { ReactionsComponent } from "../../reactions/reactions.component";
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';


@Component({
    selector: 'app-all-messages',
    standalone: true,
    templateUrl: './all-messages.component.html',
    styleUrl: './all-messages.component.scss',
    imports: [
        CommonModule,
        OtherUserMessageComponent,
        CurrentUserMessageComponent,
        ReactionsComponent
    ]
})
export class AllMessagesComponent {

  firebaseChatService = inject (FirebaseChatService);
  globalVariablesService = inject(GlobalVariablesService);
  GlobalFunctionsService = inject(GlobalFunctionsService)
  chatChannel: ChatChannel = new ChatChannel;
  chatUsers: ChatUsers = new ChatUsers;

   ngOnInit(){
   // console.log('aktueller chat', this.globalVariablesService.chatChannel);
  //  console.log('neue ID: ',this.globalVariablesService.openChannel.id);
   // this.firebaseChatService.getChat(this.globalVariablesService.openChannel.id); //Id vom Willkommenchannel 'NQMdt08FAcXbVroDLhvm'
   // console.log('aktueller chat 2.Aufruf', this.globalVariablesService.chatChannel);
   // console.log(this.firebaseChatService.groupMessagesByAnswerTo());
  } 

}
