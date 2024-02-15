import { Component } from '@angular/core';
import { ButtonComponent } from 'app/button/button.component';
import { InputfieldComponent } from 'app/inputfield/inputfield.component';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [InputfieldComponent, ButtonComponent],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {

  redirectDashboard() {
    window.location.href = '/dashboard';
  }
}
