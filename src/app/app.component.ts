import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { ButtonComponent } from './button/button.component';
import { HeaderComponent } from './shared/header/header.component';
import { DialogComponent } from './dialog/dialog.component';

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
}
