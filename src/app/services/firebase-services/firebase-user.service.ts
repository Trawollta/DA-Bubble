import { Injectable, inject } from '@angular/core';
import { User } from 'app/models/user.class';
import { Firestore, collection, doc, setDoc, updateDoc, onSnapshot, getDoc, getDocs, query, where } from '@angular/fire/firestore';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';

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

  getSingleUserRef(docId: string) {
    return doc(this.getUsersRef(), docId);
  }

  async addUser(uid: string, userData: any) {
    await setDoc(doc(this.firestore, "users", uid), this.getCleanJson(userData));
  }

  searchUsersByName(searchTerm: string): Observable<any[]> {
    const q = query(this.getUsersRef(), where('name', '>=', searchTerm), where('name', '<=', searchTerm + '\uf8ff'));
    return from(getDocs(q).then(querySnapshot => {
      const users: any = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      return users;
    }));
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

  updateCurrentUser(uid: string) {
    return onSnapshot(this.getSingleUserRef(uid), (user) => {
      if (user.data()) {
        let logedInUser = new User(user.data());
        this.globalVariables.currentUser = logedInUser;
        this.globalVariables.activeID = user.id;
      }
    });
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

  /**
 * this function returns the data of the user. This is no obserable.
 * @param id -id of user
 * @returns data of user
 */
  async getUserData(id: string) {
    const docSnap = await getDoc(this.getSingleUserRef(id));
    return docSnap.data();
  }
}
