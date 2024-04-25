import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  setDoc,
  onSnapshot,
  getDoc,
  arrayUnion,
  where,
  query,
  getDocs,
  deleteDoc,
} from '@angular/fire/firestore';
import { GlobalVariablesService } from '../app-services/global-variables.service';
import { FirebaseChatService } from './firebase-chat.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseChannelService {
  firestore: Firestore = inject(Firestore);
  globalVariables = inject(GlobalVariablesService);
  firebaseChatService = inject(FirebaseChatService);

  constructor() {}

  addData(goalCollection: string, input: any) {
    let data = input;
    let dataCollection = collection(this.firestore, goalCollection);
    return addDoc(dataCollection, data);
  }

  async updateChannel(channelId: string, item: any) {
    const docRef = doc(this.firestore, 'channels', channelId);
    return updateDoc(docRef, item)
      .then(() => {const success = true})//console.log('Daten erfolgreich aktualisiert'))
      .catch((error) =>
        console.error('Fehler beim Aktualisieren der Daten', error)
      );
  }

  updateChannelName(channelId: string, newName: string) {
    return this.updateChannel(channelId, { name: newName });
  }

  updateChannelDescription(channelId: string, newDescription: string) {
    return this.updateChannel(channelId, { description: newDescription });
  }

  async loadChannelData(docId: string) {
    const docRef = doc(this.firestore, 'channels', docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  }

  async loadChannelDataWithChatID(chatId: string) {
    let docIds = await this.getDocId(chatId);
    return docIds;
  }

  async getChannelMessages(channelChatId: string) {
    const docRef = doc(this.firestore, 'chatchannels', channelChatId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  }

  async listenToChannelData(channelId: string) {
    const docRef = doc(this.firestore, 'channels', channelId);
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
      } else {
        console.log('Kein Dokument gefunden!');
      }
    });
  }

  /**
   * this funktion updates the element
   * @param data -Json
   */
  async updateDataChannel(data: { [x: string]: any }, docId: string) {
    await updateDoc(doc(this.firestore, 'channels', docId), data);
  }

  /**
   *
   * @param channelId mostlikly docRefId to channel
   * @param userId docRefId to User
   */
  async addUserToChannel(channelId: string, userId: string): Promise<void> {
    const channelRef = doc(this.firestore, 'channels', channelId);
    try {
      await updateDoc(channelRef, {
        members: arrayUnion(userId),
      });
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Benutzers zum Kanal:', error);
    }
  }

  /**
   * delete Channel and the Id from the choosen Person inside
   * @param channelId
   */
  async deleteChanel(channelId: string) {
    const docId = await this.getDocId(channelId);
    await this.deleteChannelIdFromUsers(channelId);
    const channelDocRef = doc(this.firestore, 'channels', docId[0]);
    await deleteDoc(channelDocRef);
    const chatChannelRef = doc(this.firestore, 'chatchannels', channelId);
    await deleteDoc(chatChannelRef);
  }

  /**
   * Helper to convert ID into DocRef
   * @param chatId
   * @returns docRef
   */
  async getDocId(chatId: string): Promise<string[]> {
    const usersCollectionRef = collection(this.firestore, 'channels');
    const q = query(usersCollectionRef, where('chatId', '==', chatId));
    const querySnapshot = await getDocs(q);
    const docIds: string[] = [];
    querySnapshot.forEach((doc) => {
      docIds.push(doc.id);
    });
    return docIds;
  }

  async deleteChannelIdFromUsers(chatId: string) {
    let usersCollectionRef = collection(this.firestore, 'users');
    const querySnapshot = await getDocs(usersCollectionRef);
    querySnapshot.forEach(async (userDoc) => {
      const userData = userDoc.data();
      if (
        userData &&
        userData['relatedChats'] &&
        userData['relatedChats'].includes(chatId)
      ) {
        const updatedRelatedChats = userData['relatedChats'].filter(
          (id: any) => id !== chatId
        );
        const userDocRef = doc(this.firestore, 'users', userDoc.id);
        await updateDoc(userDocRef, { relatedChats: updatedRelatedChats });
      }
    });
  }

  getConnectionOfChannel(docId: string) {
    const docRef = doc(this.firestore, 'chatchannels', docId);
    return getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return null;
      }
    });
  }

  async getChannelData(id: string) {
    const docSnap = await getDoc(this.getSingleChannelRef(id));
    return docSnap.data();
  }

  getSingleChannelRef(docId: string) {
    return doc(this.getChannelRef(), docId);
  }

  getChannelRef() {
    return collection(this.firestore, 'channels');
  }

  // get all allowed channels for activ user
  async getChannelsWhereUserIsMember() {
    const querySnapshot = await getDocs(this.getChannelRef());
    this.globalVariables.viewableChannel = [];
    this.globalVariables.viewableChannelplusId = [];
    querySnapshot.forEach((doc) => {
      this.addRelevantChanneldata(doc);

    });
  }

  addRelevantChanneldata(doc:any){
    const channelData = doc.data();
    if (Array.isArray(channelData['members'])) {
      const isMember = channelData['members'].includes(this.globalVariables.activeID);
      if (isMember) {
        const channelName = channelData['channelName'];
        const channelId = doc.id;
        const chatId = channelData['chatId'];
        this.globalVariables.viewableChannel.push(channelName);
        this.globalVariables.viewableChannelplusId.push({
          channelName: channelName,
          chatId: chatId,
          channelId: channelId
          })
      }
    }
  }

}
