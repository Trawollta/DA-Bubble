import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppComponent } from './app.component';
import { LangingpageComponent } from './landingpage/landingpage.component';
import { AddNewChannelComponent } from './dashboard/channel-menu/add-new-channel/add-new-channel.component';


export const routes: Routes = [
  { path: '', component: LangingpageComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-new-channel', component: AddNewChannelComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule { }
