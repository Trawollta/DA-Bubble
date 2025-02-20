import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonComponent } from 'app/shared/button/button.component';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { UiStateService } from 'app/services/uistate.service';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
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
  private globalFunctions = inject(GlobalFunctionsService);
  public uiStateService = inject(UiStateService);



  addedChannelId: string = '';
  allUsers: any[] = [];
  selectedUsers: any[] = [];
  showAllUsers: boolean = true;
  isChecked: boolean[] = [];
  filteredUsers: any[] = [];
  private searchTerms = new Subject<string>();

  async ngOnInit() {
    await this.globalFunctions.getCollection('users', this.allUsers);
    this.isChecked = new Array(this.allUsers.length).fill(false);
    this.setupSearch();
  }

  setupSearch() {
    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string) => this.globalFunctions.searchUsersByName(term))
      )
      .subscribe((users) => {
        this.filteredUsers = users;
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

    this.uiStateService.activeID$.subscribe((activeID) => {
      if (!this.selectedUsers.some(user => user.id === activeID)) {
        const activeUser = this.allUsers.find(user => user.id === activeID);
        if (activeUser) {
          this.selectedUsers.push(activeUser);
        }
      }
    });
  }

  toggleSelectAllUser() {
    this.showAllUsers = !this.showAllUsers;
    this.selectAllUsers();
  }

  selectAllUsers() {
    if (this.showAllUsers) {
      this.selectedUsers = [...this.allUsers];
    } else {
      this.selectedUsers = [];
    }
  }

  async addNewChannel() {
    this.uiStateService.openChannel$.subscribe((channel) => {
      if (channel) {
        this.addedChannelId = channel.id;
      }
    });

    this.addChatIdIntoUser(this.selectedUsers);
    this.uiStateService.openChannel$.subscribe((channel) => {
      if (channel) {
        this.uiStateService.setOpenChannel({
          id: this.addedChannelId,
          title: channel.title,
        });
      }
    });

    this.pushNewChannelInViewableChannels(this.addedChannelId, "someChatId", "New Channel");
    this.resetAndCloseOverlay();
  }

  pushNewChannelInViewableChannels(addedChannelId: string, addedChatId: string, channelName: string) {
    this.uiStateService.setOpenChannel({ id: addedChannelId, title: channelName });
  }

  addChatIdIntoUser(selectedUsers: Array<any>) {
    selectedUsers.forEach(user => {
      console.log(`Füge Chat-ID für Benutzer ${user.id} hinzu.`);
    });
  }

  resetAndCloseOverlay() {
    this.uiStateService.setOpenChannel({ id: '', title: '' });
    this.selectedUsers = [];
    this.showAllUsers = true;
    this.globalFunctions.closeAddContactsOverlay();
  }

  close() {
    this.uiStateService.setOpenChannel({ id: '', title: '' });
  }
}
