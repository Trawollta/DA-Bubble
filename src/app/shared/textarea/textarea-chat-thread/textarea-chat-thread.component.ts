import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
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
  @Input() areaType: string = '';

  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);
  firebaseChatService = inject(FirebaseChatService);

  isPopupOpen: boolean = false;
  isEmojiContainerOpen: boolean = false;
  isMemberContainerOpen: boolean = false;
  isValidationPopupOpen: boolean = false;

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
  answerToKey: string = '';
  newMessage: string = '';



  ngOnInit() {
    if (this.globalVariables.messageThreadStart.userId !== '')
      this.answerToKey = this.globalVariables.messageThreadStart.userId + '_' + this.globalVariables.messageThreadStart.timestamp.toString();
  }

/**
 * this function overwrites the lokal newMessage with the seleceted members of app-show-contacts
 * @param newMessage - string - contains selected member
 */
  onMessageUpdated(newMessage: string) {
    this.newMessage = newMessage; // Update newMessage when received from event
    //Ich muss hier nochmal ran.
    //this.newMessage muss durchsucht werden nach allen @ Einträgen und verglichen werden newMessage 
  }

  /**
   * this function closes the member popup if the close button within app-show-contacts was hit
   * @param close - boolean - true if close button was hit
   */
  popUpClosed(close: boolean) {
    this.isMemberContainerOpen = !close;
  }

  /**
   * this function adds the selected emoji to the local newMessage
   * @param emoji - string - selceted emoji
   */
  addEmoji(emoji:string){
    this.newMessage += emoji;
  }


  /**
   * this function fills all relevant data to the messagData object and calls the send message function from firebase service
   */
  async sendMessage() {
    this.globalVariables.newMessage = this.newMessage;
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
    this.globalVariables.messageData.answerto = this.globalVariables.showThread ? this.answerToKey : '';
    this.globalVariables.messageData.message = await this.buildMessage();
    this.globalVariables.messageData.emoji = [{ icon: '', userId: [] as any[], iconId: '' }];
  }
  cleardata() {
    this.newMessage = '';
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
        this.downloadURLAlias = this.selectedFile.name;
        this.newMessage += this.downloadURLAlias;
        // this.globalVariables.newMessage += this.downloadURLAlias;
      }
    }
  }

  /**
* this function replaces the alias with the URL
* @returns message which should send
*/
  async buildMessage() {
    let message = this.globalVariables.newMessage;
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

  /**
    * this function just sets the flag for closing the error popup
    */
  closeErrorPopup() {
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
  }


  showEmojiContainer() {
    this.isEmojiContainerOpen = true;
    this.globalFunctions.freezeBackground(this.isEmojiContainerOpen);
  }

  /**
  * this function closes the emoji popup by using appClickedOutside from ClickedOutsideDirective
  * but it closes the popup immediately if no additional check will happen >> is the popup open?
  */
  closeEmoji() {
    if (this.isEmojiContainerOpen && !this.isPopupOpen) {
      this.isPopupOpen = true;
    } else if (this.isEmojiContainerOpen && this.isPopupOpen) {
      this.isPopupOpen = false;
      this.isEmojiContainerOpen = false;
    }
  }

  showMembers(headerShowMembers: boolean) {
    this.isMemberContainerOpen = true;
    this.globalVariables.memberlist = true;
    this.globalVariables.headerShowMembers = this.globalVariables.memberlist && headerShowMembers ? true : false;
    this.globalFunctions.freezeBackground(this.isMemberContainerOpen);
  }

  closeMembers() {
    if (this.isMemberContainerOpen && !this.isPopupOpen) {
      this.isPopupOpen = true;
    } else if (this.isMemberContainerOpen && this.isPopupOpen) {
      this.isMemberContainerOpen = false;
      this.isPopupOpen = false;
    }
  }

}
