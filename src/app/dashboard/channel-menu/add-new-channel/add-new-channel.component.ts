//import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { ButtonComponent } from 'app/shared/button/button.component';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-add-new-channel',
  standalone: true,
  imports: [
    //RouterLink,
    CommonModule,
    InputfieldComponent,
    ButtonComponent,
    FormsModule],
  templateUrl: './add-new-channel.component.html',
  styleUrl: './add-new-channel.component.scss',
})
export class AddNewChannelComponent {
  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);

  [x: string]: any;

  channelName: string | null = null;
  description: string | null = null;

  onSubmit() {
    if (this.channelName && this.description) {
      this.globalVariables.channelData.channelName = this.channelName;
      this.globalVariables.channelData.description = this.description;
      this.globalVariables.showAddChannel = false;
      this.globalVariables.adduser = true;
      document.body.style.overflow = 'hidden';
    }
  }

  isValid(): boolean {
    return this.channelName && this.description ? false : true;
  }
}



