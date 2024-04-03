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
  getData(item: string) {
    let dataCollection = collection(this.firestore, item);
    return collectionData(dataCollection, { idField: 'id' });
  }

  // function to get data from firebase and save it into an local Array
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
  addData(goalCollection: string, input: any) {
    /* desc: string, , description: string */
    //let toGo = description;
    let data = input;
    let dataCollection = collection(this.firestore, goalCollection);
    return addDoc(dataCollection, data);
  }


  //warum existiert hier eine Firebasefunktion?
  //Alle Firebasefunktionen sollten in einem Firebaseservice sein
  async updateData(collectionPath: string, docId: string, data: Partial<any>): Promise<void> {
    const docRef = doc(this.firestore, collectionPath, docId);
    await updateDoc(docRef, data);
  }

  showDashboardElement(screenWidth: number) {
    if (window.innerWidth < screenWidth && this.globalVariables.showThread) this.globalVariables.showChannelMenu = false;
    else if (window.innerWidth >= 800) this.globalVariables.showChannelMenu = true;
  }

  submitChannelNameChange(newTitle: string): void {
    const channelId = this.globalVariables.openChannel.id; // Die ID des aktuellen Kanals
    this.firebaseChannelService.updateChannelTitle(channelId, newTitle);
  }

}
