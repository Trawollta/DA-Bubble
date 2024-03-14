import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core'; 
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { ChannelMenuComponent } from '../channel-menu.component';
import { AddContactsComponent } from '../add-contacts/add-contacts.component';
import { FirebaseUserService } from 'app/services/firebase-services/firebase-user.service';
import { onSnapshot } from 'firebase/firestore';

@Component({
  selector: 'app-show-contacts',
  standalone: true,
  imports: [CommonModule, ChannelMenuComponent, AddContactsComponent],
  templateUrl: './show-contacts.component.html',
  styleUrls: ['./show-contacts.component.scss']
})
export class ShowContactsComponent implements OnInit {
  selectedUserIds: number[] = []; 
  selectedUsers: any[] = [];
  allUsers: any[] = []; 

  globalFunctions = inject(GlobalFunctionsService);
  firebaseUserService = inject(FirebaseUserService)

  constructor(public globalVariables: GlobalVariablesService) {
    console.log(this.globalVariables)
  }

  ngOnInit() {
    this.updateSelectedUsers();
    console.log(this.getSingleUser(this.globalVariables.openChannel.id));    
  }

  getSingleUser(id: string) {
    return onSnapshot(this.firebaseUserService.getSingleDocRef('channels', id), (channel) => {
      if (channel.data()) {
        console.log(channel.data()!['members']);
        channel.data()!['members'].forEach((user: string) => this.selectedUsers.push(this.firebaseUserService.getSingleDocRef('users',user)));
      }
    });
  }

  updateSelectedUsers() {
    this.selectedUsers = this.allUsers.filter(user => this.selectedUserIds.includes(user.id));
    console.log('id ist:' ,this.globalVariables.channelData);
  }

}


