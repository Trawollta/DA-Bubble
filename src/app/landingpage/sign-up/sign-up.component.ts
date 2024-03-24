import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from 'app/shared/button/button.component';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { AuthService } from 'app/services/firebase-services/auth.service';
import { FirebaseUserService } from 'app/services/firebase-services/firebase-user.service';
import { ToastService } from 'app/services/app-services/toast.service';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { GlobalFunctionsService } from 'app/services/app-services/global-functions.service';
import { GoBackButtonComponent } from 'app/shared/go-back-button/go-back-button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, InputfieldComponent, ButtonComponent, FormsModule, DialogComponent, GoBackButtonComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  authService = inject(AuthService);
  globalVariables = inject(GlobalVariablesService);
  globalFunctions = inject(GlobalFunctionsService);
  userService = inject(FirebaseUserService);
  toastService = inject(ToastService);
  private router = inject(Router);
  signUpStep: string = "createAccount"; //createAccount | chooseAvatar
  selectedAvatar: string = '';
  signUpUserPassword: string = "";

  constructor() {
    this.globalVariables.signup = true;
  }

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

  goChooseAvatar() {
    this.signUpStep = "chooseAvatar";
  }

  goCreateAccount() {
    this.signUpStep = "createAccount";
  }
  ngAfterViewInit() {
    window.dispatchEvent(new Event('resize'));
    Aos.init();
  }

  selectAvatar(img: string) {
    this.selectedAvatar = img;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result !== null) {
          if (e.target.result.toString().length > 1048487) {
            this.toastService.showMessage('Bild darf nicht größer als 1MB sein.');
          } else {
            this.selectedAvatar = e.target.result as string;
          }
        }
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit(event: any) {
    const email = this.signUpUserData.email;
    const password = this.signUpUserPassword;
    this.signUpUserData.img = this.selectedAvatar;
    try {
      const userCredential = await this.authService.register(email, password);
      console.log(userCredential);
      const uid = userCredential.user.uid;
      this.userService.addUser(uid, this.signUpUserData);
      this.toastService.showMessage('Konto erfolgreich erstellt!');
      setTimeout(() => this.router.navigate(['/']), 2000);
    } catch (error) {
      console.error("Registrierungsfehler:", error);
      this.toastService.showMessage('Email bereits registriert!');
    }
  }
}

