import { formatDate } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { absareq } from 'src/app/_classes/absareq';
import { dateset } from 'src/app/_classes/dateset';
import { ApidataService } from 'src/app/_services/apidata.service';
import { AuthService } from 'src/app/_services/auth.service';
import { DialogService } from 'src/app/_services/dialog.service';
//import { DatePlanningService } from 'src/app/_services/date-planning.service';

@Component({
  selector: 'app-reqapproval',
  templateUrl: './reqapproval.component.html',
  styleUrls: ['./reqapproval.component.css']
})
export class ReqapprovalComponent implements OnInit, OnDestroy {
  @Input() dates: {
    REFERENCE: '00000000', ONEVIEW: '', DATE01: '', DATE02: '', DATE03: '', DATE04: '', DATE05: '',
    DATE06: '', DATE07: '', DATE08: '', DATE09: '', DATE10: '', PROG01: '', PROG02: '', PROG03: '', PROG04: '',
    PROG05: '', PROG06: '', PROG07: '', PROG08: '', PROG09: '', PROG10: '',
    DATABAG: '7:21:7:21:14:21:45'
  }
  @Input() planner = 'progress';
  @Input() vm: absareq;
  site = '';
  knownas = '';
  sub: Subscription;
  phase = 'PHASE01'
  fact2 = '';
  fact3 = '';
  scopes = [];
  rows = [];
  overdue = false;
  hlptxt = 'Show help';
helper=false;
helpline = this.apiserv.getHelptexts('APPROVAL');
  boqs = [];
  costs = [];
  pos = [];
  invsubs = [];
  implements = [];
  risks = [];
  durations = []
  codes = this.apiserv.buildcodes();
  datedata:dateset =  {};
  //  {
  //   REFERENCE: '00000000', ONEVIEW: '', DATE01: '', DATE02: '', DATE03: '', DATE04: '', DATE05: '',
  //   DATE06: '', DATE07: '', DATE08: '', DATE09: '', DATE10: '', PROG01: '', PROG02: '', PROG03: '', PROG04: '',
  //   PROG05: '', PROG06: '', PROG07: '', PROG08: '', PROG09: '', PROG10: '',
  //   DATABAG: '7:21:7:21:14:21:45'
  // };
  newdates: any ;
  percentages = [
    '0%',
    '20%',
    '40%',
    '60%',
    '80%',
    '100%'
  ];
  approvalweek = '';
  help = false;
  helptext = "Show Help";
  practicalweek = '';
  // risks = [
  //   'Low Risk',
  //   'Medium Risk',
  //   'High Risk',
  //   'N/A'
  // ]
  trackerForm = new FormGroup({
    scope: new FormControl(),
    boq: new FormControl(),
    costs: new FormControl(),
    OHSRisk: new FormControl(),
    approval: new FormControl(),
    absaPO: new FormControl(),
    implement: new FormControl(),
    practicalcomp: new FormControl(),
    invsubmitted: new FormControl(),
    progress: new FormControl({ value: '', disabled: true }),
    oneview: new FormControl()
  })

  choices = [
    { OPT: 1, OPTVALUE: 'Choice 1' },
    { OPT: 1, OPTVALUE: 'Choice 2' },
    { OPT: 1, OPTVALUE: 'Choice 3' }
  ]
  constructor(public apiserv: ApidataService, private authserv: AuthService,
    private rootFormGroup: FormGroupDirective	, private helper2: DialogService) { }

