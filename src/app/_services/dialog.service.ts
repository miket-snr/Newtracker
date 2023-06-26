import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ShowhelpComponent } from '../_helpers/showhelp/showhelp.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  helpdialogRef: MatDialogRef<ShowhelpComponent>;

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
 
  // public confirmed(): Observable<any> {}
  // public updated(): Observable<any> {}
}
