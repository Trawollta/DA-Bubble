import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonComponent } from 'app/button/button.component';
import { InputfieldComponent } from 'app/inputfield/inputfield.component';
import { DialogComponent } from '../dialog.component';
import { GlobalVariablesService } from 'app/services/global-variables.service';
import { AuthService } from 'app/firebase-services/auth.service';
import { FirebaseUserService } from 'app/firebase-services/firebase-user.service';

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
  userService = inject(FirebaseUserService);
  signUpStep: string = "createAccount"; //createAccount | chooseAvatar
  selectedAvatar: string | undefined;
  signUpUserPassword: string = "";

  signUpUserData = {
    name: "",
    email: "",
    isActive: false,
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

  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.signUpUserData.img = e.target.result; // Speichert die Daten-URL im signUpUserData-Objekt
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit() {
    const email = this.signUpUserData.email;
    const password = this.signUpUserPassword;
    try {
      const userCredential = await this.authService.register(email, password);
      console.log(userCredential);
      const uid = userCredential.user.uid;
      this.userService.addUser(uid, this.signUpUserData);
    } catch (error) {
      console.error("Registrierungsfehler:", error);
      // Fehlerbehandlung, z.B. Benachrichtigung anzeigen
    }
  }
}

