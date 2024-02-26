import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonComponent } from 'app/button/button.component';
import { InputfieldComponent } from 'app/inputfield/inputfield.component';
import { DialogComponent } from '../dialog.component';
import { GlobalVariablesService } from 'app/services/global-variables.service';
import { AuthService } from 'app/firebase-services/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, InputfieldComponent, ButtonComponent, FormsModule, DialogComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  authService = inject(AuthService);
  globalVariables = inject(GlobalVariablesService);
  signUpStep: string = "chooseAvatar";
  selectedAvatar: string | undefined;

  signUpUserData = {
    name: "",
    email: "",
    password: "",
    img: ""
  }

  avatarImgs = [
    'assets/img/avatars/avatar_1.svg',
    'assets/img/avatars/avatar_2.svg',
    'assets/img/avatars/avatar_3.svg',
    'assets/img/avatars/avatar_4.svg',
    'assets/img/avatars/avatar_5.svg',
    'assets/img/avatars/avatar_6.svg'
  ]

  triggerFileInput() {
    this.fileInput!.nativeElement.click();
  }

  goBack() {
    this.globalVariables.signup = false;
  }

  goChooseAvatar() {
    this.signUpStep = "chooseAvatar";
    console.log(this.signUpUserData);
  }
  ngAfterViewInit() {
    window.dispatchEvent(new Event('resize'));
  }

  selectAvatar(img: string) {
    this.selectedAvatar = img;
  }

  async onSubmit() {
    const { email, password } = this.signUpUserData;
    try {
      const userCredential = await this.authService.register(email, password);
      // Weitere Schritte nach erfolgreicher Registrierung, z.B. Benutzerdaten speichern
      console.log(userCredential);
      // Optional: Avatar Bild hochladen und Benutzerprofil aktualisieren
    } catch (error) {
      console.error("Registrierungsfehler:", error);
      // Fehlerbehandlung, z.B. Benachrichtigung anzeigen
    }
  }
}
