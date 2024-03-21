import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LangingpageComponent } from './landingpage/landingpage.component';
import { AddNewChannelComponent } from './dashboard/channel-menu/add-new-channel/add-new-channel.component';
import { SignUpComponent } from './landingpage/sign-up/sign-up.component';
import { LogInComponent } from './landingpage/log-in/log-in.component';
import { ImprintComponent } from './landingpage/imprint/imprint.component';
import { PrivacypolicyComponent } from './landingpage/privacypolicy/privacypolicy.component';
import { PasswordResetComponent } from './landingpage/password-reset/password-reset.component';
import { ConfirmPasswordResetComponent } from './landingpage/confirm-password-reset/confirm-password-reset.component';


export const routes: Routes = [
  {
    path: '', component: LangingpageComponent,
    children: [
      {
        path: '',
        component: LogInComponent
      }, {
        path: 'sign-up',
        component: SignUpComponent
      },
      {
        path: 'request-new-password',
        component: PasswordResetComponent
      }, {
        path: 'confirm-new-password',
        component: ConfirmPasswordResetComponent
      },
      {
        path: 'imprint',
        component: ImprintComponent
      },
      {
        path: 'privacypolicy',
        component: PrivacypolicyComponent
      }]
  },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-new-channel', component: AddNewChannelComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule { }
