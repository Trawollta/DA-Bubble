import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  collectionData,
  setDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove
} from '@angular/fire/firestore';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { ChatChannel } from '../../models/chatChannel.class';
import { ChatUsers } from '../../models/chatUsers.class';
import { User } from 'app/models/user.class';
@Injectable({
  providedIn: 'root',
})
export class FirebaseChatService {
  firestore: Firestore = inject(Firestore);
  globalVariablesService = inject(GlobalVariablesService);

  activeID: string = this.globalVariablesService.activeID;
  activeChannelChatId: string = this.globalVariablesService.openChannel.chatId;
  chatChannel: ChatChannel = new ChatChannel();
  user: User = new User();

  removeEmptyData = {
    message: '',
    answerto: '',
    userId: '',
    timestamp: 0,
    emoji: [{ icon: '', userId: '' }],
  }; 

  unsubChat;

  constructor() {
    this.unsubChat = this.getChat(this.activeChannelChatId);
  }

  /**
   * this function unsubscribes each function within
   */
  ngOnDestroy() {
    this.unsubChat();
  }

  /**
   * this function returns a reference of collection testusers
   * @returns reference to collection 'chatchannels'
   */
  getchatChannelsRef() {
    return collection(this.firestore, 'chatchannels');
  }

  /**
   * this function returns the reference of the singe user with id... from collection testusers
   * @param docId - document which should read
   * @returns - returns a single document of collection 'user'
   */
  getSingleChatRef(docId: string) {
    return doc(this.getchatChannelsRef(), docId);
  }

  /**
   * this function returns the user with id ... from collection testusers
   * @param id - id of active channel
   * @returns - array with data of active user
   */
  getChat(id: string) {
    let chatSnapshot = onSnapshot(this.getSingleChatRef(id), (chat) => {
      if (chat.data()) {
        this.globalVariablesService.chatChannel = new ChatChannel(chat.data());
      }
      this.groupMessagesByAnswerTo();
      //console.log(this.groupMessagesByAnswerTo());
    });
    return chatSnapshot;
  }

  /**
   * this function unsubscribes the closed chat and subscribes the new chat
   * @param newChannelId - new channel chat id
   */
  changeActiveChannel(newChannelChatId: string) {
    if (this.unsubChat) this.unsubChat();
    this.activeChannelChatId = newChannelChatId;
    this.globalVariablesService.chatChannel = new ChatChannel();
    this.unsubChat = this.getChat(this.activeChannelChatId);
  }

  /**
   * this function creates a new chat for the new channel and take over the belonging channel id
   * @param relatedChannelId - channel which is connected to the new chat
   * @returns - addDoc element
   */
  addChat(relatedChannelId: string) {
    this.chatChannel.relatedChannelId = relatedChannelId;
    let data = this.toJson();
    //console.log('was steht im JSON: ',data);
    return addDoc(this.getchatChannelsRef(), data);
  }

  toJson(): {} {
    return {
      messages: this.chatChannel.messages,
      relatedChannelId: this.chatChannel.relatedChannelId,
    };
  }

  /**
   * returns chat grouped by answerto
   * @returns chat grouped by answerto
   */
  groupMessagesByAnswerTo() {
    const groupedMessages: { [answerto: string]: any[] } = {};
    this.globalVariablesService.chatChannel.messages.forEach((message) => {
      const answerTo = message.answerto;
      if (!groupedMessages[answerTo]) {
        groupedMessages[answerTo] = [message];
      } else {
        groupedMessages[answerTo].push(message);
      }
    });
    return groupedMessages;
  }

  /**
   * this function adds the new massage to the existing message array
   * @param chatId - id of chat
   * @returns -
   */
  sendMessage(chatId: string) {
    //das hier erst einmal zum Test rein, ich brauche hier noch eine Abfrage, ob das erste Element überhaput leer ist
    // es entsteht als Platzhalter beim erstellen des Channels. 
    // Auch hier die Frage, wird dieser Platzhalter überhaupt gebraucht.
    // Die Frage kläre ich, sobald das Channelerstellen funktioniert
    updateDoc(doc(this.firestore, 'chatchannels', chatId), {
      messages: arrayRemove(this.removeEmptyData),
    });
    return updateDoc(doc(this.firestore, 'chatchannels', chatId), {
      messages: arrayUnion(this.newMessageToJson()),
    });
  }

  /**
   * this function returns the json for storing them in firebase
   * @returns - JSON with data
   */
  newMessageToJson(): {} {
    console.log('was wird gesendet? ', this.globalVariablesService.messageData);
    return {
      message: this.globalVariablesService.messageData.message,
      userId: this.globalVariablesService.messageData.userId,
      answerto: this.globalVariablesService.messageData.answerto,
      timestamp: this.globalVariablesService.messageData.timestamp,
      emoji: this.globalVariablesService.messageData.emoji,
    };
  }

  newEmojiToJson(): {} {
    return {
      emoji: this.globalVariablesService.messageData.emoji,
    };
  }
}
