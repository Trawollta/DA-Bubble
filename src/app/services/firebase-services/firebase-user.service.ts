import { Injectable, inject } from '@angular/core';
import { User } from 'app/models/user.class';
import {
  Firestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  getDoc,
  getDocs,
  query,
  where,
  arrayUnion,
  arrayRemove,
} from '@angular/fire/firestore';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseUserService {
  firestore: Firestore = inject(Firestore);
  globalVariables = inject(GlobalVariablesService);
  private authService = inject(AuthService);
  private auth = inject(Auth);
  private router = inject(Router);

  unsubUpdateCurrentUser!: () => void;

  constructor() { }

  ngOnDestroy() {
    if (this.unsubUpdateCurrentUser) {
      this.unsubUpdateCurrentUser();
    }
  }

  getUsersRef() {
    return collection(this.firestore, 'users');
  }

  getSingleDocRef(colId: string, docId: any) {
    return doc(collection(this.firestore, colId), docId);
  }

  getSingleUserRef(docId: string) {
    return doc(this.getUsersRef(), docId);
  }

  async addUser(uid: string, userData: any) {
    await setDoc(
      doc(this.firestore, 'users', uid),
      this.getCleanJson(userData)
    );
  }

  async userExists(uid: string): Promise<boolean> {
    const userDoc = await getDoc(doc(this.firestore, 'users', uid));
    return userDoc.exists();
  }

  searchUsersByName(searchTerm: string): Observable<any[]> {
    const q = query(
      this.getUsersRef(),
      where('name', '>=', searchTerm),
      where('name', '<=', searchTerm + '\uf8ff')
    );
    return from(
      getDocs(q).then((querySnapshot) => {
        const users: any = [];
        querySnapshot.forEach((doc) => {
          users.push(doc.data());
        });
        return users;
      })
    );
  }

  getCleanJson(user: User): {} {
    return {
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      img: user.img,
    };
  }

  async updateUserStatus(uid: string, isActive: boolean) {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    if(!this.globalVariables.logout)
    await updateDoc(userDocRef, { isActive });
  }

  updateCurrentUser(uid: string) {
    this.unsubUpdateCurrentUser = onSnapshot(this.getSingleUserRef(uid), (user) => {
      if (user.data()) {
        let logedInUser = new User(user.data());
        this.globalVariables.currentUser = logedInUser;
        this.globalVariables.activeID = user.id;
        this.updateUserStatus(this.globalVariables.activeID, true);
      }
    });
  }

  async logout() {
    try {
      if (this.unsubUpdateCurrentUser) {
        this.unsubUpdateCurrentUser();
        this.updateUserStatus(this.globalVariables.activeID, false);
      }
      this.globalVariables.logout = true;
      await this.authService.logout();
      this.globalVariables.activeID = '';
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      this.globalVariables.login = true;
      this.router.navigate(['/']);
    }
  }

  /**
   * this function returns the data of the user. This is no obserable.
   * @param id -id of user
   * @returns data of user
   */
  async getUserData(id: string) {
    const docSnap = await getDoc(this.getSingleUserRef(id));
    return docSnap.data();
  }

  /**
   * get docId with searching the name in Users to find Doc ID
   */

  async getUserDocIdWithName(name: string): Promise<string[]> {
    const usersCollectionRef = collection(this.firestore, 'users');
    const q = query(usersCollectionRef, where('name', '==', name));
    const querySnapshot = await getDocs(q);
    const docIds: string[] = [];
    querySnapshot.forEach((doc) => {
      docIds.push(doc.id);
    });
    return docIds;
  }

  /**
   * Adds the chatId to the user.
   * @param docId - id of user
   * @param chatId id of chat (globale variable)
   */
  async addChatIdToUser(docId: string, chatId: string) {
    const userDocRef = doc(this.firestore, 'users', docId);
    const userDocSnapshot = await getDoc(userDocRef);
    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      if (userData['relatedChats'] && Array.isArray(userData['relatedChats'])) {
        console.log('hier1');
        await updateDoc(userDocRef, { relatedChats: arrayUnion(chatId) });
      } else {
        console.log('hier2');
        await updateDoc(userDocRef, { relatedChats: [chatId] });
      }
    } else {
      console.error('Benutzer mit der angegebenen UID wurde nicht gefunden.');
    }
  }

  leaveChannel(channelId: string, userId: string) {
    let userDocRef = doc(this.firestore, 'users', userId);
    getDoc(userDocRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          const updatedRelatedChats = userData['relatedChats'].filter(
            (chatId: string) => chatId !== channelId
          );
          console.log('hier3');
          updateDoc(userDocRef, { relatedChats: updatedRelatedChats });
        } else {
          console.log('Benutzerdokument nicht gefunden');
        }
      })
      .catch((error) => {
        console.error('Fehler beim Abrufen des Benutzerdokuments:', error);
      });
  }

  async leaveChannelUser(channelId: string, userId: string) {
    let docId = await this.getChannelDocIdWithChatId(channelId)
    let channelDocRef = doc(this.firestore, 'channels', docId[0]);
    getDoc(channelDocRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          let channelData = docSnapshot.data();
          const updatedRelatedChats = channelData['members'].filter(
            (chatId: string) => chatId !== userId
          );
          updateDoc(channelDocRef, { members: updatedRelatedChats });
        } else {
          console.log('Benutzerdokument nicht gefunden');
        }
      })
      .catch((error) => {
        console.error('Fehler beim Abrufen des Benutzerdokuments:', error);
      });
  }

  async getChannelDocIdWithChatId(id: string): Promise<string[]> {
    const usersCollectionRef = collection(this.firestore, 'channels');
    const q = query(usersCollectionRef, where('chatId', '==', id));
    const querySnapshot = await getDocs(q);
    const docIds: string[] = [];
    querySnapshot.forEach((doc) => {
      docIds.push(doc.id);
    });
    return docIds;
  }
}
