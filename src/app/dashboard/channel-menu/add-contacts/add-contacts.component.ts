import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonComponent } from 'app/shared/button/button.component';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { AddNewChannelComponent } from '../add-new-channel/add-new-channel.component';
import { FirebaseChatService } from 'app/services/firebase-services/firebase-chat.service';
import { FirebaseCannelService } from 'app/services/firebase-services/firebase-cannel.service';
import { Observable, from, map, of, Subject} from 'rxjs';
import { FirebaseUserService } from 'app/services/firebase-services/firebase-user.service';
import { User } from 'app/models/user.class';
import { Firestore } from '@angular/fire/firestore';
import { ChannelMenuComponent } from '../channel-menu.component';

@Component({
  selector: 'app-add-contacts',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    InputfieldComponent,
    AddNewChannelComponent,
    ChannelMenuComponent
  ],
  templateUrl: './add-contacts.component.html',
  styleUrl: './add-contacts.component.scss'
})
export class AddContactsComponent implements OnInit {

  globalVariables = inject(GlobalVariablesService);
  // globalFunctions = inject(GlobalFunctionsService);
  firebaseChatService = inject(FirebaseChatService);
  firebaseChannelService = inject(FirebaseCannelService);

  addedChannelId: string = '';
  addedChatId: string = '';
  allUsers: any = [];
  showCertainPeople: boolean = false;


  [x: string]: any;
  private searchTerms = new Subject<string>();


  constructor(
    private userService: FirebaseUserService, // Injizieren Sie den UserService
    private firestore: Firestore,
    public globalFunctions: GlobalFunctionsService
  ) {}

  ngOnInit(): void {
    this.globalFunctions.getCollection('users', this.allUsers); // Angenommen, `this.users` ist Ihre lokale Variable, die die Benutzerdaten speichert
  }



  async addNewChannel() {

    //add new chanel and return channelId
    await this.globalFunctions.addData('channels', this.globalVariables.channelData).then(response => {
      this.addedChannelId = response.id;
    }).catch(error => {
      console.error('Fehler beim Hinzufügen des Kanals:', error);
    });
   // console.log('channel added: ', this.addedChannelId);
    // add new chat and save channelID in it and return chatId

    await this.firebaseChatService.addChat(this.addedChannelId).then(response => {
      this.addedChatId = response.id;
    }).catch(error => {
      console.error('Fehler beim Hinzufügen des Chats:', error);
    });
   // console.log('chat added: ', this.addedChatId);

    //add chatId to channel
    await this.firebaseChannelService.updateChannel(this.addedChannelId, { chatId: this.addedChatId });

    // hier benötige ich noch eine Funktion, die einen Chat erstellt. In diesen Chat speichere ich die 
    // von diesem Chat
    this.globalVariables.openChannel.titel = this.globalVariables.channelData.channelName;
    this.globalVariables.channelData.channelName = '';
    this.globalVariables.channelData.description = '';
    this.globalVariables.channelData.chatId = '';
    this.globalFunctions.closeUserOverlay();
  }




}
