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
        transform: 'translateX(100%)',
      })),
      state('end', style({
        transform: 'translateX(0)'
      })),
      transition('start => end', animate('200ms ease-in-out')),
    ]),
    trigger('revealText', [
      state('start', style({
        transform: 'translateX(-80%)',
      })),
      state('mid', style({
        transform: 'translateX(0)',
      })),
      state('end', style({
        transform: 'translateX(0)',
        fontSize: '1.5em',
        fontWeight: '800',
        marginBlockStart: '0.83em',
        marginBlockEnd: '0.83em',
      })),
      transition('start => mid', animate('700ms 100ms ease-in-out')),
      transition('mid => end', animate('500ms 1s')),
    ]),
    trigger('moveTopLeft', [
      state('start', style({
        position: 'absolute',
        top: '45%',
        left: '45%',
        color: 'white',
        transform: 'scale(3)',
      })), state('end', style({
        position: 'absolute',
        top: '50px',
        left: '75px',
        color: 'black',
        transform: 'scale(1)',
      })),
      transition('start => end', animate('500ms 1s')),
    ]),
    trigger('splashAnimation', [
      state('start', style({
        opacity: '1.0',
      })), state('end', style({
        opacity: '0.0',
      })),
      transition('start => end', animate('500ms 1s')),
    ])
  ]
})
export class LangingpageComponent {
  globalVariables = inject(GlobalVariablesService);
  private router = inject(Router);
  animateLogoState = 'start';
  revealTextState = 'start';
  moveTopLeftState = 'start';
  splashAnimationState = 'start';
  showAnimatedContainer = false;
  showSplashScreen = false;

  constructor() {
    this.globalVariables.login = true;
    this.globalVariables.showSplashScreen = true;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.animateLogoState = 'end';
      this.revealTextState = 'mid';
    }, 500);
  }

  goToSignUp() {
    this.router.navigate(['/sign-up']);
  }

  revealTextDone(event: any): void {
    if (event.toState == 'mid') {
      this.revealTextState = 'end';
      this.moveTopLeftState = 'end';
      this.splashAnimationState = 'end';
    } else if (event.toState == 'end') {
      this.globalVariables.showSplashScreen = false;
    }
  }
}
