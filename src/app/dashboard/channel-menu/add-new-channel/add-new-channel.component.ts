import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { GlobalFunctionsService } from 'app/services/global-functions.service';
import { GlobalVariablesService } from 'app/services/global-variables.service';
import { InputfieldComponent } from 'app/inputfield/inputfield.component';
import { ButtonComponent } from 'app/button/button.component';

@Component({
  selector: 'app-add-new-channel',
  standalone: true,
  imports: [RouterLink, CommonModule, InputfieldComponent, ButtonComponent],
  templateUrl: './add-new-channel.component.html',
  styleUrl: './add-new-channel.component.scss',
})
export class AddNewChannelComponent {
  constructor(public globalFunctions: GlobalFunctionsService) {}

  addNewChannel() {
    const descElement = document.getElementById('newChannel');
    if (descElement) {
      const desc = (descElement as HTMLInputElement).value;
      this.globalFunctions.addData(desc, 'channels', 'channelName');
    }
  }
}


