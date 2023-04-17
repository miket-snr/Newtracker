import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApidataService } from 'src/app/_services/apidata.service';

@Component({
  selector: 'app-massimport',
  templateUrl: './massimport.component.html',
  styleUrls: ['./massimport.component.css']
})
export class MassimportComponent implements OnInit, OnDestroy {
  importarea = '';
  Helpimport = false;
  multidates = [];
  sub: Subscription;
  multiprogress = [];
  readytoimport = this.apiserv.wbs2reqmapperBS.value;
  section = 'progress';
  constructor(private apiserv: ApidataService) { }

  ngOnInit(): void {
    if (!this.apiserv.wbs2reqmapperBS.value) {
      this.apiserv.getWbs2Req();
    }
    this.sub = this.apiserv.wbs2reqmapperBS.subscribe(hint => {
      this.readytoimport = hint;
    })
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  importData() {
    this.copyAndPaste(this.importarea)
  }
  copyAndPaste(instring = '') {
    const newArray = instring.split('\n').map((line) => line.split('\t'))
    this.multidates = [];
    newArray.forEach(newobj => {
      if (newobj[0].length > 5) {
        switch (this.section) {
          case 'dates': {
            if (/^[A-Z]{3}-[A-Z]{1}/.test(newobj[0])) {
              let newdate = {}
              newdate['ABSAREQNO'] = this.apiserv.mapWBS2Req(newobj[0]);
              if (newdate['ABSAREQNO'] > 1) {
                // newdate['DATE01'] = this.formatDate(newobj[1]);
                newdate['DATE02'] = this.formatDate(newobj[2]);
                newdate['DATE03'] = this.formatDate(newobj[3]);
                newdate['DATE04'] = this.formatDate(newobj[4]);
                newdate['DATE05'] = this.formatDate(newobj[5]);
                newdate['DATE06'] = this.formatDate(newobj[6]);
                newdate['DATE07'] = this.formatDate(newobj[7]);
                newdate['DATE08'] = this.formatDate(newobj[8]);
                newdate['DATE09'] = this.formatDate(newobj[9]);
                if (newobj.length > 10) {
                  newdate['DATE10'] = this.formatDate(newobj[10]);
                }
                else {
                  newdate['DATE10'] = newdate['DATE09'];
                }
                this.multidates.push(JSON.parse(JSON.stringify(newdate)))
              }
            } else {
              alert('wrong wbs format')

            }
            break;
          }
          case 'progress': {
            if (/^[A-Z]{3}-[A-Z]{1}/.test(newobj[0])) {
              let newdate = {}
              newdate['ABSAREQNO'] = this.apiserv.mapWBS2Req(newobj[0]);
              if (newdate['ABSAREQNO'] > 1) {
                // newdate['PROG01'] = (newobj[1]);
                newdate['PROG02'] = (newobj[2]);
                newdate['PROG03'] = (newobj[3]);
                newdate['PROG04'] = (newobj[4]);
                newdate['PROG05'] = (newobj[5]);
                newdate['PROG06'] = (newobj[6]);
                newdate['PROG07'] = (newobj[7]);
                newdate['PROG08'] = (newobj[8]);
                newdate['PROG09'] = (newobj[9]);
                if (newobj.length > 10) {
                  newdate['PROG10'] = (newobj[10]);
                }
                else {
                  newdate['PROG10'] = newdate['PROG09'];
                }
                this.multidates.push(JSON.parse(JSON.stringify(newdate)))
              }
            } else {
              alert('wrong wbs format')

            }
            break;
          }
          case 'approval': {
            if (/^[A-Z]{3}-[A-Z]{1}/.test(newobj[0])) {
              let newdate = {}
              newdate['ABSAREQNO'] = this.apiserv.mapWBS2Req(newobj[0]);
              if (newdate['ABSAREQNO'] > 1) {
                newdate['RETROSPECTIVE'] = (newobj[1]);
                newdate['INITIATIVE'] = (newobj[2]);
                newdate['APPROVAL_MOTIVATE'] = (newobj[3]);
                newdate['APPROVAL_STATUS'] = (newobj[4]);
                newdate['APPROVAL_SUBMITDATE'] = this.formatDate(newobj[5]);
                newdate['APPROVAL_DATE'] = this.formatDate(newobj[6]);
                newdate['PONUMBER'] = (newobj[7]);
                newdate['APPROVED_AMT'] = (newobj[8]);
                this.multidates.push(JSON.parse(JSON.stringify(newdate)))
              }
            } else {
              alert('wrong wbs format')

            }
            break;
          }
          case 'funding': {
            if (/^[A-Z]{3}-[A-Z]{1}/.test(newobj[0])) {
              let newdate = {}
              newdate['ABSAREQNO'] = this.apiserv.mapWBS2Req(newobj[0]);
              if (newdate['ABSAREQNO'] > 1) {
                newdate['BUDGETPROGRAM'] = (newobj[1]);
                newdate['CIPGROUP'] = (newobj[2]);
                newdate['CIPNAME'] = (newobj[3]);
                newdate['CIPCODE'] = (newobj[4]);
                newdate['WORKSTREAM'] = (newobj[5]);
                newdate['ESTIMATEDBUDGET'] = (newobj[6]);
                newdate['CAPEX_OPEX'] = (newobj[7]);
                this.multidates.push(JSON.parse(JSON.stringify(newdate)))
              }
            } else {
              alert('wrong wbs format')

            }
            break;
          }
          case 'location': {
            if (/^[A-Z]{3}-[A-Z]{1}/.test(newobj[0])) {
              let newdate = {}
              newdate['ABSAREQNO'] = this.apiserv.mapWBS2Req(newobj[0]);
              if (newdate['ABSAREQNO'] > 1) {
                newdate['REGION'] = (newobj[1]);
                newdate['PROVREGION'] = (newobj[2]);
                newdate['ONEVIEW'] = (newobj[3]);
                newdate['ENDOFLIFE'] = (newobj[4]);
                newdate['LEASED_FREE'] = (newobj[5]);
                newdate['LEASEEND'] = this.formatDate(newobj[6]);              
                this.multidates.push(JSON.parse(JSON.stringify(newdate)))
              }
            } else {
              alert('wrong wbs format')

            }
            break;
          }
          case 'appreq': {
            if (/^[0-9]*$/.test(newobj[0])) {
              let newdate = {}
              newdate['ABSAREQNO'] = '6';
              if (newdate['ABSAREQNO'] > 1) {
                newdate['PROJLINK'] = (newobj[1]);
                newdate['REGION'] = (newobj[1]);
                newdate['PROVREGION'] = (newobj[2]);
                newdate['ONEVIEW'] = (newobj[3]);
                newdate['ENDOFLIFE'] = (newobj[4]);
                newdate['LEASED_FREE'] = (newobj[5]);
                newdate['LEASEEND'] = this.formatDate(newobj[6]);                         
                newdate['PROPSTARTDATE'] = this.formatDate(newobj[6]);              
                newdate['PROPENDDATE'] = this.formatDate(newobj[6]);              
                newdate['TITLE'] = (newobj[6]);              
                newdate['BASELINEBUDGET'] = (newobj[6]);              
                newdate['CIPCODE'] = (newobj[6]);              
                newdate['WORKSTREAM'] = (newobj[6]);              
                this.multidates.push(JSON.parse(JSON.stringify(newdate)))
              }
            } else {
              alert('wrong wbs format')

            }
            break;
          }
        }
        
      }
    })
    this.importarea = '';
    this.post2SAP(this.section)

  }

  post2SAP(whereto) {
    switch (whereto) {
      case 'dates': {
        this.apiserv.postGEN({ DATA: JSON.stringify(this.multidates) }, 'MASSUPDATE_DATES', 'PROJECTS').subscribe(result => {
          this.apiserv.messagesBS.next('Done');
        })
        break;
      }
      case 'progress': {
        this.apiserv.postGEN({ DATA: JSON.stringify(this.multidates) }, 'MASSUPDATE_DATES', 'PROJECTS').subscribe(result => {
          this.apiserv.messagesBS.next('Done');
        })
        break;
      }
      case 'approval': {
        this.apiserv.postGEN({ DATA: JSON.stringify(this.multidates) }, 'MASSUPDATE_REQS', 'PROJECTS').subscribe(result => {
          this.apiserv.messagesBS.next('Done');
        })
        break;
      }
      case 'funding': {
        this.apiserv.postGEN({ DATA: JSON.stringify(this.multidates) }, 'MASSUPDATE_FUNDING', 'PROJECTS').subscribe(result => {
          this.apiserv.messagesBS.next('Done');
        })
        break;
      }
      case 'location':{
        this.apiserv.postGEN( {DATA:JSON.stringify(this.multidates)}, 'MASSUPDATE_REQS','PROJECTS').subscribe(result=> {
          this.apiserv.messagesBS.next('Done');
        })
              break;
            }
            case 'appreq': {
              this.apiserv.postGEN({ DATA: JSON.stringify(this.multidates) }, 'MASSUPDATE_REQS', 'PROJECTS').subscribe(result => {
                this.apiserv.messagesBS.next('Done');
              })
              break;
            }
    }
  }

  formatDate(datein): string {
    datein = new Date(datein);
    datein.setHours(0, 0, 0, 0);
    let dd = ''; let mm = ''; let yyyy = 0;
    try {
      console.log(datein);
      dd = String(datein.getDate()).padStart(2, '0');
      mm = String(datein.getMonth() + 1).padStart(2, '0'); //January is 0!
      yyyy = datein.getFullYear();
    } catch (e) {
     // alert(datein)
    }
     let reply = yyyy + '-' + mm + '-' + dd;
     return reply.includes('NaN')? '0000-00-00': reply;
  }

}
