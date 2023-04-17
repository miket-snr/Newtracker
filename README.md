# Overview

Application has numerous views and perspectives but the main objects are split into lists and data capture:

# Lists
Worklist - a list of all Open Project for current user or can filter by Region - Pmanager.
Funding list - A list of the Orginal upload and the variations it has gone through.
Error list - a list of Projects that are incomplete

# Data Capture
Absarequest - Edit each Object in detail
            - Requirements, Location, Dates
            - Comments
            - Funding
            - Progress


# Newtracker
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';



import { BrowserModule } from '@angular/platform-browser';
import bootstrap from "bootstrap";

# Entry Point 
import { AppComponent } from './app.component';
# Login
import { LoginComponent } from './components/login/login.component';

# Other
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_DATE_FORMATS } from './_classes/dateset';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormGroupDirective, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';





# Middleware to put latest token on call
import { JwtInterceptor } from './_helpers/jwt.interceptor';


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
    TransfersComponent,
    ReqapprovalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([]),
    HttpClientModule,
    NgGanttEditorModule,
  ],
  exports:[MaterialModule],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }, 
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },FormGroupDirective],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  entryComponents: [LoginComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }