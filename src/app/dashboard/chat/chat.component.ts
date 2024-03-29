import { Component, inject } from '@angular/core';
import { InputfieldComponent } from '../../shared/inputfield/inputfield.component';
import { CommonModule, ViewportScroller } from '@angular/common';
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
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';



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
    EmojiContainerComponent
  ]
})
export class ChatComponent {
  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);
  firebaseChatService = inject(FirebaseChatService);
  firebaseChannelService = inject(FirebaseChannelService);

  

  //scroller = inject(ViewportScroller);
  allUserMessages: string = '';
  newMessage = '';
  headerShowMembers: boolean = false;

  constructor(private scroller: ViewportScroller) {
    this.scroller.scrollToAnchor("scrolldown");
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
    this.scroller.scrollToAnchor("scrolldown");
  }
  goDown() {
    this.scroller.scrollToAnchor("scrolldown");
  }


  openAnswers() {
    this.globalVariables.showThread = !this.globalVariables.showThread;
    if (window.innerWidth < 1100)
      this.globalVariables.showChannelMenu = false;
  }

  showMembers(headerShowMembers: boolean) {
    this.globalVariables.memberlist = !this.globalVariables.memberlist;
    this.globalVariables.headerShowMembers = this.globalVariables.memberlist && headerShowMembers ? true : false;
    //console.log('headerShowMembers', this.globalVariables.headerShowMembers);
    this.globalFunctions.freezeBackground(this.globalVariables.memberlist);
  }

  showEmojiContainer() {
    this.globalVariables.showEmojiContainer = !this.globalVariables.showEmojiContainer;
    this.globalFunctions.freezeBackground(this.globalVariables.showEmojiContainer);
    // console.log('showEmojiContainer', this.globalVariables.showEmojiContainer);
  }

  sendMessage() {

    if (this.globalVariables.newMessage !== '') {
      this.globalVariables.messageData.userId = this.globalVariables.activeID;
      this.globalVariables.messageData.timestamp = new Date().getTime();
      this.globalVariables.messageData.answerto = '';
      this.globalVariables.messageData.message = this.globalVariables.newMessage;
      this.globalVariables.messageData.emoji = [{ icon: '', userId: [] as any[], iconId: '' }];
      let chatFamiliy = this.globalVariables.isUserChat ? 'chatusers' : 'chatchannels';
      this.firebaseChatService.sendMessage(this.globalVariables.openChannel.chatId, chatFamiliy);
      this.globalVariables.messageData.message = '';
      this.globalVariables.newMessage = '';
    }
    //this.goDown();
  }


  fileName = '';
  storage = getStorage();
  

  

  onFileSelected(event: any) {
    const selectedFile: File = event.target.files[0];
    // Hier kannst du den Code hinzufügen, um mit der ausgewählten Datei zu arbeiten
    console.log(selectedFile);
    this.uploadfile(selectedFile);
    
    

    if (selectedFile) {
      this.fileName = selectedFile.name;
      const formData = new FormData();
      formData.append("thumbnail", selectedFile);
      

    }
  }

  async uploadfile(file:File){
    const storageRef = ref(this.storage, this.globalVariables.activeID + '/' + file.name);
    const imageRef = ref(storageRef, file.name);
    console.log('mountainImagesRef', storageRef);
    if(file.size < 500000){
    await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(imageRef);
    console.log('downloadURL', downloadURL);
    this.globalVariables.newMessage = downloadURL;
  }else{
    console.log('file zu groß', file.size);
  }
  }

}
