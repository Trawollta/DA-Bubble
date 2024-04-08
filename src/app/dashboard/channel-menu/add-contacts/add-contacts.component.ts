import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonComponent } from 'app/shared/button/button.component';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { AddNewChannelComponent } from '../add-new-channel/add-new-channel.component';
import { FirebaseChatService } from 'app/services/firebase-services/firebase-chat.service';
import { FirebaseChannelService } from 'app/services/firebase-services/firebase-channel.service';
import { Observable, from, map, of, Subject } from 'rxjs';
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
    FormsModule,
  ],
  templateUrl: './add-contacts.component.html',
  styleUrl: './add-contacts.component.scss',
})
export class AddContactsComponent implements OnInit {
  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);
  firebaseChatService = inject(FirebaseChatService);
  firebaseChannelService = inject(FirebaseChannelService);
  userService = inject(FirebaseUserService);

  addedChannelId: string = '';
  addedChatId: string = '';
  allUsers: any = [];
  showAllUsers: boolean = true;

  selectedUsers: any[] = [];

  isChecked: boolean[] = new Array(this.allUsers.length).fill(false);

  filteredUsers: any[] = [];

  [x: string]: any;
  private searchTerms = new Subject<string>();

  async ngOnInit() {
    await this.globalFunctions.getCollection('users', this.allUsers);
    this.setupSearch();
  }

  setupSearch() {
    this.searchTerms
      .pipe(
        debounceTime(300), // Verzögere die Ausführung um 300 ms
        distinctUntilChanged(), // Führe nur aus, wenn sich der Wert geändert hat
        switchMap((term: string) => this.userService.searchUsersByName(term))
      )
      .subscribe((users) => {
        this.filteredUsers = users; // 'filteredUsers' soll die gefilterten Benutzer für die Anzeige halten
      });
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  onChange(index: number) {
    this.isChecked[index] = !this.isChecked[index];
    const currentUser = this.allUsers[index];

    if (this.isChecked[index]) {
      this.selectedUsers.push(currentUser);
    } else {
      this.selectedUsers = this.selectedUsers.filter((user, i) => i !== index);
    }

    const activeUserIndex = this.selectedUsers.findIndex(
      (user) => user.id === this.globalVariables.activeID
    );
    if (activeUserIndex === -1) {
      const activeUser = this.allUsers.find(
        (user:any) => user.id === this.globalVariables.activeID
      );
      if (activeUser) {
        this.selectedUsers.push(activeUser);
      }
    }
  }

  /**
   * this function toggle the showAllUsers and calls selectAllUsers()
   */
  toggleSelectAllUser() {
    this.showAllUsers = !this.showAllUsers;
    this.selectAllUsers();
  }

  /**
   * this function select all Users
   */
  selectAllUsers() {
    if (this.showAllUsers) {
      this.selectedUsers = [];
      this.allUsers.forEach((user: any) => {
        this.selectedUsers.push(user);
      });
    }
  }

  /**
   * this function add a new channel inklusive relatet chatId
   * it calls also addChatIdIntoUser() to add chatId to each user
   */
  async addNewChannel() {
    await this.firebaseChannelService
      .addData('channels', this.addChannelwithChoosenMembers())
      .then((response) => {
        this.addedChannelId = response.id;
      })
      .catch((error) => {
        console.error('Fehler beim Hinzufügen des Kanals:', error);
      });

    await this.firebaseChatService
      .addChat(this.addedChannelId, 'chatchannels')
      .then((response) => {
        this.addedChatId = response.id;
      })
      .catch((error) => {
        console.error('Fehler beim Hinzufügen des Chats:', error);
      });
    //add chatId to channel
    await this.firebaseChannelService.updateChannel(this.addedChannelId, {
      chatId: this.addedChatId,
    });
    this.addChatIdIntoUser(this.selectedUsers);
    //this was missing to switch to the new chat
    this.firebaseChatService.activeChatId = this.addedChatId;
    this.firebaseChatService.changeActiveChannel();
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    this.globalVariables.openChannel.titel =
      this.globalVariables.channelData.channelName;
    this.resetAndCloseOverlay();
  }

  /**
   * this function adds the chatId to each user on firebase
   * @param setectedUsers - array
   */
  addChatIdIntoUser(selectedUsers: Array<any>) {
    for (let i = 0; i < selectedUsers.length; i++) {
      this.userService.addChatIdToUser(selectedUsers[i].id, this.addedChatId);
    }
  }

  /**
   * this function retuns the newChannelData object for addNewChannel()
   * @returns - object
   */
  addChannelwithChoosenMembers() {
    this.selectAllUsers();
    //debugger;
    const selectedUserIds = this.selectedUsers.map((user) => user.id);
    const newChannelData = {
      channelName: this.globalVariables.channelData.channelName,
      description: this.globalVariables.channelData.description,
      chatId: '',
      members: selectedUserIds,
      id: '',
      creator: this.globalVariables.activeID,
    };
    //console.log('newChannelData: ', newChannelData);
    return newChannelData;
  }

  /**
   * this function resets all data
   */
  resetAndCloseOverlay() {
    this.globalVariables.channelData.channelName = '';
    this.globalVariables.channelData.description = '';
    this.globalVariables.channelData.chatId = '';
    this.globalVariables.channelData.id = '';
    this.selectedUsers = [];
    this.showAllUsers = true;
    this.globalFunctions.closeAddContactsOverlay();
  }
}
