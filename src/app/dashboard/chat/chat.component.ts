import { Component, inject } from '@angular/core';
import { InputfieldComponent } from '../../shared/inputfield/inputfield.component';
import { CommonModule } from '@angular/common';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { EditChannelComponent } from '../channel-menu/edit-channel/edit-channel.component';
import { AllMessagesComponent } from 'app/shared/chats/all-messages/all-messages.component';
import { AddContactsComponent } from '../channel-menu/add-contacts/add-contacts.component';
import { AddToChannelComponent } from "../channel-menu/add-to-channel/add-to-channel.component";
import { ShowContactsComponent } from '../channel-menu/show-contacts/show-contacts.component';
import { FormsModule } from '@angular/forms';
import { FirebaseChatService } from 'app/services/firebase-services/firebase-chat.service';
import { FirebaseChannelService } from 'app/services/firebase-services/firebase-channel.service';
import { EmojiContainerComponent } from 'app/shared/reactions/emoji-container/emoji-container.component';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { ClickedOutsideDirective } from 'app/directives/clicked-outside.directive';



@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  imports: [
    InputfieldComponent,
    CommonModule,
    EditChannelComponent,
    AllMessagesComponent,
    AddContactsComponent,
    AddToChannelComponent,
    ShowContactsComponent,
    FormsModule,
    EmojiContainerComponent,
    ClickedOutsideDirective
  ]
})
export class ChatComponent {
  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);
  firebaseChatService = inject(FirebaseChatService);
  firebaseChannelService = inject(FirebaseChannelService);


  allUserMessages: string = '';
  newMessage = '';
  headerShowMembers: boolean = false;
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


  constructor() {

  }
  openEmojis() {
    let emojiDiv = document.getElementById('emojis');
    if (emojiDiv && emojiDiv.classList.contains('d-none')) {
      emojiDiv.classList.remove('d-none');
    } else if (emojiDiv && emojiDiv.classList.contains('d-none') == false) {
      emojiDiv.classList.add('d-none');
    }
  }

  ngOnInit() {
    this.globalVariables.scrolledToBottom = false;

  }


  openAnswers() {
    this.globalVariables.showThread = !this.globalVariables.showThread;
    if (window.innerWidth < 1100)
      this.globalVariables.showChannelMenu = false;
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
   * this function closes the showContacts popup by using appClickedOutside from ClickedOutsideDirective
   */
  closeMembers() {
    if (this.globalVariables.memberlist && !this.isPopupOpen) {
      this.isPopupOpen = true;
    } else if (this.globalVariables.memberlist && this.isPopupOpen) {
      this.globalVariables.memberlist = false;
      this.isPopupOpen = false;
    }
  }

  /**
   * this function closes the emoji popup by using appClickedOutside from ClickedOutsideDirective
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

  async preperDataForSendMessage(){
    this.globalVariables.messageData.userId = this.globalVariables.activeID;
    this.globalVariables.messageData.timestamp = new Date().getTime();
    this.globalVariables.messageData.answerto = '';
    this.globalVariables.messageData.message = await this.buildMessage();
    this.globalVariables.messageData.emoji = [{ icon: '', userId: [] as any[], iconId: '' }];
  }

  cleardata(){
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

  checkIfFileIsValidImgFile() {

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


  /**
   * this function removes the image from storage
   */
  deleteFile() {
    // Delete the file
    deleteObject(this.deleteFileRef).then(() => {
      console.log('File deleted successfully');
    }).catch((error) => {
      console.log('Uh-oh, an error occurred!', error);
    });
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
    closevalidationPopup() {
      console.log('showValidationPopup');
      this.showValidationPopup = false;
    }

    openContactsPopup(){
      this.globalVariables.desktop700 ? this.globalFunctions.openAddContactsOverlay() : this.showMembers(true);
    }

  /* doSomething(){
    
    console.log('nicht im Element');
  } */


}
