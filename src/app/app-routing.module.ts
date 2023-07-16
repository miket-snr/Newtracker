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
import { BudgetlineEditComponent } from './components/budgetline-edit/budgetline-edit.component';
import { MvtdocsListComponent } from './components/mvtdocs-list/mvtdocs-list.component';
import { CashflowComponent } from './components/cashflow/cashflow.component';
import { FundingmasseditComponent } from './components/funding/fundingmassedit/fundingmassedit.component';
import { TriangleComponent } from './components/cflow/triangle/triangle.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { VideosComponent } from './components/videos/videos.component';
import { ImportsComponent } from './components/imports/imports.component';
import { DebtorsComponent } from './components/debtors/debtors.component';
import { MassapprovalsComponent } from './components/massapprovals/massapprovals.component';
import { MassprogressComponent } from './components/massprogress/massprogress.component';
import { SapcheckComponent } from './components/sapcheck/sapcheck.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  {path: 'admin',component:AdminComponent},
  {path: 'approvals',component:TriangleComponent},
  {path: 'budget',component:AbsabudgetComponent},
  {path: 'budgetedit',component:BudgetlineEditComponent},
  {path: 'cashflow',component:CashflowComponent},
  {path: 'cipfund',component:FundciplineComponent},
  {path: 'debtors',component:DebtorsComponent},
  {path: 'dashboard',component:DashboardComponent},
  {path: 'docs',component:DocumentsComponent},
  {path: 'massapprovals',component:MassapprovalsComponent},
  {path: 'massfund',component:FundingmasseditComponent},
  {path: 'massprogress',component:MassprogressComponent},
  { path: 'home', component: HomeComponent},
  { path: 'help', component: HelpComponent},
  { path: 'import/:importtype', component: ImportsComponent},
  { path: 'imports', component: MassimportComponent},
  { path: 'login', component: LoginComponent},
  { path: 'mvtdocs', component: MvtdocsListComponent},
  { path: 'planner', component: GanttComponent},
  { path: 'projectlist', component:ProjectlistComponent},
  { path: 'requestedit/:id', component:AbsarequestComponent},
  { path: 'relink/:newpath', component:RelinkComponent},
  { path: 'sapcheck', component:SapcheckComponent},
  { path: 'transfers', component:TransfersComponent},
  { path: 'videos', component:VideosComponent},
  { path: 'worklist', component:WorklistComponent},

   // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
