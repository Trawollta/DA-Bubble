import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { InputfieldComponent } from 'app/inputfield/inputfield.component';
import { GlobalVariablesService } from 'app/services/global-variables.service';
import { DialogComponent } from "../dialog.component";
import { ButtonComponent } from 'app/button/button.component';

@Component({
  selector: 'app-sing-up',
  standalone: true,
  templateUrl: './sing-up.component.html',
  styleUrl: './sing-up.component.scss',
  imports: [CommonModule, InputfieldComponent, ButtonComponent, FormsModule, DialogComponent]
})
export class SingUpComponent {
  globalVariables = inject(GlobalVariablesService);
}
