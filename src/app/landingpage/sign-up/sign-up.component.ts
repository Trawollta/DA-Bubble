import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from 'app/shared/button/button.component';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { DialogComponent } from 'app/shared/dialog/dialog.component';
import { GoBackButtonComponent } from 'app/shared/go-back-button/go-back-button.component';
import { Router } from '@angular/router';
import { ToastService } from 'app/services/app-services/toast.service';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, InputfieldComponent, ButtonComponent, FormsModule, DialogComponent, GoBackButtonComponent],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  private router = inject(Router);
  toastService = inject(ToastService);
  authService = inject(AuthService);

  // Sign-up-Schritte: "createAccount" oder "chooseAvatar"
  signUpStep: string = "createAccount";
  selectedAvatar: string = '';
  signUpUserPassword: string = "";

  // Lokale Benutzerdaten
  signUpUserData = {
    name: "",
    email: "",
    isActive: false,
    img: "",
    relatedChats: [] as string[]
  };

  avatarImgs = [
    'assets/img/avatars/avatar_1.svg',
    'assets/img/avatars/avatar_2.svg',
    'assets/img/avatars/avatar_3.svg',
    'assets/img/avatars/avatar_4.svg',
    'assets/img/avatars/avatar_5.svg',
    'assets/img/avatars/avatar_6.svg'
  ];

  constructor() {}

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
          // Optional: Dateigrößenprüfung (1MB)
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

  onSubmit(event: any) {
    const formData = new FormData();
    formData.append('name', this.signUpUserData.name);
    formData.append('email', this.signUpUserData.email);
    formData.append('password', this.signUpUserPassword);
    formData.append('related_chats', JSON.stringify(this.signUpUserData.relatedChats));
    
    // Hänge das img-Feld nur an, wenn eine Datei ausgewählt wurde
    if (this.fileInput && this.fileInput.nativeElement.files[0]) {
      formData.append('img', this.fileInput.nativeElement.files[0]);
    }
    
    this.authService.register(formData).subscribe({
      next: (response) => {
        this.toastService.showMessage('Konto erfolgreich erstellt!');
        setTimeout(() => this.router.navigate(['/']), 2000);
      },
      error: (error) => {
        this.toastService.showMessage('Registrierung fehlgeschlagen!');
        console.error("Registrierungsfehler:", error);
      }
    });
  }
}
