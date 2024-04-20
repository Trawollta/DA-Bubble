import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, sendPasswordResetEmail } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { ToastService } from '../app-services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firestore: Firestore = inject(Firestore);
  toastService = inject(ToastService);
  private auth = inject(Auth);

  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      this.toastService.showMessage('E-Mail gesendet');
    } catch (error) {
      this.toastService.showMessage('Fehler beim Senden der Passwort-Zurücksetzungs-E-Mail');
      throw error;
    }
  }

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
      const userCredential = await signInWithPopup(this.auth, provider);
      return userCredential.user;
    } catch (error) {
      console.error("Fehler bei der Google-Anmeldung:", error);
      return null;
    }
  }
}

