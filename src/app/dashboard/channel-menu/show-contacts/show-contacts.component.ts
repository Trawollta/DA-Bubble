import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core'; 
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { ChannelMenuComponent } from '../channel-menu.component';
import { AddContactsComponent } from '../add-contacts/add-contacts.component';

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

  constructor(public globalVariables: GlobalVariablesService) {}

  ngOnInit() {
    this.updateSelectedUsers();
  }

  updateSelectedUsers() {
    this.selectedUsers = this.allUsers.filter(user => this.selectedUserIds.includes(user.id));
  }

}


