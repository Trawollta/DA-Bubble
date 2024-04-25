import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { ChannelMenuComponent } from '../channel-menu.component';
import { AddContactsComponent } from '../add-contacts/add-contacts.component';
import { FirebaseUserService } from 'app/services/firebase-services/firebase-user.service';
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
  selectedUsers: Array<{ id: string; name: string; img: string; checked: boolean; }> = [];

  checked: boolean = false;
  checkedUsers: string = '';

  globalFunctions = inject(GlobalFunctionsService);
  firebaseUserService = inject(FirebaseUserService);
  globalVariables = inject(GlobalVariablesService);


  constructor() { }

  ngOnInit() {
    this.copyUsers(this.globalVariables.openChannelUser);
  }

  /**
   * this function copies data from openChannelUser to selectedUsers
   * @param openChannelUser - Array - contains all user data for open chat
   */
  copyUsers(openChannelUser: { id: string; name: string; img: string; }[]) {
    this.selectedUsers = [];
    openChannelUser.forEach((user: { id: string; name: string; img: string; }) => {
      const newUser = {
        id: user.id,
        name: user.name,
        img: user.img,
        checked: false
      };
      this.selectedUsers.push(newUser);
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
   * this function calls the function for removing user from channel and magages teh related arrays
   * @param user - object
   * @param index - number
   */
  async removeUserFromChannel(user: any, index: number) {
    this.leaveChannel(user.id);
    this.globalVariables.openChannelUser.splice(index, 1);
    this.globalVariables.notInOpenChannelUser.push(user);
    this.copyUsers(this.globalVariables.openChannelUser);
  }

  /**
   * this function removes teh selecetd user from aktice channel
   * @param docId - string
   */
  leaveChannel(docId: string) {
    this.firebaseUserService.leaveChannel(this.globalVariables.openChannel.chatId, docId);
    this.firebaseUserService.leaveChannelUser(this.globalVariables.openChannel.chatId, docId);
  }

  checkPermission(): boolean {
    return this.globalVariables.activeID === this.globalVariables.openChannel.creator;
  }

}
