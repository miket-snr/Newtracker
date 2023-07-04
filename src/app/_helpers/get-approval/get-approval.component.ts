import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Approval } from 'src/app/_classes/approval';
import { ApprovalClass } from 'src/app/_classes/approvalclass';
import { Progress } from 'src/app/_classes/progress';
import { ApidataService } from 'src/app/_services/apidata.service';

@Component({
  selector: 'app-get-approval',
  templateUrl: './get-approval.component.html',
  styleUrls: ['./get-approval.component.css']
})
export class GetApprovalComponent implements OnInit, OnDestroy {
  vm: Approval = new ApprovalClass().approval;
  sub: Subscription ;
  phaseprog: any;
 
    constructor(@Inject(MAT_DIALOG_DATA) public data: {ABSAREQNO:string}, private approvalDialog: MatDialogRef<GetApprovalComponent>, public apiserv: ApidataService) { }
  
    ngOnInit(): void {
      this.apiserv.getSingleApproval(this.data.ABSAREQNO);
    this.sub =  this.apiserv.approval$.subscribe(item => {
        if (item) {
       if( item['APPROVAL_MOTIVATE'] ) {
        item['APPROVAL_MOTIVATE']  = this.apiserv.xtdatob(item['APPROVAL_MOTIVATE']);
       }
      //    item['TRACKNOTE'] = this.apiserv.xtdatob(item['TRACKNOTE']);
      this.vm = { ...item} ;
        }
    })
  }
  public close(){
    this.approvalDialog.close();
  }
  
  ngOnDestroy(): void {
    this.apiserv.approvalBS.next(null);
    this.sub.unsubscribe();
  }
  saveApproval() {
    let lclobj = { ... this.vm }
    if ( lclobj['APPROVAL_MOTIVATE'].length > 0) lclobj['APPROVAL_MOTIVATE'] = this.apiserv.xtdbtoa(this.vm['APPROVAL_MOTIVATE']);
    let lclobjout = JSON.stringify(lclobj);
    console.log(lclobjout);
    this.apiserv.postGEN(lclobj, 'PUT_APPROVAL').subscribe(item => {
            this.apiserv.messagesBS.next('All Done')
            this.apiserv.getProgresslist(this.apiserv.lclstate.region, this.apiserv.lclstate.pmanager, lclobj['REFERENCE']);
            this.close();
            
          })

  //  delete lclobj['multisite'];
  //  let sendarray = { DATA:JSON.stringify( [lclobj]) ,TRACKTYPE:'PHASE'};
  //   this.apiserv.postGEN(sendarray, 'UPDATE_PSTRACKER').subscribe(item => {
  //       this.apiserv.messagesBS.next('All Done')
  //       this.close();
  //       //this.apiserv.getProgresslist(this.apiserv.lclstate.region, this.apiserv.lclstate.pmanager, newdates['REFERENCE'])
  //     })
  }
  }