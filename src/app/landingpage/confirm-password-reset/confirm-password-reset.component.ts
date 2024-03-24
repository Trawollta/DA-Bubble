import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonComponent } from 'app/shared/button/button.component';
import { DialogComponent } from 'app/shared/dialog/dialog.component';
import { GoBackButtonComponent } from 'app/shared/go-back-button/go-back-button.component';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';
import { Router } from '@angular/router';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { ToastService } from 'app/services/app-services/toast.service';
import { Auth, confirmPasswordReset } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirm-password-reset',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, InputfieldComponent, DialogComponent, GoBackButtonComponent],
  templateUrl: './confirm-password-reset.component.html',
  styleUrl: './confirm-password-reset.component.scss'
})
export class ConfirmPasswordResetComponent {
  toastService = inject(ToastService);
  private router = inject(Router);
  private oobCode: string;
  private auth = inject(Auth);
  private route = inject(ActivatedRoute);
  pwd1: string = "";
  pwd2: string = "";


  constructor() {
    this.oobCode = this.route.snapshot.queryParams['oobCode'];
  }
  ngAfterViewInit() {
    window.dispatchEvent(new Event('resize'));
    Aos.init();
  }

  async resetPassword(form: NgForm) {
    if (!form.valid) {
      return;
    }
    try {
      const result = await confirmPasswordReset(this.auth, this.oobCode, form.value.password2);
      this.toastService.showMessage('Passwort erfolgreich geändert');
      setTimeout(() => this.router.navigate(['/']), 2000);
      console.log('Passwort wurde erfolgreich zurückgesetzt.');
    } catch (error) {
      this.toastService.showMessage('Fehler beim zurücksetzen des Passworts');
      console.error('Fehler beim Zurücksetzen des Passworts:', error);
    }
  }

}
