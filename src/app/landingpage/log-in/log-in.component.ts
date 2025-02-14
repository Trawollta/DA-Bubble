// src/app/landingpage/log-in/log-in.component.ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoginResponse } from 'app/services/auth.service';
import { ToastService } from 'app/services/app-services/toast.service';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import Aos from 'aos';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { ButtonComponent } from 'app/shared/button/button.component';
import { DialogComponent } from 'app/shared/dialog/dialog.component';

@Component({
  selector: 'app-log-in',
  standalone: true,
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],
  imports: [CommonModule, FormsModule, InputfieldComponent, ButtonComponent, DialogComponent]
})
export class LogInComponent {
  // Services und Variablen per Dependency Injection
  private authService = inject(AuthService);
  private router = inject(Router);
  toastService = inject(ToastService);
  globalVariables = inject(GlobalVariablesService);

  // Initialisierung der Login-Daten
  logInUserData = {
    email: '',
    password: ''
  };

  constructor() {
    // Beispiel: Setze globale Variablen, falls benötigt
    this.globalVariables.imprintActive = false;
    this.globalVariables.signup = false;
  }

  ngAfterViewInit() {
    window.dispatchEvent(new Event('resize'));
    Aos.init();
  }

  logInWithEmailAndPassword() {
    const { email, password } = this.logInUserData;
    this.authService.login(email, password).subscribe({
        next: (response: LoginResponse) => {
            console.log("✅ Login erfolgreich! Benutzer:", response.user);
            
            // Speichere die Benutzer-ID und den Token im LocalStorage
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userId', response.user.id.toString());

            // Setze die Benutzer-ID in den globalen Variablen
            this.globalVariables.activeID = response.user.id.toString();

            console.log("🔑 Benutzer-ID gesetzt:", this.globalVariables.activeID);

            // Navigiere zum Dashboard
            this.router.navigate(['/dashboard']);
        },
        error: (err) => {
            console.error('❌ Login fehlgeschlagen:', err);
            this.toastService.showMessage('Benutzername oder Passwort falsch');
        }
    });
}




  // Optional: Methoden für Google-Login oder Gäste-Login
  async loginWithGoogle() {
    // Hier kannst du den Flow für Google-Login implementieren,
    // sofern dein Backend diesen unterstützt.
  }

  async loginAsGuest() {
    try {
      // Setze Beispiel-Daten für den Gäste-Login
      this.logInUserData.email = 'gastderdabubble@da-bubble.gast';
      this.logInUserData.password = 'gast00';
      this.logInWithEmailAndPassword();
    } catch (error) {
      this.toastService.showMessage('Fehler bei der Verarbeitung der anonymen Anmeldung');
    }
  }

  goToSendMail() {
    this.router.navigate(['/request-new-password']);
  }
}
