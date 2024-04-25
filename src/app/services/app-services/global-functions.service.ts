import { Injectable, inject } from '@angular/core';
import { GlobalVariablesService } from './global-variables.service';
import {
  Firestore,
  collection,
  onSnapshot,
} from '@angular/fire/firestore';
import { FirebaseChatService } from '../firebase-services/firebase-chat.service';
import { FirebaseChannelService } from '../firebase-services/firebase-channel.service';
import { FirebaseUserService } from '../firebase-services/firebase-user.service';
import { Subject } from 'rxjs';

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
  firebaseChannelService = inject(FirebaseChannelService);
  firebasUserService = inject(FirebaseUserService);

  private focusSubject = new Subject<void>();
  focus$ = this.focusSubject.asObservable();

  triggerFocus() {
    this.focusSubject.next();
  }

  openProfile(ownProfile: boolean, userId: string) {
    this.globalVariables.profileUserId = userId;
    this.globalVariables.ownprofile = ownProfile ? true : false;
    this.globalVariables.showProfile = true;
  }

  //Diese openOverlay Funktionen sollten wir zu einer zusammenfassen und nur einen Parameter übergeben
  menuProfileClicked() {
    this.globalVariables.showProfileMenu =
      !this.globalVariables.showProfileMenu;
    this.freezeBackground(this.globalVariables.showProfileMenu);
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
    if (this.globalVariables.showContacts)
      document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }


  freezeBackground(freeze: boolean) {
    if (freeze)
      document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
  }

  //Diese CloseOverlay Funktionen sollten wir zu einer zusammenfassen und nur einen Parameter übergeben

  closeChannelOverlay() {
    this.globalVariables.showAddChannel = false;
    this.globalVariables.showContacts = false;
    this.globalVariables.adduser = false;
  }


  closeEditOverlay() {
    this.globalVariables.editChannelOverlayOpen = false;
    document.body.style.overflow = 'auto';
  }

  closeAddContactsOverlay() {
    this.globalVariables.showContacts = false;
    this.globalVariables.showAddChannel = false;
    this.globalVariables.adduser = false;
    document.body.style.overflow = 'auto';
  }

  /**
 * this function closes the showContacts popup by using appClickedOutside from ClickedOutsideDirective
 * but it closes the popup immediately if no additional check will happen >> is the popup open?
 */
  closeMembers() {
    if (this.globalVariables.memberlist && !this.globalVariables.isMembersPopupOpen) {
      this.globalVariables.isMembersPopupOpen = true;
    } else if (this.globalVariables.memberlist && this.globalVariables.isMembersPopupOpen) {
      this.globalVariables.memberlist = false;
      this.globalVariables.isMembersPopupOpen = false;
    }
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
    if (this.globalVariables.isUserChat)
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



  // function to get data from firebase and save it into an local Array

  async getCollection(item: string, targetArray: any) {
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


  showDashboardElement(screenWidth: number) {
    if (window.innerWidth < screenWidth && this.globalVariables.showThread) this.globalVariables.showChannelMenu = false;
    else if (window.innerWidth >= 800) this.globalVariables.showChannelMenu = true;
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
    const emojiRegex = /[\u{2639}\u{fe0f}\u{263a}\u{fe0f}\u{1f600}\u{1f601}\u{1f602}\u{1f603}\u{1f604}\u{1f605}\u{1f606}\u{1f607}\u{1f609}\u{1f60a}\u{1f60b}\u{1f60c}\u{1f60d}\u{1f60e}\u{1f60f}\u{1f610}\u{1f611}\u{1f612}\u{1f613}\u{1f614}\u{1f615}\u{1f616}\u{1f617}\u{1f618}\u{1f619}\u{1f61a}\u{1f61b}\u{1f61c}\u{1f61d}\u{1f61e}\u{1f61f}\u{1f621}\u{1f622}\u{1f623}\u{1f624}\u{1f625}\u{1f626}\u{1f627}\u{1f628}\u{1f629}\u{1f62a}\u{1f62b}\u{1f62c}\u{1f62d}\u{1f62e}\u{1f62e}\u{200d}\u{1f4a8}\u{1f62f}\u{1f630}\u{1f631}\u{1f632}\u{1f633}\u{1f634}\u{1f635}\u{1f636}\u{1f636}\u{200d}\u{1f32b}\u{fe0f}\u{1f637}\u{1f641}\u{1f642}\u{1f643}\u{1f644}\u{1f910}\u{1f911}\u{1f912}\u{1f913}\u{1f914}\u{1f915}\u{1f917}\u{1f920}\u{1f922}\u{1f923}\u{1f924}\u{1f925}\u{1f927}\u{1f928}\u{1f929}\u{1f92a}\u{1f92b}\u{1f92d}\u{1f92e}\u{1f92f}\u{1f970}\u{1f971}\u{1f972}\u{1f973}\u{1f974}\u{1f975}\u{1f976}\u{1f978}\u{1f979}\u{1f97a}\u{1f9d0}\u{1fae0}\u{1fae1}\u{1fae2}\u{1fae3}\u{1fae4}\u{1fae5}\u{1fae8}]/gu;
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

  //functions for loading the Channel
  /**
   * this funktion sets the flag to show the header for channels and take over information of the related channel object to global variables
   * @param channel - object which contains information of selecet channel
   */
  openChannel(channel: any) {
    this.globalVariables.scrolledToBottom = false;
    this.globalVariables.isUserChat = false;
    this.getChatUserData(channel.members);
    this.globalVariables.openChannel.desc = channel.description;
    this.globalVariables.openChannel.titel = channel.channelName;
    this.globalVariables.openChannel.id = channel.id;
    this.globalVariables.openChannel.chatId = channel.chatId;
    this.globalVariables.openChannel.creator = channel.creator;
    this.globalVariables.openChannel.memberCount = channel.members.length;
    this.firebaseChatService.activeChatId = channel.chatId;
    this.showChat();
  }


  /**
   * This function fills the channelUser Array with all relevant data
   * @param member - Array of member ids
   */
  async getChatUserData(member: string[]) {
    this.globalVariables.openChannelUser = [];
    this.globalVariables.notInOpenChannelUser = [];
    this.globalVariables.allUsers.forEach(user => {
      if (member.includes(user.id)) {
        this.globalVariables.openChannelUser.push(user);
      } else {
        this.globalVariables.notInOpenChannelUser.push(user);
      }
    });
  }


  //this function should load the welcome channel when user logged in
  async getStartChannel() {
    await this.firebaseChannelService.getChannelData('fsjWrBdDhpg1SvocXmxS')
      .then(channelData => {
        if (channelData) {
          channelData['id'] = 'fsjWrBdDhpg1SvocXmxS';
          this.openChannel(channelData);
          this.getChatUserData(channelData['members']);
        } else console.warn('Channel-Daten wurden nicht gefunden.');
      })
      .catch(error => console.error('Fehler beim Abrufen der Daten:', error));
  }
}
