import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Progress } from 'src/app/_classes/progress';
import { ApidataService } from 'src/app/_services/apidata.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-get-progress',
  templateUrl: './get-progress.component.html',
  styleUrls: ['./get-progress.component.css']
})
export class GetProgressComponent implements OnInit {
item = this.initdata();
phaseprog: any;
blockback = false;
ohsrole =  this.authserv.currentUserValue.PASSWORD.includes('OHS')
codes = this.apiserv.buildcodes();
  constructor(@Inject(MAT_DIALOG_DATA) public data: Progress, 
  private progressDialog: MatDialogRef<GetProgressComponent>,
   private apiserv: ApidataService,
   private authserv: AuthService) { }

  ngOnInit(): void {
    this.item = this.data;
  }
public close(){
  this.progressDialog.close();
}
initdata(){
  return      {
    REFERENCE: '',
    multisite:'',
    PHASE: '',
    PROG01: ' ',
    PROG02: ' ',
    PROG03: ' ',
    PROG04: ' ',
    PROG05: ' ',
    PROG06: ' ',
    PROG07: ' ',
    PROG08: ' ',
    PROG09: ' ',
    PROG10: ' ',
    PROPSTARTDATE: '',
    PROPENDDATE:'',
    FORECAST_START: '',
    FORECAST_END: '',
    TRACKNOTE:'',
//    PROGRESS: item.progress
  }
}
buildcodes() {
  this.phaseprog = [];
  this.phaseprog.push({ phase: 'Register', codes: [{ code: 0, text: 'Not started' }, { code: 100, text: 'Completed' }] })
  this.phaseprog.push({
    phase: 'Initiation with Stakeholders', codes: [{ code: 0, text: 'Not started' },
    { code: 20, text: 'Site Visited & Assessment Started' },
    { code: 60, text: 'Engagements and Scope in Review' },
    { code: 80, text: 'Scope Finalisation' },
    { code: 100, text: 'Scope Signed Off' }
    ]
  })
  this.phaseprog.push({
    phase: 'Costing and DD', codes: [{ code: 0, text: 'Not started' },
    { code: 20, text: 'Started' },
    { code: 60, text: 'Early Progresss' },
    { code: 80, text: 'Advanced Progress' },
    { code: 100, text: 'Completed' }
    ]
  })
  this.phaseprog.push({ phase: 'Client Approval', codes: [{ code: 0, text: 'Not started' }, { code: 50, text: 'In Progress' }, { code: 100, text: 'Completed' }] })
  this.phaseprog.push({ phase: 'Approval Board', codes: [{ code: 0, text: 'Not Started' }, { code: 40, text: 'Submitted' }, { code: 60, text: 'Awaiting' }, { code: 100, text: 'Approved' }] })
  this.phaseprog.push({ phase: 'Lead Time', codes: [{ code: 0, text: 'Not started' }, { code: 50, text: 'In Progress' }, { code: 100, text: 'Completed' }] })
  this.phaseprog.push({
    phase: 'On Site ', codes: [
      { code: 0, text: 'Not started' },
      { code: 20, text: 'Started' },
      { code: 40, text: 'Progress' },
      { code: 60, text: 'Early Progresss' },
      { code: 80, text: 'Advanced Progress' },
      { code: 100, text: 'Completed' }]
  })
  this.phaseprog.push({ phase: 'Proof of Completion', codes: [{ code: 0, text: 'Not started' },{ code: 50, text: 'Partial POC Submitted' }, { code: 100, text: 'Completed' }] })
  this.phaseprog.push({ phase: 'Billing Process', codes: [{ code: 0, text: 'Not started' }, { code: 30, text: 'Partially Invoiced' }, { code: 60, text: 'Invoices Submitted' }, { code: 100, text: 'Completed' }] })
  this.phaseprog.push({ phase: 'Expected Cash Flow Date', codes: [{ code: 0, text: 'Not started' }, { code: 50, text: 'Partial Cash Flow' },{ code: 100, text: 'Completed' }] })
  return this.phaseprog;
}
savePhases() {
  this.data['TRACKNOTE'] = this.apiserv.xtdbtoa(this.data['TRACKNOTE']);
  let lclobj = this.data;
 delete lclobj['multisite'];
 let sendarray = { DATA:JSON.stringify( [lclobj]) ,TRACKTYPE:'PHASE'};
  this.apiserv.postGEN(sendarray, 'UPDATE_PSTRACKER').subscribe(item => {
      this.apiserv.messagesBS.next('All Done')
      this.close();
      //this.apiserv.getProgresslist(this.apiserv.lclstate.region, this.apiserv.lclstate.pmanager, newdates['REFERENCE'])
    })
}
}