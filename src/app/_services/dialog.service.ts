import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ShowhelpComponent } from '../_helpers/showhelp/showhelp.component';
import { GetProgressComponent } from '../_helpers/get-progress/get-progress.component';
import { GetApprovalComponent } from '../_helpers/get-approval/get-approval.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  helpdialogRef: MatDialogRef<ShowhelpComponent>;
  progressdialogRef: MatDialogRef<GetProgressComponent>;
  approvaldialogRef: MatDialogRef<GetApprovalComponent>;

  constructor(private dialog: MatDialog) { }

 

  public helpopen(options) {
    this.helpdialogRef = this.dialog.open(ShowhelpComponent, {
      disableClose: true,
      autoFocus:true,
      minWidth: 600,
      maxHeight:600,
      data: {
        title: options.title, helptext: options.helptext
      }
    })
  }  
  public progressopen(item) {
    this.progressdialogRef = this.dialog.open(GetProgressComponent, {
      disableClose: true,
      autoFocus:true,
      minWidth: 600,
      maxHeight:600,
      data: item
    })
  }  
  public approvalopen(item) {
    this.approvaldialogRef = this.dialog.open(GetApprovalComponent, {
      disableClose: true,
      autoFocus:true,
      minWidth: 800,
      maxHeight:600,
      data: item
    })
  }  
  // public confirmed(): Observable<any> {}
  // public updated(): Observable<any> {}
}
