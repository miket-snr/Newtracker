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
  PROGRESS: 0,
  COMMENTS:''
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
