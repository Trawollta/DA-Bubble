import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from 'app/services/app-services/toast.service';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { AuthService } from 'app/services/firebase-services/auth.service';
import { ButtonComponent } from 'app/shared/button/button.component';
import { DialogComponent } from 'app/shared/dialog/dialog.component';
import { GoBackButtonComponent } from 'app/shared/go-back-button/go-back-button.component';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, InputfieldComponent, DialogComponent, GoBackButtonComponent],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss'
})

export class PasswordResetComponent {
  private authService = inject(AuthService);
  toastService = inject(ToastService);
  private router = inject(Router);
  resetMail: string = '';

  ngAfterViewInit() {
    window.dispatchEvent(new Event('resize'));
    Aos.init();
  }

  async onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    try {
      await this.authService.sendPasswordResetEmail(this.resetMail);
      this.toastService.showMessage('E-Mail gesendet');
      setTimeout(() => this.router.navigate(['/']), 2000);
    } catch (error) {
      this.toastService.showMessage('Fehler beim versenden der E-Mail');
    }
  }
}
