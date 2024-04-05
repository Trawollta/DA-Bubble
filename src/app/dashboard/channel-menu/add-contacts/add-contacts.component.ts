import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonComponent } from 'app/shared/button/button.component';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { AddNewChannelComponent } from '../add-new-channel/add-new-channel.component';
import { FirebaseChatService } from 'app/services/firebase-services/firebase-chat.service';
import { FirebaseChannelService } from 'app/services/firebase-services/firebase-channel.service';
import { Observable, from, map, of, Subject} from 'rxjs';
import { FirebaseUserService } from 'app/services/firebase-services/firebase-user.service';
import { User } from 'app/models/user.class';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { ChannelMenuComponent } from '../channel-menu.component';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-add-contacts',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    InputfieldComponent,
    AddNewChannelComponent,
    ChannelMenuComponent,
    FormsModule

  ],
  templateUrl: './add-contacts.component.html',
  styleUrl: './add-contacts.component.scss'
})
export class AddContactsComponent implements OnInit {

  globalVariables = inject(GlobalVariablesService);
  // globalFunctions = inject(GlobalFunctionsService);
  firebaseChatService = inject(FirebaseChatService);
  firebaseChannelService = inject(FirebaseChannelService);

  addedChannelId: string = '';
  addedChatId: string = '';
  allUsers: any = [];
  showCertainPeople: boolean = false;

  selectedUsers: any[] = [];

  isChecked: boolean[] = new Array(this.allUsers.length).fill(false);

  filteredUsers: any[] = []; 



  [x: string]: any;
  private searchTerms = new Subject<string>();


  constructor(
    private userService: FirebaseUserService, // Injizieren Sie den UserService
    public globalFunctions: GlobalFunctionsService
  ) {}

  ngOnInit(): void {
    this.globalFunctions.getCollection('users', this.allUsers); 
    this.setupSearch();
  }

  setupSearch() {
    this.searchTerms.pipe(
      debounceTime(300), // Verzögere die Ausführung um 300 ms
      distinctUntilChanged(), // Führe nur aus, wenn sich der Wert geändert hat
      switchMap((term: string) => this.userService.searchUsersByName(term))
    ).subscribe(users => {
      this.filteredUsers = users; // 'filteredUsers' soll die gefilterten Benutzer für die Anzeige halten
    });
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  onChange(index: number) {
    this.isChecked[index] = !this.isChecked[index];
    if (this.isChecked[index]) {
      this.selectedUsers.push(this.allUsers[index]);
    } else {
      this.selectedUsers = this.selectedUsers.filter((user, i) => i !== index);
    }
    console.log('selectedUsers:', this.selectedUsers);
  }



  async addNewChannel() {

    //add new chanel and return channelId
    await this.firebaseChannelService.addData('channels', this.addChannelwithChoosenMembers() ).then(response => {
      this.addedChannelId = response.id; 
    }).catch(error => {
      console.error('Fehler beim Hinzufügen des Kanals:', error);
    });
    // add new chat and save channelID in it and return chatId
    await this.firebaseChatService.addChat(this.addedChannelId, 'chatchannels').then(response => {
      this.addedChatId = response.id;
    }).catch(error => {
      console.error('Fehler beim Hinzufügen des Chats:', error);
    });
    //add chatId to channel
    await this.firebaseChannelService.updateChannel(this.addedChannelId, { chatId: this.addedChatId });

    this.globalVariables.openChannel.titel = this.globalVariables.channelData.channelName;
    this.globalVariables.channelData.channelName = '';
    this.globalVariables.channelData.description = '';
    this.globalVariables.channelData.chatId = '';
    this.globalVariables.channelData.id = '';
    this.globalFunctions.closeAddContactsOverlay();
  }


  addChannelwithChoosenMembers() {
    const selectedUserIds = this.selectedUsers.map(user => user.id);
    const newChannelData = {
      channelName: this.globalVariables.channelData.channelName,
      description: this.globalVariables.channelData.description,
      chatId: '',
      members: selectedUserIds,
      id: '',
      creator: this.globalVariables.activeID

    };
    console.log('newChannelData: ', newChannelData);
    return newChannelData;
  }
  
  resetAndCloseOverlay() {
    this.globalVariables.channelData.channelName = '';
    this.globalVariables.channelData.description = '';
    this.selectedUsers = []; 
    this.showCertainPeople = false; 
    this.globalFunctions.closeAddContactsOverlay(); 
  }
  

}
