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
  activeChatId: string = this.globalVariablesService.openChannel.chatId;
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
    this.unsubChat = this.getChat(this.activeChatId, 'chatchannels');
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
  getchatChannelsRef(chatFamily: string) {
    return collection(this.firestore, chatFamily);
  }

  /**
   * this function returns the reference of the singe user with id... from collection testusers
   * @param docId - document which should read
   * @returns - returns a single document of collection 'user'
   */
  getSingleChatRef(docId: string, chatFamily: string) {
    return doc(this.getchatChannelsRef(chatFamily), docId);
  }

  /**
   * this function returns the user with id ... from collection testusers
   * @param id - id of active channel
   * @returns - array with data of active user
   */
  getChat(id: string, chatFamily: string) {
    let chatSnapshot = onSnapshot(this.getSingleChatRef(id, chatFamily), (chat) => {
      if (chat.data()) {
        this.globalVariablesService.chatChannel = new ChatChannel(chat.data());
        console.log('hier: ',this.globalVariablesService.chatChannel);
      }
      //this.groupMessagesByAnswerTo();
      //console.log('Grupierter chat: ',this.globalVariablesService.chatChannel);
    });
    return chatSnapshot;
  }

  /**
   * this function unsubscribes the closed chat and subscribes the new chat
   * @param newChannelId - new channel chat id
   */
  changeActiveChannel(newChatId: string) {
    //if (this.unsubChat) 
    this.unsubChat();
    this.activeChatId = newChatId;
    this.globalVariablesService.chatChannel = new ChatChannel();
    let chatFamiliy = this.globalVariablesService.isUserChat ? 'chatusers' : 'chatchannels';
    //console.log(newChatId);
    //console.log(chatFamiliy);

    //hier muss eine Funktion hinein, die checkt, ob der Chat existiert, wenn nein einen erstellt.
    //Channels benötigen diesen Check nicht, das bei Channels, der Chat direkt erzeugt wird
    //Für Userchats benötige ich diesen check
    //Brauche ich dann die If Bedingung für chat Familiy?

    this.unsubChat = this.getChat(newChatId, chatFamiliy);

  }

  /**
   * this function creates a new chat for the new channel and take over the belonging channel id
   * @param relatedChannelId - channel which is connected to the new chat
   * @returns - addDoc element
   */
  addChat(relatedChannelId: string, chatFamily: string) {
    this.chatChannel.relatedChannelId = relatedChannelId;
    let data = this.toJson(); //wenn ich Channel benutze funktioniert das, für User 
    //console.log('was steht im JSON: ',data);

    return addDoc(this.getchatChannelsRef(chatFamily), data);
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
  sendMessage(chatId: string, chatFamily: string) {
    //das hier erst einmal zum Test rein, ich brauche hier noch eine Abfrage, ob das erste Element überhaput leer ist
    // es entsteht als Platzhalter beim erstellen des Channels. 
    // Auch hier die Frage, wird dieser Platzhalter überhaupt gebraucht.
    // Die Frage kläre ich, sobald das Channelerstellen funktioniert
    updateDoc(doc(this.firestore, chatFamily, chatId), {
      messages: arrayRemove(this.removeEmptyData),
    });
    return updateDoc(doc(this.firestore, chatFamily, chatId), {
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