  ngOnInit(): void {
    this.setup()
 
  this.sub =   this.apiserv.currentreq$.subscribe(reply => {
      if (reply) {
this.phase = this.apiserv.lclstate.phase;
this.datedata = this.apiserv.lclstate.dates;
this.buildDurations() ;
      }
      this.onChanges();
    })

    this.onChanges();

  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  comment() {

  }
  formatDate(datein): string {
    datein = new Date(datein);
    datein.setHours(0, 0, 0, 0);
    let dd = ''; let mm = ''; let yyyy = 0;
    try {
      // console.log(datein);
      dd = String(datein.getDate()).padStart(2, '0');
      mm = String(datein.getMonth() + 1).padStart(2, '0'); //January is 0!
      yyyy = datein.getFullYear();
    } catch (e) {
      alert(datein)
    }
    return yyyy + '-' + mm + '-' + dd;
  }
  newValue(field) {
    this.datedata =  this.updateProgress(this.datedata,field)
  }
  newDate(field) {
    this.datedata =  this.updateDates(this.datedata,field)
  }
  newDuration(field) {
   this.datedata =  this.updatePlans(this.datedata)
  }
  setup() {
    // const targetdates = { ...this.getblankDates() };
    // const cutoffdate = this.formatDate(new Date())
    //
   // this.datedata = { ...this.dates }
  //  this.durations = this.datedata['DATABAG'].split(':')
 this.buildDurations() ;
    this.rows = [
      { target: 'Initiation with Stakeholders'},
      { target: 'Costing and DD' },
      { target: 'Approval Preparation'},
      { target: 'Approval Board'},
      { target: 'Lead Time'},
      { target: 'On Site ' },
      // {target:'End on Site',datefrom:targetd },
      { target: 'Expected POC Date' },
      { target: 'Billing Process' },
      { target: 'Expected Cash Flow Date'}
    ]
  }
  buildDurations(){
    this.durations = [];
    this.durations.push(this.datecount(this.datedata['DATE01'], this.datedata['DATE10']).toString())
    this.durations.push(this.datecount(this.datedata['DATE01'], this.datedata['DATE02']).toString())
    this.durations.push(this.datecount(this.datedata['DATE02'], this.datedata['DATE03']).toString())
    this.durations.push(this.datecount(this.datedata['DATE03'], this.datedata['DATE04']).toString())
    this.durations.push(this.datecount(this.datedata['DATE04'], this.datedata['DATE05']).toString())
    this.durations.push(this.datecount(this.datedata['DATE05'], this.datedata['DATE06']).toString())
    this.durations.push(this.datecount(this.datedata['DATE06'], this.datedata['DATE07']).toString())
    this.durations.push(this.datecount(this.datedata['DATE07'], this.datedata['DATE08']).toString())
    this.durations.push(this.datecount(this.datedata['DATE08'], this.datedata['DATE09']).toString())
    this.durations.push(this.datecount(this.datedata['DATE09'], this.datedata['DATE10']).toString())
  }

  getblankDates(datetype = 'PRABSAP') {
    let dateend = new Date()
    dateend.setDate(dateend.getDate() + 120);
    let datestart = new Date()
    datestart.setDate(datestart.getDate() + 90);

    let lcldate = {
      REFERENCE: '00000000', DATESET: datetype, DATE01: '', DATE02: '', DATE03: '', DATE04: '', DATE05: '',
      DATE06: this.formatDate(datestart),
      DATE07: this.formatDate(dateend), DATE08: '', DATE09: '', DATE10: '',
      PROG01: '', PROG02: '', PROG03: '', PROG04: '', PROG05: '', PROG06: '', PROG07: '', PROG08: '', PROG09: '', PROG10: '',
      DATABAG: '7:21:7:21:14:21:45'
    }
    return this.updatePlans(lcldate);

  }
  updatePlans(blankdate) {

    let durations = this.durations
    blankdate.DATE02 = this.datediff(blankdate.DATE01, durations[1], 1)
    blankdate.DATE03 = this.datediff(blankdate.DATE02, durations[2], 1)
    blankdate.DATE04 = this.datediff(blankdate.DATE03, durations[3], 1)
    blankdate.DATE05 = this.datediff(blankdate.DATE04, durations[4], 1)
  //  blankdate.DATE01 = this.datediff(blankdate.DATE02, durations[0], 0)
    blankdate.DATE06 = this.datediff(blankdate.DATE05, durations[5], 1)
    blankdate.DATE07 = this.datediff(blankdate.DATE06, durations[6], 1)
    blankdate.DATE08 = this.datediff(blankdate.DATE07, durations[7], 1)
    blankdate.DATE09 = this.datediff(blankdate.DATE08, durations[8], 1)
    blankdate.DATE10 = this.lastdayofmonth(blankdate.DATE09);
    // durations[7] = this.datecount(blankdate.DATE06, blankdate.DATE07).toString();
    // durations[8] = this.datecount(blankdate.DATE01, blankdate.DATE09).toString();
    blankdate.DATABAG = durations.join(':');
    this.durations = durations;
    return { ...blankdate }
  }

updateDates(blankdate, changer){
  
  let period = 'DATE' + ('0'+ changer).slice(-2);
  let lastperiod = 'DATE' + ('0'+ (changer-1)).slice(-2);
  this.durations[changer-1] = this.datecount(this.datedata[lastperiod],this.datedata[period]);
 this.updatePlans(this.datedata)
  // console.log(changer);
  return blankdate
}

updateProgress(blankdate, change){
  return blankdate
}

  lastdayofmonth(dayinmonth = '') {
    if (dayinmonth.length > 5) {
      let d = new Date(dayinmonth);
      d.setHours(0, 0, 0, 0)
      if (d.getMonth() <= 10) {
        d.setFullYear(d.getFullYear(), d.getMonth() + 1, 0);
      } else {
        d.setFullYear(d.getFullYear() + 1, 0, 0);
      }
      return this.formatDate(d);
    } else {
      return '';
    }
  }


  datediff(a, b, c = 0) {
    let out = '';
    let adate = new Date(a);
    adate.setHours(0, 0, 0, 0)
    // console.log(adate);
    try {
      // const slicedArray = this.calcsstart.slice(0, b);
      // let  sum = slicedArray.reduce((sum, v) => sum + v);
      if (c == 0) {

        adate = new Date(adate.setDate(adate.getDate() - parseInt(b)));

      } else {
        adate = new Date(adate.setDate(adate.getDate() + parseInt(b)));
      }
    } catch (e) {
      // console.log(adate);
    }
    try {
      out = this.formatDate(adate);
    } catch (e) {
      // console.log(adate)
      out = '';
    }

    return out;
  }
  datecount(a, b) {
    let adate = new Date(a)
    adate.setHours(0, 0, 0, 0);
    let bdate = new Date(b);
    bdate.setHours(0, 0, 0, 0)
    let Difference_In_Time = bdate.getTime() - adate.getTime();

    // To calculate the no. of days between two dates
    return Math.round(Difference_In_Time / (1000 * 3600 * 24));
  }
  onChanges() {
    this.trackerForm.valueChanges.subscribe(val => {
      let numberans = parseInt(this.trackerForm.value.scope.slice(0, -1)) * 5 +
        parseInt(this.trackerForm.value.boq.slice(0, -1)) * 2.5 +
        parseInt(this.trackerForm.value.costs.slice(0, -1)) * 2.5 +
        parseInt(this.trackerForm.value.po.slice(0, -1)) * 5 +
        parseInt(this.trackerForm.value.implement.slice(0, -1)) * 65 +
        parseInt(this.trackerForm.value.invsubmitted.slice(0, -1)) * 5;
      numberans = numberans / 100;
      if (this.trackerForm.value.approval) {
        numberans = numberans + 10;
        this.approvalweek = 'Week ' + this.getWeek(new Date(this.trackerForm.value.approval), 0).toString();
      }
      if (this.trackerForm.value.clientapproval) {
        numberans = numberans + 2.5;
        this.practicalweek = 'Week ' + this.getWeek(new Date(this.trackerForm.value.clientapproval), 0).toString();
      }
      if (this.trackerForm.value.ppract_complete) {
        numberans = numberans + 2.5;
        this.practicalweek = 'Week ' + this.getWeek(new Date(this.trackerForm.value.ppract_complete), 0).toString();
      }
      let myanswer = numberans.toString() + '%';
      this.trackerForm.get('progress').setValue(myanswer, { emitEvent: false });
    })
  }
  onSubmit() {
    // console.log(this.trackerForm.value);
  }

  savePhases(){
    this.datedata.FORECAST_START = this.datedata.DATE06;
    this.datedata.FORECAST_END = this.datedata.DATE07;
    this.newdates = { ...this.apiserv.lclstate.dates, ...this.datedata} ;
    this.newdates.TRACKNOTE = this.apiserv.xtdbtoa(this.newdates.TRACKNOTE);
    this.apiserv.lclstate.dates = JSON.parse(JSON.stringify(this.newdates));
    let updater = [this.newdates];
    let todo = {DATA: JSON.stringify(updater),TRACKTYPE:'PHASE'}
    this.apiserv.postGEN(todo, 'UPDATE_PSTRACKER').subscribe(item => {
      this.apiserv.messagesBS.next('All Done')
      this.apiserv.getProgresslist(this.apiserv.lclstate.region, this.apiserv.lclstate.pmanager, this.newdates.REFERENCE)
    })
  }
  SaveTracker() {
    let save = [];
    let lclobjinner = {
      REFERENCE: this.trackerForm.value.absareqno,
      SCOPE: this.trackerForm.value.scope,
      BOQ: this.trackerForm.value.boq,
      COSTS: this.trackerForm.value.costs,
      PO: this.trackerForm.value.po,
      IMPLEMENT: this.trackerForm.value.implement,
      INVSUBMITTED: this.trackerForm.value.invsubmitted,
      CLIENTAPPROVAL: this.trackerForm.value.clientapproval || '00000000',
      PPRACT_COMPLETE: this.trackerForm.value.ppract_complete || '00000000',
      FORECAST_START: this.trackerForm.value.forecast_start,
      FORECAST_END: this.trackerForm.value.forecast_end,
      ONEVIEW: this.trackerForm.value.oneview
      //ZZOHSRISK: this.trackerForm.value.ohsrisk,

      // ZZSAPUSER: this.authserv.currentUserValue.SAPUSER
    }
    save.push(lclobjinner);
    let todo = { DATA: JSON.stringify(save) };
    this.apiserv.postGEN(todo, 'UPDATE_PSTRACKER').subscribe(item => {
      this.apiserv.messagesBS.next('All Done')
    })
  }
  saveTrack() {

  }

  getWeek(date, dowOffset) {
    /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

    dowOffset = typeof (dowOffset) == 'number' ? dowOffset : 0; //default dowOffset to zero
    var newYear = new Date(date.getFullYear(), 0, 1);
    var day = newYear.getDay() - dowOffset; //the day of week the year begins on
    day = (day >= 0 ? day : day + 7);
    var daynum = Math.floor((date.getTime() - newYear.getTime() -
      (date.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1;
    var weeknum;
    //if the year starts before the middle of a week
    if (day < 4) {
      weeknum = Math.floor((daynum + day - 1) / 7) + 1;
      if (weeknum > 52) {
        let nYear = new Date(date.getFullYear() + 1, 0, 1);
        let nday = nYear.getDay() - dowOffset;
        nday = nday >= 0 ? nday : nday + 7;
        /*if the next year starts before the middle of
          the week, it is week #1 of that year*/
        weeknum = nday < 4 ? 1 : 53;
      }
    }
    else {
      weeknum = Math.floor((daynum + day - 1) / 7);
    }
    return weeknum;
  };
  showHelp(textsin){
    this.helpline = this.apiserv.getHelptexts(textsin); 
    this.helper2.helpopen({title:'Progress', helptext:this.helpline.LINE1}) 
    // = !this.helper;
    // this.hlptxt = this.helper? 'Hide Help' : "Show Help";
    }
}
