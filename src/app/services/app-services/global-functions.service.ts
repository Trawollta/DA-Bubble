import { Injectable, inject } from '@angular/core';
import { GlobalVariablesService } from './global-variables.service';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';
import { FirebaseChatService } from '../firebase-services/firebase-chat.service';
import { FirebaseChannelService } from '../firebase-services/firebase-channel.service';

export interface MessageInfo {
  hasUrl: boolean;
  message: string;
  textAfterUrl: string;
  messageImgUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class GlobalFunctionsService {

  globalVariables = inject(GlobalVariablesService);
  firebaseChatService = inject(FirebaseChatService);
  firebaseChannelService = inject (FirebaseChannelService);

  openProfile(ownProfile: boolean, userId: string) {
    this.globalVariables.profileUserId = userId;
    this.globalVariables.ownprofile = ownProfile ? true : false;
    this.globalVariables.showProfile = true;
    /*    console.log(
         'this.globalVariables.ownprofile: ',
         this.globalVariables.ownprofile
       ); */
  }

  //Diese openOverlay Funktionen sollten wir zu einer zusammenfassen und nur einen Parameter übergeben
  menuProfileClicked() {
    this.globalVariables.showProfileMenu =
      !this.globalVariables.showProfileMenu;
      this.freezeBackground(this.globalVariables.showProfileMenu);
  }

  openChannelOverlay() {
    this.globalVariables.channel = !this.globalVariables.channel;
    if (this.globalVariables.channel) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    this.globalVariables.channelData.channelName = '';
    this.globalVariables.channelData.description = '';
  }

  openEditChannelOverlay() {
    this.globalVariables.channelData.channelName = this.globalVariables.openChannel.titel;
    this.globalVariables.channelData.description = this.globalVariables.openChannel.desc;
    this.globalVariables.channelData.chatId = this.globalVariables.openChannel.chatId;
    this.globalVariables.channelData.id = this.globalVariables.openChannel.id;
    this.globalVariables.channelData.creator = this.globalVariables.openChannel.creator;

    this.globalVariables.isEditingChannel = true;

    this.globalVariables.editChannelOverlayOpen = true;
  }

  openUserOverlay() {
    this.globalVariables.adduser = !this.globalVariables.adduser;
    if (this.globalVariables.adduser) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }

  openReactionDialog() {
    this.globalVariables.openReaction = !this.globalVariables.openReaction;
    if (this.globalVariables.adduser) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }

  openAddContactsOverlay() {
    this.globalVariables.showContacts = true;
    /* console.log(
      'Overlay should open now. showContacts:',
      this.globalVariables.showContacts
    ); */
    if (this.globalVariables.showContacts)
      document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }

  showMembers() {
    this.globalVariables.memberlist = !this.globalVariables.memberlist;
    if (this.globalVariables.memberlist)
      document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }

  freezeBackground(freeze: boolean){
    if (freeze)
      document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }

  //Diese CloseOverlay Funktionen sollten wir zu einer zusammenfassen und nur einen Parameter übergeben

  closeChannelOverlay() {
    this.globalVariables.showProfile = false;
    this.globalVariables.channel = false;
  }

  closeReactionDialog() {
    this.globalVariables.showProfile = false;
    this.globalVariables.adduser = false;
  }

  closeEditOverlay() {
    this.globalVariables.editChannelOverlayOpen = false;
    //this.globalVariables.showProfile = false; // warum wird hier die Variable für das Profil gesetzt?
    document.body.style.overflow = 'auto';
  }

  closeAddContactsOverlay() {
    this.globalVariables.showContacts = false;
    document.body.style.overflow = 'auto';
  }

  //diese close funktion weicht etwas ab von den anderen
  closeMembers() {
    this.globalVariables.memberlist = false;
    if (this.globalVariables.memberlist)
      document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }

  toggleOverlays() {
    // console.log(`Vorher - channel: ${this.channel}, adduser: ${this.adduser}`);
    this.globalVariables.channel = false;
    this.globalVariables.adduser = true;
    // console.log('input feld Channel: ', this.globalVariables.newChannel);
    // console.log(`Nachher - channel: ${this.channel}, adduser: ${this.adduser}`);
    document.body.style.overflow = 'hidden';
  }

  stopPropagation(e: Event) {
    e.stopPropagation();
  }


  /**
 * this function provides all relevant information for the answer section
 */
  getAnswerInfo(message: any): { answerCount: number, lastAnswerTime: number, answerKey: string } {
    let answerInfo = { answerCount: 0, lastAnswerTime: 0, answerKey: '' };
    answerInfo.answerKey = message.userId + '_' + message.timestamp.toString();
    let filteredMessages = this.globalVariables.chatChannel.messages.filter(
      (message) => message.answerto === answerInfo.answerKey
    );
    answerInfo.answerCount = filteredMessages.length;
    if (filteredMessages.length > 0 && filteredMessages[filteredMessages.length - 1].timestamp)
      answerInfo.lastAnswerTime = filteredMessages[filteredMessages.length - 1].timestamp;
    return answerInfo;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //functions to change the chat start
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  /**
   * this function fills the usterToChatWith with all nessecary information and
   * @param user - object - contains all user information
   */
  openDirectMessageUser(user: any) {
    this.globalVariables.isUserChat = true;
    this.globalVariables.userToChatWith.name = user.name;
    this.globalVariables.userToChatWith.img = user.img;
    this.globalVariables.userToChatWith.email = user.email;
    user.id
      ? (this.globalVariables.userToChatWith.id = user.id)
      : this.globalVariables.profileUserId;
    this.globalVariables.userToChatWith.isActive = user.isActive;
    let chatId = this.firebaseChatService.bulidUserChatId(true);
    this.globalVariables.openChannel.chatId = chatId;
    this.firebaseChatService.activeChatId = chatId;
    this.showChat();
  }

  /**
   * this function stets the flag for visability for chat
   * * @param chatId - contains the chat id of the chat which should be open
   */
  async showChat() {
    this.globalVariables.showThread = false;
    if(this.globalVariables.isUserChat)
    await this.firebaseChatService.existUserChat('chatusers');
    this.firebaseChatService.changeActiveChannel();
    this.globalVariables.isChatVisable = true;
    if (!this.globalVariables.desktop800) {
      this.globalVariables.showChannelMenu = false;
    }
  }
  
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //functions to change the chat end
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


  constructor(private firestore: Firestore) { }

  // simple function to get data from firestore returns a collection
 /*  getData(item: string) {
    let dataCollection = collection(this.firestore, item);
    return collectionData(dataCollection, { idField: 'id' });
  } */

  // function to get data from firebase and save it into an local Array
  // Alex: 5.4.24: Diese Funktion wird in den Komponenten
  // add-to-Channel
  // add-contacts
  // channel-menu
  // benutzt. 
  // Ich werde diese Funktion nach analyse in den einzelnen Komponenten verschieben
  // und aus dem onSnapshot ggf eine getDoc machen.
  // das Problem. Hier wird ein Snapshot aboniert der auch wieder deaboniert werden sollte
  getCollection(item: string, targetArray: any) {
    const collectionReference = collection(this.firestore, item);
    onSnapshot(collectionReference, (querySnapshot) => {
      targetArray.length = 0;
      querySnapshot.forEach((doc) => {
        let docData = doc.data();
        docData['id'] = doc.id;
        targetArray.push(docData);
      });
    });
  }

  // hab die Funktion geänder 26.2, Alex
  // function to add data to a Collection you choose
/*   addData(goalCollection: string, input: any) {
    let data = input;
    let dataCollection = collection(this.firestore, goalCollection);
    return addDoc(dataCollection, data);
  } */


  //warum existiert hier eine Firebasefunktion?
  //Alle Firebasefunktionen sollten in einem Firebaseservice sein
 /*  async updateData(collectionPath: string, docId: string, data: Partial<any>): Promise<void> {
    const docRef = doc(this.firestore, collectionPath, docId);
    await updateDoc(docRef, data);
  } */

  showDashboardElement(screenWidth: number) {
    if (window.innerWidth < screenWidth && this.globalVariables.showThread) this.globalVariables.showChannelMenu = false;
    else if (window.innerWidth >= 800) this.globalVariables.showChannelMenu = true;
  }

  submitChannelNameChange(newTitle: string): void {
    const channelId = this.globalVariables.openChannel.id; // Die ID des aktuellen Kanals
    this.firebaseChannelService.updateChannelTitle(channelId, newTitle);
  }

  /**
   * this function returns url if the message >>contains<< one
   * @param message - string
   * @returns - string if url and null if not
   */
  checkForURL(message: string): string | null {
    const urlPattern = /(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    const urlMatch = message.match(urlPattern);
    return urlMatch ? urlMatch[0] : null;
  }

  
  /**
   * this function should return a a string of not allowed char, when message is not valid
   * @param message string
   * @returns string
   */
  isMessageValid(message: string) {
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}]/u;
  const messageWithoutEmojis = message.replace(emojiRegex, 'Emoji');
  const allowedCharPattern = /[^a-zA-Z0-9\s.,!?/:;%&=@#'§$€°ÄäÖöÜüß_-]/g;
  const forbiddenCharacters = messageWithoutEmojis.match(allowedCharPattern) || [];
  const uniqueChar = Array.from(new Set(forbiddenCharacters)).join(', ');
  return uniqueChar; 
  }

  /**
   * This function checks the message if there is a URL inside and split message string if so
   * @param message - string- contains the message text
   * @returns - MessageInfo object with splited message information
   */
  checkMessage(message: string): MessageInfo {
    const result: MessageInfo = { hasUrl: false, message: message, textAfterUrl: '', messageImgUrl: '' };
    const urlPattern = /(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
    const urlMatch = message.match(urlPattern);
    if (urlMatch) {
      result.hasUrl = true;
      result.messageImgUrl = urlMatch[0];
      result.message = message.split(result.messageImgUrl)[0].trim();
      result.textAfterUrl = message.split(result.messageImgUrl)[1].trim();
    } 
    return result;
  }
}
