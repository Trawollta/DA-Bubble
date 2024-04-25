import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonComponent } from 'app/shared/button/button.component';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { FirebaseChatService } from 'app/services/firebase-services/firebase-chat.service';
import { FirebaseChannelService } from 'app/services/firebase-services/firebase-channel.service';
import { Subject } from 'rxjs';
import { FirebaseUserService } from 'app/services/firebase-services/firebase-user.service';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-add-contacts',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    InputfieldComponent,
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
        (user: any) => user.id === this.globalVariables.activeID
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
    this.addedChannelId = await this.addChannelGetId();
    const addedChatId: string = await this.addChatForChannelGetChatId();
    await this.updateChannelWithChatId(addedChatId);
    if (addedChatId) {
      this.firebaseChatService.activeChatId = addedChatId;
      this.globalVariables.openChannel.chatId = addedChatId;
    }
    this.addNewChannelSupport(addedChatId);
  }

  /**
   * this function is just an outsource of function needed in addNewChannel
   * @param addedChatId - string
   */
   addNewChannelSupport(addedChatId: string) {
    this.addChatIdIntoUser(this.selectedUsers);
    this.globalVariables.openChannel.id = this.addedChannelId;
    this.firebaseChatService.changeActiveChannel();
    this.globalVariables.openChannel.titel = this.globalVariables.channelData.channelName;
    this.pushNewChannelInViewableChannels(this.addedChannelId, addedChatId, this.globalVariables.channelData.channelName);
    let uniqueIds = Array.from(new Set(this.selectedUsers.map(item => item.id)));
    if(uniqueIds.length === 0)uniqueIds.push(this.globalVariables.activeID);
    this.globalFunctions.getChatUserData(uniqueIds);
    this.resetAndCloseOverlay();
  }

  /**
   * this function adds the new channel into the viewableChannelplusId array for channelmenu
   */
  pushNewChannelInViewableChannels(addedChannelId: string, addedChatId: string, channelName: string) {
    this.globalVariables.viewableChannelplusId.push({
      channelName: channelName,
      chatId: addedChatId,
      channelId: addedChannelId
    });
  }

  /**
   * this function adds a new channeldoc and returns the id
   * @returns -string - channelId
   */
  async addChannelGetId(): Promise<string> {
    let id = '';
    await this.firebaseChannelService
      .addData('channels', this.addChannelwithChoosenMembers())
      .then((response) => {
        id = response.id;
      })
      .catch((error) => {
        console.error('Fehler beim Hinzufügen des Kanals:', error);
        id = '';
      });
    return id;
  }

  /**
   * this function adds the chat for channel and returns chatId
   * @param channelId - string
   * @returns - string - chatId
   */
  async addChatForChannelGetChatId(): Promise<string> {
    let id = '';
    await this.firebaseChatService
      .addChat(this.addedChannelId, 'chatchannels')
      .then((response) => {
        id = response.id;
      })
      .catch((error) => {
        console.error('Fehler beim Hinzufügen des Chats:', error);
        id = '';
      });
    return id;
  }

  /**
   * this function updates the channel with chat Id
   * @param chatId - string
   */
  async updateChannelWithChatId(chatId: string) {
    await this.firebaseChannelService.updateChannel(this.addedChannelId, {
      chatId: chatId,
    });
  }
  /**
   * this function adds the chatId to each user on firebase
   * @param setectedUsers - array
   */
  addChatIdIntoUser(selectedUsers: Array<any>) {
    for (let i = 0; i < selectedUsers.length; i++) {
      this.userService.addChatIdToUser(selectedUsers[i].id, this.firebaseChatService.activeChatId);
    }
  }

  /**
   * this function retuns the newChannelData object for addNewChannel()
   * @returns - object
   */
  addChannelwithChoosenMembers() {
    this.selectAllUsers();
    const selectedUserIds = this.selectedUsers.map((user) => user.id);
    const newChannelData = {
      channelName: this.globalVariables.channelData.channelName,
      description: this.globalVariables.channelData.description,
      chatId: '',
      members: selectedUserIds,
      creator: this.globalVariables.activeID,
    };
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

  close() {
    this.globalVariables.adduser = false;
    document.body.style.overflow = 'auto';
  }
}
