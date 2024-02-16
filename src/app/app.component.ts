import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { ButtonComponent } from './button/button.component';
import { HeaderComponent } from './shared/header/header.component';
import { DialogComponent } from './dialog/dialog.component';
import { GlobalVariablesService } from './services/global-variables.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    ButtonComponent,
    DialogComponent,
    HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {

  globalVariables = inject (GlobalVariablesService);

  title = 'da-bubble';

  firebaseConfig = {
    apiKey: 'AIzaSyBp8iKKC9okcRYyLdCUb9h92m_NeeqhtLc',
    authDomain: 'da-bubble-58fa2.firebaseapp.com',
    projectId: 'da-bubble-58fa2',
    storageBucket: 'da-bubble-58fa2.appspot.com',
    messagingSenderId: '25842217870',
    appId: '1:25842217870:web:b34b86392152e9da16aadf',
  };

  app = initializeApp(this.firebaseConfig);

  redirectToDashboard() {
    window.location.href = '/dashboard';
  }


 //der Eventlistener ist nur nötig, wenn man die Bildschirmgröße live ändern will
 //aber wir können hier feste Breakpoints festlegen und können so die Screenbeiten anpassen ohne die Werte in den jeweiligen SCSS Fisles zu suchen
   @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.setDesktopFlag(); 
  }
  setDesktopFlag() {
    this.globalVariables.desktop600 = window.innerWidth > 600;
    this.globalVariables.desktop900 = window.innerWidth > 900;
  } 
}
