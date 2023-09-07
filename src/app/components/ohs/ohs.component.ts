import { Component, Input, OnInit } from '@angular/core';
import { ApidataService } from 'src/app/_services/apidata.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-ohs',
  templateUrl: './ohs.component.html',
  styleUrls: ['./ohs.component.css']
})
export class OhsComponent implements OnInit {
@Input() ohsitem = {
  REFERENCe:'',
  OHSRISK:'',
  AGREEDRISK:'',
  PROJSCREENING:'',
  VENDORVETTED:'',
  SWMS_OHS_REQ:'',
  SWMS_OHS_AP_DATE:'',
  COMPLIANCE_CONTACT:'',
  SWMS_OHS_NA: false,
  ABSA_OHS_SUBMIT:'',
  PROGRESS: 0,
  COMMENTS:'',
  PROJSCREENING_TXT: '',
  PROJSCREENDATE: '',
  VENDORVETTED_TXT: '',
  SWMS_OHS_REQ_TXT: '',
  SWMS_OHS_NA_TXT: '',
  SWMS_OHS_AP_DATE_TXT: '',
  ABSA_OHS_SUBMIT_TXT: '',
}
codes = this.apiserv.buildcodes();
ohscontacts = this.apiserv.pmlist.filter(line=>{
  return true;
})
  constructor(public apiserv:ApidataService, public authserv: AuthService) { }

  ngOnInit(): void {
    this.ohsitem.PROGRESS = this.apiserv.lclstate.dates['PROG04']
  }
canEdit(): boolean{
return this.authserv.currentUserValue.PASSWORD.includes('OHS')
}
updateSAP() {
  this.apiserv.lclstate.dates['PROG04'] = this.ohsitem.PROGRESS
  this.apiserv.updateOHS(this.ohsitem);
}

}
