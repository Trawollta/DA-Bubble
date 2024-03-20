import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Component, inject } from '@angular/core';
import { ButtonComponent } from 'app/shared/button/button.component';
import { LogInComponent } from "./log-in/log-in.component";
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { SignUpComponent } from 'app/landingpage/sign-up/sign-up.component';
import { FooterComponent } from 'app/shared/footer/footer.component';

@Component({
  selector: 'app-landingpage',
  standalone: true,
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss',
  imports: [
    CommonModule,
    ButtonComponent,
    LogInComponent,
    SignUpComponent,
    FooterComponent,
    RouterOutlet,
    RouterLink]
})
export class LangingpageComponent {
  globalVariables = inject(GlobalVariablesService);
  private router = inject(Router);
  constructor() {
    this.globalVariables.login = true;
  }

  goToSignUp() {
    this.router.navigate(['/sign-up']);
  }
}
