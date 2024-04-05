import { CommonModule } from '@angular/common';
import { Component, inject, OnInit} from '@angular/core';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { ChannelMenuComponent } from '../channel-menu.component';
import { AddContactsComponent } from '../add-contacts/add-contacts.component';
import { FirebaseUserService } from 'app/services/firebase-services/firebase-user.service';
import { onSnapshot } from 'firebase/firestore';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-show-contacts',
  standalone: true,
  imports: [CommonModule, ChannelMenuComponent, AddContactsComponent, FormsModule],
  templateUrl: './show-contacts.component.html',
  styleUrls: ['./show-contacts.component.scss']
})
export class ShowContactsComponent implements OnInit {

  selectedUserIds: string[] = [];
  selectedUsers: any[] = [];
  allUsers: any[] = [];
  checked: boolean = false;

  globalFunctions = inject(GlobalFunctionsService);
  firebaseUserService = inject(FirebaseUserService)
  GlobalVariablesService = inject(GlobalVariablesService)

  constructor(public globalVariables: GlobalVariablesService) {
    //console.log(this.globalVariables)
  }

  ngOnInit() {
    this.getChannelMembers(this.globalVariables.openChannel.id);
  }

  getChannelMembers(channelId: string) {
    const channelRef = this.firebaseUserService.getSingleDocRef('channels', channelId);
    onSnapshot(channelRef, (snapshot) => {
      const channelData = snapshot.data();
      if (channelData && channelData['members']) {
        this.selectedUserIds = channelData['members'];
        this.fetchUsersDetails(this.selectedUserIds);
      }
    });
  }

  fetchUsersDetails(userIds: string[]) {
    this.selectedUsers = []; // Reset the array to ensure it's clean before adding new users
    userIds.forEach(userId => {
      const userRef = this.firebaseUserService.getSingleDocRef('users', userId);
      onSnapshot(userRef, (userSnapshot) => {
        if (userSnapshot.exists()) {
          this.selectedUsers.push(userSnapshot.data());
        }
      });
    });
  }


  openOtherContactsOverlay() {
    this.globalVariables.showContacts = true;
    this.globalFunctions.closeMembers();
  }


/**
 * 
 * @param user - string- contains the name of the selected user
 */
  checkboxChanged(user: string) {
    let userName = '@' + user + ', ';let newMessage = this.globalVariables.newMessage;
    if (newMessage.includes(userName)) newMessage = newMessage.replace(userName, '');
    else newMessage += userName;
    this.globalVariables.newMessage = newMessage;
  }
  

  closeMembers() {
    // Setze die Variable, die das "Show Contacts"-Overlay steuert, auf false
    this.globalVariables.memberlist = false;
  }
}


