import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppComponent } from './app.component';
import { LangingpageComponent } from './landingpage/landingpage.component';
import { AddNewChannelComponent } from './dashboard/channel-menu/add-new-channel/add-new-channel.component';
import { SignUpComponent } from './landingpage/sign-up/sign-up.component';
import { SendmailComponent } from './landingpage/sendmail/sendmail.component';
import { LogInComponent } from './landingpage/log-in/log-in.component';
import { ImprintComponent } from './landingpage/imprint/imprint.component';
import { PrivacypolicyComponent } from './landingpage/privacypolicy/privacypolicy.component';


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
        component: SendmailComponent
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
