import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AbsabudgetComponent } from './components/absabudget/absabudget.component';
import { AbsarequestComponent } from './components/absarequest/absarequest.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FundciplineComponent } from './components/fundcipline/fundcipline.component';
import { GanttComponent } from './components/gantt/gantt.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProjectlistComponent } from './components/projectlist/projectlist.component';
import { RelinkComponent } from './components/relink/relink.component';
import { TransfersComponent } from './components/transfers/transfers.component';
import { WorklistComponent } from './components/worklist/worklist.component';
import { MassimportComponent } from './components/massimport/massimport.component';
import { AdminComponent } from './components/admin/admin.component';
import { HelpComponent } from './components/help/help.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  {path: 'admin',component:AdminComponent},
  {path: 'budget',component:AbsabudgetComponent},
  {path: 'cipfund',component:FundciplineComponent},
  {path: 'dashboard',component:DashboardComponent},
  { path: 'home', component: HomeComponent},
  { path: 'help', component: HelpComponent},
  { path: 'imports', component: MassimportComponent},
  { path: 'login', component: LoginComponent},
  { path: 'planner', component: GanttComponent},
  { path: 'projectlist', component:ProjectlistComponent},
  { path: 'requestedit/:id', component:AbsarequestComponent},
  { path: 'relink/:newpath', component:RelinkComponent},
  { path: 'transfers', component:TransfersComponent},
  { path: 'worklist', component:WorklistComponent},

   // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
