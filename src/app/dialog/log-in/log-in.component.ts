import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { InputfieldComponent } from 'app/inputfield/inputfield.component';
import { GlobalVariablesService } from 'app/services/global-variables.service';
import { DialogComponent } from "../dialog.component";
import { ButtonComponent } from 'app/button/button.component';

@Component({
  selector: 'app-log-in',
  standalone: true,
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss',
  imports: [CommonModule, InputfieldComponent, ButtonComponent, FormsModule, DialogComponent]
})
export class LogInComponent {
  globalVariables = inject(GlobalVariablesService);
  redirectDashboard() {
    window.location.href = '/dashboard';
  }
}
