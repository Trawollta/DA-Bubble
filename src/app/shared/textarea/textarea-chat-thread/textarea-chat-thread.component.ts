import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { getDownloadURL, getStorage, ref, uploadBytes } from '@angular/fire/storage';
import { FormsModule } from '@angular/forms';
import { ShowContactsComponent } from 'app/dashboard/channel-menu/show-contacts/show-contacts.component';
import { ClickedOutsideDirective } from 'app/directives/clicked-outside.directive';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { FirebaseChatService } from 'app/services/firebase-services/firebase-chat.service';
import { EmojiContainerComponent } from 'app/shared/reactions/emoji-container/emoji-container.component';

@Component({
  selector: 'app-textarea-chat-thread',
  standalone: true,
  imports: [
    CommonModule,
    ShowContactsComponent,
    FormsModule,
    EmojiContainerComponent,
    ClickedOutsideDirective],
  templateUrl: './textarea-chat-thread.component.html',
  styleUrl: './textarea-chat-thread.component.scss'
})
export class TextareaChatThreadComponent {

  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);
  firebaseChatService = inject(FirebaseChatService);

  isPopupOpen: boolean = false;

  // for file upload 
  storage = getStorage();
  deleteFileRef = ref(this.storage, '');
  showErrorPopup = false;
  showValidationPopup = false;
  forbiddenChars: string = '';
  downloadURL = '';
  downloadURLAlias = ''
  fileSize = '';
  selectedFile: File | null = null;

  /**
   * this function fills all relevant data to the messagData object and calls the send message function from firebase service
   */
  async sendMessage() {
    this.forbiddenChars = this.globalFunctions.isMessageValid(this.globalVariables.newMessage);

    if (this.globalVariables.newMessage !== '' && this.forbiddenChars.length === 0) {
      await this.preperDataForSendMessage();
      let chatFamiliy = this.globalVariables.isUserChat ? 'chatusers' : 'chatchannels';
      this.firebaseChatService.sendMessage(this.globalVariables.openChannel.chatId, chatFamiliy);
      this.cleardata();
    } else {
      this.showValidationPopup = true;
    }

  }

  async preperDataForSendMessage() {
    this.globalVariables.messageData.userId = this.globalVariables.activeID;
    this.globalVariables.messageData.timestamp = new Date().getTime();
    this.globalVariables.messageData.answerto = '';
    this.globalVariables.messageData.message = await this.buildMessage();
    this.globalVariables.messageData.emoji = [{ icon: '', userId: [] as any[], iconId: '' }];
  }
  cleardata() {
    this.globalVariables.messageData.message = '';
    this.globalVariables.newMessage = '';
    this.selectedFile = null
    this.globalVariables.scrolledToBottom = false;
  }

  /**
 * This function checks if file size ok, if yes save file object and alias
 * @param event - click on open button
 */
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      if (this.selectedFile.size > 500000) {
        this.showErrorPopup = true;
        this.fileSize = Math.round(this.selectedFile.size / 1000).toString() + 'KB';
        this.selectedFile = null;
      }
      else {
        this.downloadURLAlias = this.selectedFile.name
        this.globalVariables.newMessage = this.downloadURLAlias;
      }
    }
  }

  /**
* this function replaces the alias with the URL
* @returns message which should send
*/
  async buildMessage() {
    let message = this.globalVariables.newMessage
    if (this.selectedFile) {
      await this.uploadfile(this.selectedFile);
      message = message.replace(this.downloadURLAlias, this.downloadURL);
    }
    return message;
  }


  /**
 * this function stores the file in storage and returns the download URL
 * @param file - selectedFile 
 */
  async uploadfile(file: File | null) {
    if (file) {
      try {
        const storageRef = ref(this.storage, this.globalVariables.activeID + '/' + file.name);
        this.deleteFileRef = storageRef; // if delete is necessary
        const imageRef = ref(storageRef, file.name);
        await uploadBytes(imageRef, file);
        this.downloadURL = await getDownloadURL(imageRef);
      } catch (error) { console.error("error while uploading:", error); }
    } else console.error("No file availabe");
  }

  showMembers(headerShowMembers: boolean) { 
    this.globalVariables.memberlist = true;
    this.globalVariables.headerShowMembers = this.globalVariables.memberlist && headerShowMembers ? true : false;
    this.globalFunctions.freezeBackground(this.globalVariables.memberlist);   
  }

  showEmojiContainer() {
    this.globalVariables.showEmojiContainer = true;
    this.globalFunctions.freezeBackground(this.globalVariables.showEmojiContainer);
  }

  /**
   * this function closes the emoji popup by using appClickedOutside from ClickedOutsideDirective
   * but it closes the popup immediately if no additional check will happen >> is the popup open?
   */
  closeEmoji() {
    if (this.globalVariables.showEmojiContainer && !this.isPopupOpen) {
    this.isPopupOpen = true;
  } else if (this.globalVariables.showEmojiContainer && this.isPopupOpen) {
    this.globalVariables.showEmojiContainer = false;
    this.isPopupOpen = false;
  }    
}

 /**
   * this function just sets the flag for closing the error popup
   */
 closeErrorPopup() {
  console.log('showErrorPopup');
  this.showErrorPopup = false;
}

  /**
 * this function just sets the flag for closing the error popup
 */
  closeValidationPopup() {
    if (this.showValidationPopup && !this.isPopupOpen) {
      this.isPopupOpen = true;
    } else if (this.showValidationPopup && this.isPopupOpen) {
      this.showValidationPopup = false;
      this.isPopupOpen = false;
    } 
    console.log('showValidationPopup');
   // this.showValidationPopup = false;
  }


}
