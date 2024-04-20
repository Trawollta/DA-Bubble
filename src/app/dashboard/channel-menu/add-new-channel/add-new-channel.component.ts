//import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { ButtonComponent } from 'app/shared/button/button.component';
import { FormsModule } from '@angular/forms';
import { FirebaseChannelService } from 'app/services/firebase-services/firebase-channel.service';
import { mergeNsAndName } from '@angular/compiler';

@Component({
  selector: 'app-add-new-channel',
  standalone: true,
  imports: [
    //RouterLink,
    CommonModule,
    InputfieldComponent,
    ButtonComponent,
    FormsModule,
  ],
  templateUrl: './add-new-channel.component.html',
  styleUrl: './add-new-channel.component.scss',
})
export class AddNewChannelComponent {
  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);
  firebaseChat = inject(FirebaseChannelService);

  [x: string]: any;
  showError: boolean = false;
  channelName: string | null = null;
  description: string | null = null;

  async onSubmit() {
   
    const result = await this.checkChannelName();
    if (result) {
      this.showError = true; 
      return;
    }

    if (this.channelName && this.description) {
      this.globalVariables.channelData.channelName = this.channelName;
      this.globalVariables.channelData.description = this.description;
      this.globalVariables.showAddChannel = false;
      this.globalVariables.adduser = true;
      document.body.style.overflow = 'hidden';
    }
  }

  async checkChannelName(): Promise<boolean> {
    let channelExist = await this.getCurrentUserChannel();
    return channelExist;
  }

  async getCurrentUserChannel(): Promise<boolean> {
    try {
      let docIdChats: string[] = [];

      for (
        let i = 0;
        i < this.globalVariables.currentUser.relatedChats.length;
        i++
      ) {
        const data = await this.firebaseChat.getDocId(
          this.globalVariables.currentUser.relatedChats[i]
        );
        docIdChats.push(data[0]);
      }

      for (let i = 0; i < docIdChats.length; i++) {
        const data = await this.firebaseChat.getChannelData(docIdChats[i]);
        if (
          data?.['channelName']?.toLowerCase() ===
          this.channelName?.toLowerCase()
        ) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error retrieving channel data:', error);
      return false;
    }
  }

  showErrorMessage(msg: string) {
    console.log(msg)
  }

  isValid(): boolean {
    return this.channelName && this.description ? false : true;
  }
}
