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
          projectId: 'da-bubble-c426e',
          appId: '1:220428219121:web:5e119dfd3f6ba804366f50',
          storageBucket: 'da-bubble-c426e.appspot.com',
          apiKey: 'AIzaSyABS1Y7CSUfqZNzEewHtAA7xUGsdBOi1mE',
          authDomain: 'da-bubble-c426e.firebaseapp.com',
          messagingSenderId: '220428219121',
        })
      )
    ),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideAuth(() => getAuth())),
  ],
};
