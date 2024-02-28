import { Injectable, inject } from '@angular/core';
import { User } from 'app/models/user.class';
import { Firestore, collection, doc, setDoc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseUserService {
  firestore: Firestore = inject(Firestore);

  constructor() { }
  getUsersRef() {
    return collection(this.firestore, 'users');
  }

  getSingleDocRef(colId: string, docId: any) {
    return doc(collection(this.firestore, colId), docId);
  }

  async addUser(uid: string, userData: any) {
    await setDoc(doc(this.firestore, "users", uid), this.getCleanJson(userData));
  }

  getCleanJson(user: User): {} {
    return {
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      img: user.img
    };
  }

  async updateUserStatus(uid: string, isActive: boolean) {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    await updateDoc(userDocRef, { isActive });
  }
}
