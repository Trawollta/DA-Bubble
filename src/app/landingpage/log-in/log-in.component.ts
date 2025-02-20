import { Component, inject, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoginResponse } from 'app/services/auth.service';
import { ToastService } from 'app/services/app-services/toast.service';
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
export class LogInComponent implements OnDestroy, AfterViewInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  toastService = inject(ToastService);

  logInUserData = {
    email: '',
    password: ''
  };

  constructor() {
    window.addEventListener('resize', this.onResize);
  }

  ngAfterViewInit() {
    window.dispatchEvent(new Event('resize'));
    Aos.init();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize);
  }

  logInWithEmailAndPassword() {
    const { email, password } = this.logInUserData;
    this.authService.login(email, password).subscribe({
      next: (response: LoginResponse) => {
        console.log("✅ Login erfolgreich! Benutzer:", response.user);
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.user.id.toString());
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('❌ Login fehlgeschlagen:', err);
        this.toastService.showMessage('Benutzername oder Passwort falsch');
      }
    });
  }

  loginAsGuest() {
    // Gäste-Login über den dedizierten Endpunkt
    this.authService.guestLogin().subscribe({
      next: (response: LoginResponse) => {
        console.log("✅ Gäste-Login erfolgreich:", response.user);
        localStorage.setItem("token", response.token);
        localStorage.setItem("userId", response.user.id.toString());
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('❌ Gäste-Login fehlgeschlagen:', err);
        this.toastService.showMessage('Fehler beim Gäste-Login');
      }
    });
  }
  
  goToSendMail() {
    this.router.navigate(['/request-new-password']);
  }

  private onResize = () => {
    console.log("📏 Fenstergröße geändert:", window.innerWidth);
  };
}
