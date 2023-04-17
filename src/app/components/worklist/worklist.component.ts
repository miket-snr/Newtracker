import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { ApidataService } from 'src/app/_services/apidata.service';
import { AuthService } from 'src/app/_services/auth.service';
import { ModalService } from 'src/app/_modal';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-worklist',
  templateUrl: './worklist.component.html',
  styleUrls: ['./worklist.component.css']
})
export class WorklistComponent implements OnInit, OnDestroy {
  @Input() reference = 0;
  searchlist = [];
  searchlistnew = [];
  sections = false;
  filtercip = false;
  btntitle = 'Show Finview';
  searchbox = '';
  pmlist = [];
  fileName = 'Feedback.xlsx';
  changelist = [];
  pmanager = 'Unknown';
  todaydate = this.formatDate(new Date());
  region = '';
  subs: Subscription
  pmForm = new FormGroup({
    pm: new FormControl(''),
    region: new FormControl('*'),
    cipgroup: new FormControl(),
    cipcode: new FormControl(),
    status: new FormControl(),
    site: new FormControl()
  })
  constructor(public apiserv: ApidataService,
    private modalServicejw: ModalService,
    private authserv: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.pmanager = this.apiserv.lclstate.pmanager
    this.region = this.apiserv.lclstate.region
    if (this.reference > 3) {
      this.apiserv.getProgresslist(this.region, this.pmanager, this.reference.toString())
    } else {
      this.apiserv.getProgresslist(this.region, this.pmanager);
    }
    this.pmlist = ['* Show all'];

    // A Region change results in a new call to the API - 
    this.pmForm.get('region').valueChanges.subscribe(value => {
      this.searchlistnew = [];
      this.pmlist = ['* Show all'];
      this.region = value;
      this.apiserv.getProgresslist(value, '*');
    })

    // A New region will trigger this on the return from the API call
    this.subs = this.apiserv.progressBS.subscribe(reply => {
      this.searchlist = [];
      if (reply) {
        reply.forEach(element => {
          let tempobj = { tag: '' };
          tempobj.tag = Object.values(element).join('-');
          element['PROG06'] = element['PROG06'] > 100 ? 0 : element['PROG06'];
          let prog = { progress: this.progressCalc(element) }
          this.searchlist.push({ ...element, ...tempobj, ...prog });
          this.searchlistnew = this.searchlist;
          if (!this.pmlist.includes(element.PMANAGER)) {
            this.pmlist.push(element.PMANAGER)
          }
        });
      }
      this.apiserv.pmlist = this.pmlist;
      if (this.pmlist.length === 2) {
        this.pmForm.get('pm').setValue(this.pmlist[1], { emitEvent: false });
      }
      this.searchlistnew = [...this.searchlist];
    })

    // A PM Change only filters the existing records
    this.pmForm.get('pm').valueChanges.subscribe(value => {
      if (value == '* Show all') {
        this.searchlistnew = [...this.searchlist]
      } else {
        let temp = this.searchlist.filter(lt => {
          return lt.PMANAGER == value;
        });
        this.searchlistnew = [];

        this.searchlistnew = [...temp];
      }
    })

  }

  toggleView() {
    this.sections = !this.sections;
    this.btntitle = this.sections ? 'Show Progress' : 'Show Finview'
  }

