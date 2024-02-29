import { Injectable, inject } from '@angular/core';
import { User } from 'app/models/user.class';
import { Firestore, collection, doc, setDoc, updateDoc } from '@angular/fire/firestore';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseUserService {
  firestore: Firestore = inject(Firestore);
  globalVariables = inject(GlobalVariablesService);
  private authService = inject(AuthService);
  private auth = inject(Auth);
  private router = inject(Router);
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

  updateCurrentUser(userCredential: any) {
    this.globalVariables.currentUser.name = userCredential.displayName;
    this.globalVariables.currentUser.email = userCredential.email;
    this.globalVariables.currentUser.isActive = true;
    this.globalVariables.currentUser.img = userCredential.photoURL;
  }

  async logout() {
    try {
      await this.updateUserStatus(this.auth.currentUser!.uid, false);
      await this.authService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      this.globalVariables.login = true;
      this.router.navigate(['/']);
    }
  }
}
