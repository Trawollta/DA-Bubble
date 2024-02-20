import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from 'app/button/button.component';
import { InputfieldComponent } from 'app/inputfield/inputfield.component';
import { DialogComponent } from '../dialog.component';
import { GlobalVariablesService } from 'app/services/global-variables.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, InputfieldComponent, ButtonComponent, FormsModule, DialogComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  globalVariables = inject(GlobalVariablesService);
}
