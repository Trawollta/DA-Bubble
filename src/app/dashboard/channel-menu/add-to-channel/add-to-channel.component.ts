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
  addedChannelId: string = '';
  addedChatId: string = '';
  allUsers: any = [];
  users: any = [];
  searchInput = new Subject<string>();
  selectedUser: any = [];


  channel: channel = {
    description: '',
    channelName: '',
    id: '',
    chatId: '',
    creator: '',
    channelMember: [],
  };

  constructor(private userService: FirebaseUserService) {
    this.searchInput
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((searchTerm) =>
          this.userService.searchUsersByName(searchTerm)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((users) => {
        this.users = users;
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

  onSearchChange(searchValue: string): void {
    console.log(searchValue);
    this.searchInput.next(searchValue);
  }

  addUserToList(user: any) {
    this.selectedUser.push(user.id);
  }

  async addToChannel() {
    let relatedID = this.globalVariables.openChannel.id;
    this.firebaseChannelService.updateDataChannel(this.data(), relatedID);
    let chatData = await this.firebaseChannelService.loadChannelData(relatedID);
    this.channel = new channel(chatData);
  }

  data(): {} {
    const userChange = this.selectedUser !== this.channel.channelMember;
    const data: { [key: string]: any } = {};
    if (userChange) data['members'] = this.selectedUser;
    return data;
  }

}
