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
      .then(() => console.log('Daten erfolgreich aktualisiert'))
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
    return docIds
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

  updateChannelTitle(channelId: string, newTitle: string): void {
    // Aktualisiere den Kanal im Backend, zum Beispiel in Firebase oder einer anderen Datenbank
    this.updateChannel(channelId, { titel: newTitle }).then(() => {
      // Aktualisiere den lokalen Zustand direkt nach dem erfolgreichen Backend-Update
      if (
        this.globalVariables.openChannel &&
        this.globalVariables.openChannel.id === channelId
      ) {
        this.globalVariables.openChannel.titel = newTitle;
      }
    });
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
    await deleteDoc(channelDocRef)
    const chatChannelRef = doc(this.firestore, 'chatchannels', channelId)
    await deleteDoc (chatChannelRef);
    this.firebaseChatService.changeActiveChannel();
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
}
