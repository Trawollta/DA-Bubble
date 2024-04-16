import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  collectionData,
  getDoc,
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
  globalVariables = inject(GlobalVariablesService);

  activeID: string = this.globalVariables.activeID;
  activeChatId: string = this.globalVariables.openChannel.chatId;
  chatChannel: ChatChannel = new ChatChannel();
  user: User = new User();
  chatExist: boolean = false;
  userChatIdSwitch = false;


  removeEmptyData = {
    message: '',
    answerto: '',
    userId: '',
    timestamp: 0,
    emoji: [{ icon: '', userId: '' }],
  };

  unsubChat;

  constructor() {
    this.unsubChat = this.getChat('chatchannels');
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
   * @param chatFamily - string - userChat or channelChat
   * @returns - returns a single document of collection 'user'
   */
  getSingleChatRef(chatFamily: string) {
    return doc(this.getchatChannelsRef(chatFamily), this.activeChatId);
  }

  /**
   * this function returns the user with id ... from collection testusers
   * @param chatFamily - string - userChat or channelChat
   * @returns - array with the chat
   */
  getChat(chatFamily: string) {
    return onSnapshot(this.getSingleChatRef(chatFamily), (chat) => {
      if (chat.exists()) {
        this.globalVariables.chatChannel = new ChatChannel(chat.data());
      }
    });
  }


/**
 * this function checks if a usercaht exists and create one if no.
 * @param chatFamily - string - userChat or channelChat
 * @returns -boolean- true if chat exist
 */
  async existUserChat(chatFamily: string) { 
    let chatExist = await getDoc(this.getSingleChatRef(chatFamily));
    if (!chatExist.exists()) {
      this.activeChatId = this.bulidUserChatId(false);
      chatExist = await getDoc(this.getSingleChatRef(chatFamily));
      if (!chatExist.exists()) {
        this.activeChatId = this.bulidUserChatId(true);
        let data = this.toJson();
        await setDoc(doc(this.getchatChannelsRef(chatFamily), this.activeChatId), data);
      }
    }
    return true;
  }

  /**
   * this function returns the snapshot if chat exist
   * @param chatFamily - string - userChat or channelChat
   * @returns snapshot of chat
   */
  getchatSnapshot(chatFamily: string) {
    return onSnapshot(this.getSingleChatRef(chatFamily), (chat) => {
      if (chat.exists()) {
        this.globalVariables.chatChannel = new ChatChannel(chat.data());
      }
    });
  }

  /**
   * this function switches the user for the userChatId
   * @param user1_user2 - boolean 
   * @returns key for userIdChat
   */
  bulidUserChatId(user1_user2: boolean) {
    return user1_user2 ?
      (this.globalVariables.activeID + '_' + this.globalVariables.userToChatWith.id) :
      (this.globalVariables.userToChatWith.id + '_' + this.globalVariables.activeID);
  }


  /**
   * this function unsubscribes the closed chat and subscribes the new chat
   * @param newChannelId - new channel chat id
   */
  changeActiveChannel() {
    if (this.unsubChat) this.unsubChat();
    this.chatExist = false;
    this.globalVariables.chatChannel = new ChatChannel();
    let chatFamiliy = this.globalVariables.isUserChat ? 'chatusers' : 'chatchannels';
    this.unsubChat = this.getChat(chatFamiliy);
  }



  /**
   * this function creates a new chat for the new channel and take over the belonging channel id
   * @param relatedChannelId - channel which is connected to the new chat
   * @returns - addDoc element
   */
  addChat(relatedChannelId: string, chatFamily: string) {
    this.chatChannel.relatedChannelId = relatedChannelId;
    let data = this.toJson();  
    return addDoc(this.getchatChannelsRef(chatFamily), data);
  }

  toJson(): {} {
    return {
      messages: [],
      relatedChannelId: this.chatChannel.relatedChannelId,
    };
  }


  //ich denke diese Funktion ist überflüssig
  /**
   * returns chat grouped by answerto
   * @returns chat grouped by answerto
   */
  groupMessagesByAnswerTo() {
    const groupedMessages: { [answerto: string]: any[] } = {};
    this.globalVariables.chatChannel.messages.forEach((message) => {
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
  sendMessage(id: string, chatFamily: string) {
    //~~~~~Diese beiden folgenden Zeilen muss ich irgendwann wegnehmen. 
    //~~~~~Die chatId kommt dann über this.activeChatId
    //~~~~~Dazu muss ich aber in allen Dateien aufräumen, die diese Funktion nutzen 
    let chatId = id;
    if(this.globalVariables.isUserChat) chatId =this.activeChatId;
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
    return {
      message: this.globalVariables.messageData.message,
      userId: this.globalVariables.messageData.userId,
      answerto: this.globalVariables.messageData.answerto,
      timestamp: this.globalVariables.messageData.timestamp,
      emoji: this.globalVariables.messageData.emoji,
    };
  }

  newEmojiToJson(): {} {
    return {
      emoji: this.globalVariables.messageData.emoji,
    };
  }
}
