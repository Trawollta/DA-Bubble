import { Component, OnDestroy } from '@angular/core';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from 'app/shared/button/button.component';
import { AddContactsComponent } from '../add-contacts/add-contacts.component';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { FirebaseUserService } from 'app/services/firebase-services/firebase-user.service';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FirebaseChannelService } from 'app/services/firebase-services/firebase-channel.service';
import { FirebaseChatService } from 'app/services/firebase-services/firebase-chat.service';
import { channel } from 'app/models/channel.class';
import { Firestore, doc, updateDoc, arrayUnion } from '@angular/fire/firestore';

@Component({
  selector: 'app-add-to-channel',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    AddContactsComponent,
    InputfieldComponent,
    FormsModule,
  ],
  templateUrl: './add-to-channel.component.html',
  styleUrl: './add-to-channel.component.scss',
})
export class AddToChannelComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  globalFunctions = inject(GlobalFunctionsService);
  globalVariables = inject(GlobalVariablesService);
  firebaseChannelService = inject(FirebaseChannelService);
  firebaseChatService = inject(FirebaseChatService);
  firebaseUserService = inject(FirebaseUserService);
  addedChannelId: string = '';
  addedChatId: string = '';
  allUsers: any = [];
  users: any = [];
  searchInput = new Subject<string>();
  selectedUsers: any = [];
  userIdToAdd: string = '';


  channel: channel = {
    description: '',
    channelName: '',
    id: '',
    chatId: '',
    creator: '',
    channelMember: [],
  };


  // channelId: string | undefined; 
  newUserId: string | undefined; 


  selectedUserName: string = '';

  searchText: string = '';

  selectedUser: any = '';

  selectedUserDetails: { name: string; img: string } = { name: '', img: '' };

  constructor(private userService: FirebaseUserService, private firestore: Firestore) {
    this.searchInput
    .pipe(
      debounceTime(300), // Verzögere die Ausführung, um Rapid-Fire-Anfragen zu vermeiden
      distinctUntilChanged(), // Führe die Suche nur aus, wenn sich der Suchtext geändert hat
      switchMap(searchTerm => this.userService.searchUsersByName(searchTerm)),
      takeUntil(this.destroy$)
    )
    .subscribe(filteredUsers => {
      this.users = filteredUsers;
    });
  }

  ngOnInit(): void {
    this.globalFunctions.getCollection('users', this.allUsers); 
    console.log(this.allUsers);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // onSearchChange(searchValue: string): void {
  //   if (!searchValue) {
  //     this.users = [];
  //     return;
  //   }
  
  //   this.searchInput.next(searchValue);
  // }

  // addUserToList(user: any) {
  //   this.selectedUser.push(user.id);
  // }

  // selectChannel(channelId: string): void {
  //   console.log(`Channel ausgewählt: ${channelId}`);
  //   this.channelId = channelId;
  // }
  
  async selectUser(user: any) {
    this.selectedUser = user;
    this.selectedUserDetails.name = user.name;
    this.selectedUserDetails.img = user.img; // Stellen Sie sicher, dass 'img' ein gültiger Schlüssel im Benutzerobjekt ist
  
    let userId = await this.firebaseUserService.getUserDocIdWithName(user.name);
    this.userIdToAdd = userId[0];
    console.log(`Benutzer ausgewählt: ${user.name}`, 'ID:', this.userIdToAdd);
  
    // Reset der Suche und Auswahl
    this.selectedUserName = user.name;
    this.searchText = '';
    this.users = [];
  }

  clearSelectedUser() {
    this.selectedUserName = '';
    this.selectedUserDetails = { img: '', name: '' }; // Stellen Sie sicher, dass dies die Struktur von selectedUserDetails entspricht
    // Führen Sie hier zusätzliche Bereinigungsaktionen durch, falls erforderlich
  }


  async addUsersToExistingChannel() {
    if (!this.globalVariables.openChannel.id || !this.selectedUser) {
      return;
    }
  
    const channelRef = doc(this.firestore, 'channels', this.globalVariables.openChannel.id);
  
    try {
      await updateDoc(channelRef, {
        members: arrayUnion(this.userIdToAdd),
      });
      console.log('Benutzer erfolgreich hinzugefügt');
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Benutzers:', error);
    }

    this.firebaseUserService.addChatIdToUser(this.userIdToAdd, this.globalVariables.openChannel.chatId);
  }

  // data(): {} {
  //   const userChange = this.selectedUser !== this.channel.channelMember;
  //   const data: { [key: string]: any } = {};
  //   if (userChange) data['members'] = this.selectedUser;
  //   return data;
  // }


  onSearchChange(searchValue: string): void {
    if (!searchValue) {
        this.users = [];
        return;
    }
    this.searchInput.next(searchValue);
}
}
