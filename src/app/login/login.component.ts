import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DialogComponent } from 'app/dialog/dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [DialogComponent, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  redirectDashboard() {
    window.location.href = '/dashboard';
  }
}
