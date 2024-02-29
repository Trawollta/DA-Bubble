import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { ButtonComponent } from 'app/shared/button/button.component';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { AddNewChannelComponent } from '../add-new-channel/add-new-channel.component';


@Component({
  selector: 'app-add-contacts',
  standalone: true,
  imports: [
    ButtonComponent,
    CommonModule,
    InputfieldComponent,
    AddNewChannelComponent
  ],
  templateUrl: './add-contacts.component.html',
  styleUrl: './add-contacts.component.scss'
})
export class AddContactsComponent {

  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);

  [x: string]: any;

  constructor() { }

  addNewChannel() {

    this.globalFunctions.addData('channels', this.globalVariables.channelData);
    this.globalVariables.openChannel = this.globalVariables.channelData.channelName;
    this.globalVariables.channelData.channelName = '';
    this.globalVariables.channelData.description = '';
    this.globalFunctions.closeUserOverlay();
  }

}
