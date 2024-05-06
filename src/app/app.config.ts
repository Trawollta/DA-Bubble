import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAuth } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          apiKey: "AIzaSyD9Bcky2YKzsJfq6YN9VCXHCwEfBs8IJ1E",
          authDomain: "dabubble-a269f.firebaseapp.com",
          projectId: "dabubble-a269f",
          storageBucket: "dabubble-a269f.appspot.com",
          messagingSenderId: "195634866937",
          appId: "1:195634866937:web:92e38b9d0b24105bd15028"
        })
      )
    ),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideAuth(() => getAuth())), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"dabubble-a269f","appId":"1:195634866937:web:92e38b9d0b24105bd15028","storageBucket":"dabubble-a269f.appspot.com","apiKey":"AIzaSyD9Bcky2YKzsJfq6YN9VCXHCwEfBs8IJ1E","authDomain":"dabubble-a269f.firebaseapp.com","messagingSenderId":"195634866937"}))), importProvidersFrom(provideFirestore(() => getFirestore())),
  ],
};
