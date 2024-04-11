import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Component, inject } from '@angular/core';
import { ButtonComponent } from 'app/shared/button/button.component';
import { LogInComponent } from "./log-in/log-in.component";
import { GlobalVariablesService } from 'app/services/app-services/global-variables.service';
import { SignUpComponent } from 'app/landingpage/sign-up/sign-up.component';
import { FooterComponent } from 'app/shared/footer/footer.component';
import { trigger, state, style, animate, transition } from '@angular/animations';


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
    RouterLink],
  animations: [
    trigger('animateLogo', [
      state('start', style({
        transform: 'translateX(0) scale(3)',
      })),
      state('end', style({
        transform: 'translateX(-210%) scale(3)'
      })),
      transition('start => end', [
        animate('500ms 1s')]),
    ]),
    trigger('revealText', [
      state('hidden', style({
        transform: 'translateX(-300%) scale(3)',
        color: 'white',
      })),
      state('visible', style({
        transform: 'translateX(88%) scale(3)',
        color: 'white',
      })),
      transition('hidden => visible', animate('500ms 1.5s')),
    ]),
    trigger('moveTogether', [
      state('middel', style({
        transform: 'translateX(24%) scale(3)'
      })), state('top-left', style({
        transform: 'translate(-150%, -600%) scale(1)'
      })),
      transition('middel => top-left', animate('1s 5s')),
    ])
  ]
})
export class LangingpageComponent {
  globalVariables = inject(GlobalVariablesService);
  private router = inject(Router);
  logoState = 'start';
  textState = 'hidden';
  togetherState = 'middel';
  showAnimatedContainer = false;

  constructor() {
    this.globalVariables.login = true;
    this.globalVariables.showSplashScreen = true;
  }


  ngAfterViewInit() {
    this.logoState = 'end';
    this.textState = 'visible';
    setTimeout(() => {
      this.showAnimatedContainer = true;
      // this.togetherState = 'top-left';
    }, 2020); // Zeit anpassen basierend auf den vorherigen Animationen
  }

  goToSignUp() {
    this.router.navigate(['/sign-up']);
  }
}
