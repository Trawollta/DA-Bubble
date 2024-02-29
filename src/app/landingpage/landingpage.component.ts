import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonComponent } from 'app/shared/button/button.component';
import { LogInComponent } from "../log-in/log-in.component";
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { SignUpComponent } from 'app/sign-up/sign-up.component';

@Component({
  selector: 'app-landingpage',
  standalone: true,
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss',
  imports: [CommonModule, ButtonComponent, LogInComponent, SignUpComponent]
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
