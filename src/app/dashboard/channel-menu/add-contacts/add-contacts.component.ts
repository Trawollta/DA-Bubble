import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { ButtonComponent } from 'app/button/button.component';
import { InputfieldComponent } from 'app/inputfield/inputfield.component';
import { GlobalFunctionsService } from 'app/services/global-functions.service';
import { GlobalVariablesService } from 'app/services/global-variables.service';
import { AddNewChannelComponent } from '../add-new-channel/add-new-channel.component';

@Component({
  selector: 'app-add-contacts',
  standalone: true,
  imports: [ButtonComponent, CommonModule, InputfieldComponent],
  templateUrl: './add-contacts.component.html',
  styleUrl: './add-contacts.component.scss'
})
export class AddContactsComponent {
  [x: string]: any;
  constructor(public globalFunctions: GlobalFunctionsService, public globalVariables: GlobalVariablesService ) {}

  addNewChannel() {
    const descElement = document.getElementById('newChannel');
    if (descElement) {
      const desc = (descElement as HTMLInputElement).value;
      this.globalFunctions.addData(desc, 'channels', 'channelName');
    }
  }

}
