import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
//import { Firestore, doc, collection, onSnapshot} from '@angular/fire/firestore';
//import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
// import { FirebaseChatService } from 'app/services/firebase-services/firebase-chat.service';
import { AllMessagesComponent } from 'app/shared/chats/all-messages/all-messages.component';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
//import { User } from 'app/models/user.class';
import { CommonModule, DatePipe } from '@angular/common';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { TextareaChatThreadComponent } from 'app/shared/textarea/textarea-chat-thread/textarea-chat-thread.component';

interface Message {
  message: string;
  userId: string,
  userName: string;
  timestamp: number;
  userImgPath: string;
}

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [
    InputfieldComponent,
    FormsModule,
    AllMessagesComponent,
    CommonModule,
    DatePipe,
    TextareaChatThreadComponent
  ],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {

  
  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);
  // firebaseChatService = inject(FirebaseChatService);

  startMessage: Message = this.globalVariables.messageThreadStart;
  isImage: boolean = false;
  messageInfo = { hasUrl: false, message: '', textAfterUrl: '', messageImgUrl: '' };

  ngOnInit() {
    this.startMessage = this.globalVariables.messageThreadStart;
    this.messageInfo = this.globalFunctions.checkMessage(this.startMessage.message);
    this.isImage = this.messageInfo.hasUrl;
  }
  

  checkIfCurrentuser(){
    return this.globalVariables.messageThreadStart.userId == this.globalVariables.activeID;
  }

  closeThread() {
    this.globalVariables.bufferThreadOpen = false;
    this.globalVariables.showThread = false;
    this.globalVariables.messageData.answerto = '';
    this.globalVariables.isChatVisable = true;
    this.globalFunctions.showDashboardElement(1200);
    if (window.innerWidth < 800) {
      this.globalVariables.showChannelMenu = false;
      this.globalVariables.isChatVisable = true;
    }
  }

}