  goTo(item) {
    let temp = {  dates: {},
    sites:'',
    currentreq:'',
    phase: '',
    comments:[],
    feedback: {
      REFERENCE:'',
      BUDGETAMT:0,
      FORECAST_START:'',
      FORECAST_END:'',
      RATING:'',
      LAST_COMMENT: '',
      TRACKNOTE:''
    }}
    this.apiserv.lclstate.dates = {}
    this.apiserv.lclstate.sites = '',
    this.apiserv.lclstate.currentreq = '',
    this.apiserv.lclstate.phase =  '',
    this.apiserv.lclstate.comments = [],
    this.apiserv.lclstate.feedback =  {
      REFERENCE:'',
      BUDGETAMT:0,
      FORECAST_START:'',
      FORECAST_END:'',
      RATING:'',
      LAST_COMMENT: '',
      TRACKNOTE:''
    }
    this.apiserv.getReqView(item.ABSAREQNO);
    this.router.navigate(['requestedit/' + item.ABSAREQNO])
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
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
      alert(datein)
    }
    return yyyy + '-' + mm + '-' + dd;
  }
  newValue($event, idx, item) {

    if (this.changelist.indexOf(item.ABSAREQNO) === -1) {
      this.changelist.push(item.ABSAREQNO);
    }
    // let numberans = parseInt(item.scope.slice(0,-1)) * 5 +
    // parseInt(item.boq.slice(0,-1)) * 2.5 +
    // parseInt(item.costs.slice(0,-1)) * 2.5  +
    // parseInt(item.approval.slice(0,-1)) * 5  +
    // parseInt(item.implement.slice(0,-1)) * 65  +
    // parseInt(item.invsubmitted.slice(0,-1)) * 7.5  ;
    // numberans = numberans / 100;
    // this.amountclaimed = 0;
    // this.searchlistnew.forEach(line => {
    //   if (this.changelist.indexOf(line.reference) != -1) {
    //    this.amountclaimed += parseFloat(line.claiming);
    //   }
    // })
    // // if (item.approval){
    // //   numberans = numberans + 10;
    // //   this.approvalweek = 'Week ' + this.getWeek(new Date(item.approval),0).toString();
    // // }
    // // if (item.practicalcomp){
    // //   numberans = numberans + 2.5;
    // //   this.practicalweek = 'Week ' + this.getWeek(new Date(item.practicalcomp),0).toString();
    // // }
    // let myanswer = numberans.toString() + '%';
    // item.progress = myanswer;
  }
  saveToSAP() {
    let saved = [];
    this.searchlistnew.forEach(line => {
      if (this.changelist.indexOf(line.reference) != -1) {
        saved.push(line);
      }
    })
    let tosave = [];
    saved.forEach(item => {
      tosave.push({
        REFERENCE: item.ABSAREQNO,
        PROG01: item.PROG01,
        PROG02: item.PROG02,
        PROG03: item.PROG03,
        PROG04: item.PROG04,
        PROG05: item.PROG05,
        PROG06: item.PROG06,
        PROG07: item.PROG07,
        PROG08: item.PROG08,
        PROG09: item.PROG09,
        PROG10: item.PROG10,
        PROPSTARTDATE: item.PROPSTARTDATE,
        PROPENDDATE: item.PROPENDDATE
        //    PROGRESS: item.progress
      });
    })
    let todo = { DATA: JSON.stringify(tosave) };
    this.apiserv.postGEN(todo, 'UPDATE_PSTRACKER').subscribe(item => {
      this.apiserv.messagesBS.next('All Done')
      this.changelist = [];
    })
  }
  progressCalc(item) {
    let numberans = (item.PROG02) * 5 +
      (item.PROG03) * 2.5 +
      (item.PROG04) * 2.5 +
      (item.PROG05) * 5 +
      (item.PROG06) * 5 +
      (item.PROG07) * 65 +
      (item.PROG08) * 5 +
      (item.PROG09) * 5 +
      (item.PROG10) * 5;
    return Math.round(numberans / 100);
  }

  exportexcel(): void {
    /* pass the table id */
    let element = document.getElementById('progress');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, { raw: true });

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Project Progress');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }
  selectUnlinked() {
    this.searchlistnew = [];
    this.filtercip = !this.filtercip;
    if (this.filtercip) {
      this.searchlistnew = this.searchlist.filter(lt => {
        return lt.INITIATIVE < '10000000';
      } ) } else {
        this.searchlistnew = [...this.searchlist];
      } 
    if (this.pmForm.value.pm > ' ' && this.pmForm.value.pm != '* Show all') {
      let temp = this.searchlist.filter(lt => {
        return ((lt.PMANAGER == this.pmForm.value.pmanager));
      });
      this.searchlistnew = [...temp]
    }

  }

}

