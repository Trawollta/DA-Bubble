import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut } from '@angular/fire/auth';
import { User } from 'app/models/user.class';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firestore: Firestore = inject(Firestore);
  constructor(private auth: Auth) { }

  async register(email: string, password: string) {
    return await createUserWithEmailAndPassword(this.auth, email, password);
  }

  async login(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout() {
    return await signOut(this.auth);
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;
      const userData = {
        uid: user.uid,
        name: user.displayName || '', // Standardwert '', falls displayName nicht vorhanden
        email: user.email || '', // Standardwert '', falls email nicht vorhanden
      };
      return userData; // Benutzerdaten zurückgeben
    } catch (error) {
      console.error("Fehler bei der Google-Anmeldung:", error);
      return null; // Im Fehlerfall null zurückgeben
    }
  }

  getUsersRef() {
    return collection(this.firestore, 'users');
  }

  getSingleDocRef(colId: string, docId: any) {
    return doc(collection(this.firestore, colId), docId);
  }
}

