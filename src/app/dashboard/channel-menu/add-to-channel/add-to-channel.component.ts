import { Component, inject } from '@angular/core';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from 'app/shared/button/button.component';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { FirebaseUserService } from 'app/services/firebase-services/firebase-user.service';
import { FirebaseChannelService } from 'app/services/firebase-services/firebase-channel.service';


@Component({
  selector: 'app-add-to-channel',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    InputfieldComponent,
    FormsModule,
  ],
  templateUrl: './add-to-channel.component.html',
  styleUrl: './add-to-channel.component.scss',
})
export class AddToChannelComponent {

  globalFunctions = inject(GlobalFunctionsService);
  globalVariables = inject(GlobalVariablesService);
  firebaseChannelService = inject(FirebaseChannelService);
  firebaseUserService = inject(FirebaseUserService);

  selectedUserName: string = ''; 
  users: { name: string; id: string; img: string, isActive: boolean }[] = [];
  notInOpenChannelUser: { name: string; id: string; img: string, isActive: boolean }[] = [];
  selectedUsers: { name: string; id: string; img: string, isActive: boolean }[] = [];
  selectedUser: any = '';
  searchTerm: string = '';

  ngOnInit() {
    this.notInOpenChannelUser = this.users = this.globalVariables.notInOpenChannelUser;
  }

  /**
   * this function filters the notInOpenChannelUser array for the searchTerm
   * @param searchTerm - string
   * @returns - void
   */
  onSearchChange(searchTerm: string): void {
    this.searchTerm = searchTerm;
    if (!searchTerm) {
      this.users = this.notInOpenChannelUser;
      return;
    }
    this.users = this.notInOpenChannelUser.filter(user => {
      return user.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

  }
  /**
   * this function moves the selected user to the selectedUsers and removes it from notInOpenChannelUser
   * @param user - Object - selected user Object 
   */
  selectUser(user: any) {
    if (!Array.isArray(this.selectedUsers)) {
      this.selectedUsers = [];
    }
    this.selectedUsers.push(user);
    const userIndex = this.notInOpenChannelUser.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      this.notInOpenChannelUser.splice(userIndex, 1);
    }
    this.users = this.notInOpenChannelUser;
    this.onSearchChange(this.searchTerm);
  }

  /**
   * this function removes the seleced user from the selected user list and push it back to unselected.
   * @param i - number - index 
   */
  deleteUserFromSelect(i: number) {
    this.notInOpenChannelUser.push(this.selectedUsers[i]);
    this.selectedUsers.splice(i, 1);
  }

  /**
   * this function adds the selected user to the channel and adds the chatid to the selected user 
   */
  async addUsersToExistingChannel() {
    let member: Array<string> = [];
    this.selectedUsers.forEach((user) => {
      this.firebaseChannelService.addUserToChannel(this.globalVariables.openChannel.id, user.id);
      this.firebaseUserService.addChatIdToUser(user.id, this.globalVariables.openChannel.chatId);
      member.push(user.id);
    });
    this.globalVariables.openChannelUser.forEach((user) => {
      member.push(user.id);
    });
    this.globalFunctions.getChatUserData(member);   
    this.globalFunctions.closeAddContactsOverlay();
  }

}
