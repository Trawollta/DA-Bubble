import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonComponent } from 'app/button/button.component';
import { DialogComponent } from 'app/dialog/dialog.component';
import { LogInComponent } from "../dialog/log-in/log-in.component";
import { GlobalVariablesService } from 'app/services/global-variables.service';
import { SignUpComponent } from 'app/dialog/sign-up/sign-up.component';

@Component({
  selector: 'app-landingpage',
  standalone: true,
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss',
  imports: [DialogComponent, CommonModule, ButtonComponent, LogInComponent, SignUpComponent]
})
export class LangingpageComponent {
  globalVariables = inject(GlobalVariablesService);
  constructor() {
    this.globalVariables.login = true;
  }

  goToSignUp() {
    this.globalVariables.signup = true;
  }

}
