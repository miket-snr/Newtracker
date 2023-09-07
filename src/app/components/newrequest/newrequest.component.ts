import { Component, OnInit } from '@angular/core';
import { ApidataService } from 'src/app/_services/apidata.service';
import { newrequest } from 'src/app/_classes/newrequest';
@Component({
  selector: 'app-newrequest',
  templateUrl: './newrequest.component.html',
  styleUrls: ['./newrequest.component.css']
})
export class NewrequestComponent implements OnInit {
newvm: newrequest = {
  REFERENCE: '',
  CONTRACT: '',
  TITLE: '',
  DETAILS: '',
  BACKGROUND: '',
  EPRIORITY: '',
  REGION: '',
  PROVREGION: '',
  ONEVIEW: '',
  BUILDINGID: '',
  KNOWNAS: '',
  ENDOFLIFE: '',
  PROPSTARTDATE: '',
  PROPENDDATE: '',
  PLANNEDQUARTER: '',
  PROJLINK: '',
  STATUS: '',
  SAPUSER: '',
  RETROSPECTIVE: '',
  VARIOUSSITES: '',
  SITES: '',
  PMANAGER: '',
  PLANSTATUS: '',
  SITENOTES: '',
  EXECUTIONYEAR: '',
  OHSRISK: '',
  LEASED_FREE: '',
  LEASEEND: '',
  CREATEDBY: '',
  CREATEDON: '',
  LOADTYPE: '',
  ESTIMATEBUDGET: '',
  PONUMBER: '',
  PHASE: '',
  FCAST_START: '',
  FCAST_END: '',
  PORTFOLIOMGR: '',
  ACCOUNTANT: '',
  TRACKERCODE: '',
  SKNOWNAS: '',
  STITLE: '',
};
tabindex = 0;
sectionid = [true, true, true, true, true];
  constructor(public apiserv: ApidataService) { }

  ngOnInit(): void {
  }
  tabChanged(event) {
    // this.helper = false;
   
  }
  onSubmit(){
    
  }
  greaterThan(a, b) {
    return a > b
  }
  checkReady(level = '') {
    switch (level) {
      // case 'approve': {
      //   return this.sectionid == 4 && this.request['STATUS'] === 'STEP20'
      // }
      case 'savenew': {
      let returnmsg =  (this.newvm['TITLE'] && this.newvm['TITLE'].length > 10 && 
        this.newvm['DETAILS'].length > 15 
         && this.newvm['PROPSTARTDATE'] 
         && this.newvm['PROPENDDATE'] 
         && this.newvm['REGION']) ? true: false;
         return returnmsg;
        break;
      }
      // case 'save': {
      //   return this.vm['TITLE'] && this.vm['TITLE'].length > 10 && 
      //   this.vm['DETAILS'].length > 15 ;
      //   break;
      // }
      default: {
        return false;
      }
    }

  }
}
