import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { ChannelMenuComponent } from '../channel-menu.component';
import { AddContactsComponent } from '../add-contacts/add-contacts.component';
import { UserService, User } from 'app/services/user.service';

@Component({
  selector: 'app-show-contacts',
  standalone: true,
  imports: [
    CommonModule,
    // ChannelMenuComponent,
    // AddContactsComponent,
    FormsModule,
  ],
  templateUrl: './show-contacts.component.html',
  styleUrls: ['./show-contacts.component.scss'],
})
export class ShowContactsComponent implements OnInit {
  @Output() messageUpdated = new EventEmitter<string>();
  @Output() closeMember = new EventEmitter<boolean>();

  selectedUsers: User[] = [];

  globalFunctions = inject(GlobalFunctionsService);
  globalVariables = inject(GlobalVariablesService);
  private userService = inject(UserService);

  constructor() { }

  ngOnInit() {
    this.loadUsers();
  }

  /**
   * Lädt Benutzer aus dem Backend und speichert sie in `selectedUsers` & `openChannelUser`
   */
  loadUsers() {
    console.log("🚀 Hole Benutzer aus dem Backend...");
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        console.log("📌 Benutzer erhalten:", users);
        this.selectedUsers = users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          img: user.img || 'assets/img/default-avatar.png',
          isActive: false,
        }));
  
        this.globalVariables.openChannelUser = [...this.selectedUsers];
      },
      error: (error) => {
        console.error('❌ Fehler beim Laden der Nutzer:', error);
      }
    });
  }
  

  closeMembers() {
    this.closeMember.emit(true);
    this.globalVariables.isMembersPopupOpen = false;
  }

  checkPermission(): boolean {
    return this.globalVariables.activeID === this.globalVariables.openChannel.creator;
  }
}
