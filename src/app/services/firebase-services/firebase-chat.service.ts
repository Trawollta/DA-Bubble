import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, doc, setDoc, onSnapshot } from '@angular/fire/firestore';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { ChatChannel } from '../../models/chatChannel.class';
import { ChatUsers } from '../../models/chatUsers.class';

@Injectable({
  providedIn: 'root'
})
export class FirebaseChatService {

  firestore: Firestore = inject(Firestore);
  globalVariablesService = inject(GlobalVariablesService);

  activeID: string = this.globalVariablesService.activeID;
  activeChannelId: string = 'NQMdt08FAcXbVroDLhvm'; //hier muss die ID des aktiven Channes übergeben werden
  chatChannel: ChatChannel = new ChatChannel;

  unsubChat;

  constructor() { 
    this.unsubChat = this.getChat(this.activeChannelId);
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
    getUserRef() {
      return collection(this.firestore, 'chatchannels');
    }

    /**
   * this function returns the reference of the singe user with id... from collection testusers 
   * @param docId - document which should read
   * @returns - returns a single document of collection 'user'
   */
  getSingleUserRef(docId: string) {
    return doc(this.getUserRef(), docId);
  }

  /**
   * this function returns the user with id ... from collection testusers
   * @param id - id of active channel 
   * @returns - array with data of active user
   */
  getChat(id: string) {

    return onSnapshot(this.getSingleUserRef(id), (chat) => {

      if (chat.data()) {
        this.globalVariablesService.chatChannel = new ChatChannel(chat.data());
      console.log('aktueller chat', this.globalVariablesService.chatChannel);
        /* let actualChat = new ChatChannel(chat.data());
        console.log('aktueller chat', actualChat);
         
        actualChat.messages.forEach(message => {
         this.chatChannel.messages.push(message); 
        }); 
        
        console.log(this.chatChannel);*/
      } 
    });
  }


}
