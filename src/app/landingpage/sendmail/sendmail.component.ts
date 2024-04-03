import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from 'app/shared/button/button.component';
import { DialogComponent } from 'app/shared/dialog/dialog.component';
import { GoBackButtonComponent } from 'app/shared/go-back-button/go-back-button.component';
import { InputfieldComponent } from 'app/shared/inputfield/inputfield.component';

@Component({
  selector: 'app-sendmail',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, InputfieldComponent, DialogComponent, GoBackButtonComponent],
  templateUrl: './sendmail.component.html',
  styleUrl: './sendmail.component.scss'
})
export class SendmailComponent {

}
