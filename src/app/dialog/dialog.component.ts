import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonComponent } from 'app/button/button.component';
import { InputfieldComponent } from 'app/inputfield/inputfield.component';
import { GlobalVariablesService } from 'app/services/global-variables.service';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, InputfieldComponent, ButtonComponent, FormsModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {

  globalVariables = inject(GlobalVariablesService);
  constructor() {
    this.globalVariables.login = true;
  }
  redirectDashboard() {
    this.globalVariables.login = false;
    window.location.href = '/dashboard';
  }
}
