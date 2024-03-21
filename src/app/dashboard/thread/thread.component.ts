import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, collection, onSnapshot} from '@angular/fire/firestore';
//import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { FirebaseChatService } from 'app/services/firebase-services/firebase-chat.service';
import { AllMessagesComponent } from 'app/shared/chats/all-messages/all-messages.component';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { User } from 'app/models/user.class';
import { CommonModule, DatePipe } from '@angular/common';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [
    InputfieldComponent,
    FormsModule,
    AllMessagesComponent,
    CommonModule,
    DatePipe
  ],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {

  
  globalVariables = inject(GlobalVariablesService);
  globalFunction = inject(GlobalFunctionsService);
  firebaseChatService = inject(FirebaseChatService);



  checkIfCurrentuser(){
    return this.globalVariables.messageThreadStart.userId == this.globalVariables.activeID;
  }

  closeThread() {
    this.globalVariables.showThread = false;
    this.globalVariables.messageData.answerto = '';
    this.globalVariables.isChatVisable = true;
    this.globalFunction.showDashboardElement(1200);
    if (window.innerWidth < 800) {
      this.globalVariables.showChannelMenu = false;
      this.globalVariables.isChatVisable = true;
    }
  }


  sendMessage() {
    
    if (this.globalVariables.messageData.message !== '') {
      this.globalVariables.messageData.userId = this.globalVariables.activeID;
      this.globalVariables.messageData.timestamp = new Date().getTime();
      this.firebaseChatService.sendMessage(this.globalVariables.openChannel.chatId, 'chatchannels');
      console.log('was ist in activeID: ',this.globalVariables.activeID);
      console.log('was ist in messageData: ',this.globalVariables.messageData);
      this.globalVariables.messageData.message = '';

    }
  }
}
