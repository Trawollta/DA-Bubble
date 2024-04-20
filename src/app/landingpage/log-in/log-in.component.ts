import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { DialogComponent } from "../../shared/dialog/dialog.component";
import { ButtonComponent } from 'app/shared/button/button.component';
import { AuthService } from 'app/services/firebase-services/auth.service';
import { FirebaseUserService } from 'app/services/firebase-services/firebase-user.service';
import { Router } from '@angular/router';
import { ToastService } from 'app/services/app-services/toast.service';
import Aos from 'aos';

@Component({
  selector: 'app-log-in',
  standalone: true,
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss',
  imports: [CommonModule, InputfieldComponent, ButtonComponent, FormsModule, DialogComponent]
})

export class LogInComponent {
  toastService = inject(ToastService);
  globalVariables = inject(GlobalVariablesService);
  private userService = inject(FirebaseUserService);
  private authService = inject(AuthService);
  private router = inject(Router);
  constructor() {
    this.globalVariables.imprintActive = false;
    this.globalVariables.signup = false;
  }

  logInUserData = {
    email: "",
    password: ""
  }

  ngAfterViewInit() {
    window.dispatchEvent(new Event('resize'));
    Aos.init();
  }

  async logInWithEmailAndPassword() {
    const { email, password } = this.logInUserData;
    try {
      const userCredential = await this.authService.login(email, password);
      const uid = userCredential.user.uid;
      this.globalVariables.activeID = uid;
      this.userService.updateCurrentUser(uid);
      this.globalVariables.logout = false;
      this.router.navigate(['/dashboard']);
    } catch (error) {
      this.toastService.showMessage('Benutzername oder Passwort falsch');
    }
  }

  async loginWithGoogle() {
    try {
      const userCredential = await this.authService.loginWithGoogle();
      if (userCredential) {
        const uid = userCredential.uid;
        this.globalVariables.activeID = uid;
        this.userService.updateCurrentUser(uid);
        this.globalVariables.logout = false;
        const userExists = await this.userService.userExists(uid);
        if (!userExists) {
          await this.userService.addUser(userCredential.uid, {
            name: userCredential.displayName,
            email: userCredential.email,
            isActive: true,
            img: userCredential.photoURL,
            relatedChats: ['NQMdt08FAcXbVroDLhvm'],
          });
        }
        this.router.navigate(['/dashboard']);
      } else {
        this.toastService.showMessage('Fehler beim anmelden mit Goggle');
      }
    } catch (error) {
      this.toastService.showMessage('Fehler bei der Verarbeitung der Google-Anmeldung');
    }
  }

  async loginAsGuest() {
    try {
      this.logInUserData.email = "gastderdabubble@da-bubble.gast";
      this.logInUserData.password = "gast00";
      this.logInWithEmailAndPassword();
    } catch (error) {
      this.toastService.showMessage('Fehler bei der Verarbeitung der anonymen Anmeldung');
    }
  }

  goToSendMail() {
    this.router.navigate(['/request-new-password']);
  }
}
