import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
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
  signUpStep: string = "createAccount";


  signUpUserData = {
    name: "",
    email: "",
    password: "",
    img: ""
  }

  goBack() {
    this.globalVariables.signup = false;
  }

  goChooseAvatar() {
    this.signUpStep = "chooseAvatar";
    console.log(this.signUpUserData);
  }

  onSubmit(arg0: { name: string; email: string; password: string; img: string; }) {
    throw new Error('Method not implemented.');
  }
  ngAfterViewInit() {
    window.dispatchEvent(new Event('resize'));
  }

  ngOnInit() {
    console.log('init sing-up');
  }

  avatarImgs = [
    'assets/img/avatars/avatar_1.svg',
    'assets/img/avatars/avatar_2.svg',
    'assets/img/avatars/avatar_3.svg',
    'assets/img/avatars/avatar_4.svg',
    'assets/img/avatars/avatar_5.svg',
    'assets/img/avatars/avatar_6.svg'
  ]
}
