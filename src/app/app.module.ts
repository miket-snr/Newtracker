import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import bootstrap from "bootstrap";
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_DATE_FORMATS } from './_classes/dateset';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { ProjectlistComponent } from './components/projectlist/projectlist.component';
import { SearchpipePipe } from './_classes/searchpipe.pipe';
import { AbsarequestComponent } from './components/absarequest/absarequest.component';
import { RelinkComponent } from './components/relink/relink.component';
import { GanttComponent } from './components/gantt/gantt.component';
import { NgGanttEditorModule } from 'ng-gantt';
import { CommentsComponent } from './components/comments/comments.component';
import { MultiSitesComponent } from './components/multi-sites/multi-sites.component';
import { WorklistComponent } from './components/worklist/worklist.component';
import { FundciplineComponent } from './components/fundcipline/fundcipline.component';
import { TransfersComponent } from './components/transfers/transfers.component';
import { ReqapprovalComponent } from './components/reqapproval/reqapproval.component';
import { AbsabudgetComponent } from './components/absabudget/absabudget.component';
import { ModalModule } from './_modal';
import { ProgressComponent } from './components/progress/progress.component';
import { FundingeditorComponent } from './components/fundingeditor/fundingeditor.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { WorklistMultiComponent } from './components/worklist-multi/worklist-multi.component';
import { MassimportComponent } from './components/massimport/massimport.component';
import { FundFinderComponent } from './components/fund-finder/fund-finder.component';
import { AdminComponent } from './components/admin/admin.component';
import { TaskEditComponent } from './components/task-edit/task-edit.component';
import { QuillModule }  from 'ngx-quill';
import { HelpComponent } from './components/help/help.component';
import { ApprovalFormComponent } from './components/approval-form/approval-form.component';
import { CashflowComponent } from './components/cashflow/cashflow.component';
import { BudgetlineEditComponent } from './components/budgetline-edit/budgetline-edit.component';
import { MvtdocsListComponent } from './components/mvtdocs-list/mvtdocs-list.component';
import { FundingmasseditComponent } from './components/funding/fundingmassedit/fundingmassedit.component';
import { FundinglineeditComponent } from './components/funding/fundinglineedit/fundinglineedit.component';
import { TriangleComponent } from './components/cflow/triangle/triangle.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { FileSaverModule } from 'ngx-filesaver';
import { VideosComponent } from './components/videos/videos.component';
import { TasklistComponent } from './components/tasklist/tasklist.component';
import { ImportsComponent } from './components/imports/imports.component';
import { DebtorsComponent } from './components/debtors/debtors.component';
import { SelectionlistComponent } from './_helpers/selectionlist/selectionlist.component';
import { ShowhelpComponent } from './_helpers/showhelp/showhelp.component';
import { MassapprovalsComponent } from './components/massapprovals/massapprovals.component';
import { MassprogressComponent } from './components/massprogress/massprogress.component';
import { GetProgressComponent } from './_helpers/get-progress/get-progress.component';
import { GetApprovalComponent } from './_helpers/get-approval/get-approval.component';
import { CommentsModule } from './comments/comments.module';
import { SapcheckComponent } from './components/sapcheck/sapcheck.component';
import { IssuesComponent } from './components/issues/issues.component';
import { OhsComponent } from './components/ohs/ohs.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SearchpipePipe,
    ProjectlistComponent,
    AbsarequestComponent,
    RelinkComponent,
    GanttComponent,
    CommentsComponent,
    MultiSitesComponent,
    WorklistComponent,
    FundciplineComponent,
    FundingeditorComponent,
    FundFinderComponent,
    TransfersComponent,
    ReqapprovalComponent,
    AbsabudgetComponent,
    ProgressComponent,
    FeedbackComponent,
    DashboardComponent,
    WorklistMultiComponent,
    MassimportComponent,
    AdminComponent,
    TaskEditComponent,
    HelpComponent,
    ApprovalFormComponent,
    CashflowComponent,
    BudgetlineEditComponent,
    MvtdocsListComponent,
    FundingmasseditComponent,
    FundinglineeditComponent,
    TriangleComponent,
    DocumentsComponent,
    VideosComponent,
    TasklistComponent,
    ImportsComponent,
    DebtorsComponent,
    SelectionlistComponent,
    ShowhelpComponent,
    MassapprovalsComponent,
    MassprogressComponent,
    GetProgressComponent,
    GetApprovalComponent,
    SapcheckComponent,
    IssuesComponent,
    OhsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    CommentsModule,
    FormsModule,
    ModalModule,
    ReactiveFormsModule,
    RouterModule.forRoot([]),
    HttpClientModule,
    NgGanttEditorModule,
    QuillModule.forRoot(),
    FileSaverModule,

  ],
  exports:[MaterialModule],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }, 
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },FormGroupDirective],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  entryComponents: [LoginComponent,ShowhelpComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
