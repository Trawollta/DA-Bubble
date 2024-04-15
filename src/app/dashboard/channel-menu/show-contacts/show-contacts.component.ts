import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
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
  imports: [
    CommonModule,
    ChannelMenuComponent,
    AddContactsComponent,
    FormsModule,
  ],
  templateUrl: './show-contacts.component.html',
  styleUrls: ['./show-contacts.component.scss'],
})
export class ShowContactsComponent implements OnInit {

  @Output() messageUpdated = new EventEmitter<string>();
  @Output() closeMember = new EventEmitter<boolean>();

  selectedUserIds: string[] = [];
  selectedUsers: any[] = [];
  allUsers: any[] = [];
  checked: boolean = false;
  checkedUsers: string = '';

  globalFunctions = inject(GlobalFunctionsService);
  firebaseUserService = inject(FirebaseUserService);
  globalVariables = inject(GlobalVariablesService);


  constructor() { }

  ngOnInit() {
    this.getChannelMembers(this.globalVariables.openChannel.id);
  }

  getChannelMembers(channelId: string) {
    const channelRef = this.firebaseUserService.getSingleDocRef(
      'channels',
      channelId
    );
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
    userIds.forEach((userId) => {
      const userRef = this.firebaseUserService.getSingleDocRef('users', userId);
      onSnapshot(userRef, (userSnapshot) => {
        if (userSnapshot.exists()) {
          this.selectedUsers.push(userSnapshot.data());
        }
      });
    });
  }

  openOtherContactsOverlay() {
    if (this.checkPermission()) {
      this.closeMembers();
      this.globalVariables.showContacts = true;
    } else {
      this.openAlertForm();
    }
  }

  closeMembers() {
    this.closeMember.emit(true);
    if (this.globalVariables.memberlist && !this.globalVariables.isMembersPopupOpen) {
      this.globalVariables.isMembersPopupOpen = true;
    } else if (this.globalVariables.memberlist && this.globalVariables.isMembersPopupOpen) {
      this.globalVariables.memberlist = false;
      this.globalVariables.isMembersPopupOpen = false;
    }
  }

  openAlertForm() {
    setTimeout(() => {
      document.getElementById('alertDiv')?.classList.remove('d-none');
      setTimeout(() => {
        this.closeMembers();
        //this.globalFunctions.closeMembers();
      }, 4500);
    }, 100);
  }


  /**
   *
   * @param user - string- contains the name of the selected user
   */
  checkboxChanged(user: string) {
    let userName = '@' + user + ', ';
    if (this.checkedUsers.includes(userName))
      this.checkedUsers = this.checkedUsers.replace(userName, '');
    else this.checkedUsers += userName;
    this.messageUpdated.emit(this.checkedUsers);
  }

  /**
* this function closes the showContacts popup by using appClickedOutside from ClickedOutsideDirective
* but it closes the popup immediately if no additional check will happen >> is the popup open?
*/


  async log(user: any) {
    let docId = await this.firebaseUserService.getUserDocIdWithName(user.name)
    this.leaveChannel(docId)
  }

  leaveChannel(docId: any) {
    this.firebaseUserService.leaveChannel(this.globalVariables.openChannel.chatId, docId[0]);
    this.firebaseUserService.leaveChannelUser(this.globalVariables.openChannel.chatId, docId[0]);
    this.globalFunctions.closeEditOverlay()
  }

  checkPermission(): boolean {
    return this.globalVariables.activeID === this.globalVariables.openChannel.creator;
  }

}
