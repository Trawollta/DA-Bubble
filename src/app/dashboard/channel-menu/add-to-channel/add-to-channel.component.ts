import { Component } from '@angular/core';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from 'app/shared/button/button.component';
import { AddContactsComponent } from '../add-contacts/add-contacts.component';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { FirebaseUserService } from 'app/services/firebase-services/firebase-user.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-add-to-channel',
  standalone: true,
  imports: [
    CommonModule, ButtonComponent, AddContactsComponent, InputfieldComponent, FormsModule
  ],
  templateUrl: './add-to-channel.component.html',
  styleUrl: './add-to-channel.component.scss'
})
export class AddToChannelComponent {
  globalFunctions = inject(GlobalFunctionsService);
  globalVariables = inject(GlobalVariablesService);
  users: any = [];
  searchInput = new Subject<string>();

  constructor(private userService: FirebaseUserService) {
    this.searchInput.pipe(
      debounceTime(300), // Verzögerung, um nicht bei jeder Taste zu suchen
      distinctUntilChanged(), // Nur suchen, wenn sich der Wert geändert hat
      switchMap(searchTerm => this.userService.searchUsersByName(searchTerm))
    ).subscribe(users => {
      this.users = users;
    });
  }

  onSearchChange(searchValue: string): void {
    console.log(searchValue);
    this.searchInput.next(searchValue);
  }

  addNewChannel() {

    this.globalFunctions.addData('channels', this.globalVariables.channelData);
    this.globalVariables.openChannel.titel = this.globalVariables.channelData.channelName;
    this.globalVariables.channelData.channelName = '';
    this.globalVariables.channelData.description = '';
    this.globalVariables.channelData.chatId = '';
    this.globalFunctions.closeAddContactsOverlay();
  }

}
