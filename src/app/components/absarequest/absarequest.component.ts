import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, NgForm } from '@angular/forms'
import { ActivatedRoute, PreloadingStrategy, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ApidataService } from 'src/app/_services/apidata.service';
import { AuthService } from 'src/app/_services/auth.service';
import { formatDate, Location } from '@angular/common';
import { ModalService } from 'src/app/_modal/modal.service';
import { dateset } from 'src/app/_classes/dateset';
import { GenPdfService } from 'src/app/_services/gen-pdf.service';
import { absareq } from 'src/app/_classes/absareq';
import { DialogService } from 'src/app/_services/dialog.service';

@Component({
  selector: 'app-absarequest',
  templateUrl: './absarequest.component.html',
  styleUrls: ['./absarequest.component.css']
})
export class AbsarequestComponent implements OnInit, OnDestroy {
  @Input() edit: boolean = true;
  @ViewChild('reqForm', { static: true }) ngForm: NgForm;

  formChangesSubscription: Subscription;
  varioussites = false;
  //  edit = true;
  editdetail = false;
  replytext = '';
  hlptxt = 'Show help';
  helper=false;
  helpline = this.apiserv.getHelptexts('REQUIRMENTS');
  taskedit = false;
  vm = {}
 
  requestForm = new FormGroup({
  

    // varioussites: new FormControl(this.varioussites)
  })
  taskForm = new FormGroup({
    DATESENT: new FormControl(),
    ACTIONTYPE: new FormControl(),
    DELEGATENAME: new FormControl(),
    INSTRUCTION: new FormControl(),
    DUEDATE: new FormControl(),
    DUETIME: new FormControl(),
    DECISION: new FormControl(),
    COMMENT: new FormControl(),
  })
  // location: Location;
  regions = [];
  pmlist = [];
  stable = false;
  tasksub: Subscription;
  curreqsub: Subscription;
  tabindex = 0;
  tasks = [];
  task = {};
  reqno = '';
  reqdates: dateset;
  eventsSubject: Subject<void> = new Subject<void>();
  provregions = [];
  options = [];
  sectionid = [true, true, true, true, true];
  grouplines = [];
  groupoptions = [];
  filteredOptions: Observable<{ linename: string, tag: string, lineout: string }[]>;
  closeResult: string;
  request = {
    request: {},
    funding: {},
    // dates: {},
    comments: [{}],
    documents: [{}],
    tasks: [{}],
    edit: {
      request: true,
      funding: 'basic',
      dates: true,
      comments: true,
      documents: true
    }
  };
  actlist = [
    { A: 'type 1', B: 'FEASTECH', C: 'Technical Feasibilty' },
    { A: 'type 2', B: 'FINTECH', C: 'Financial Feasibilty' },
    { A: 'type 3', B: 'APPCREATE', C: 'Create Appropriation Request' },
    { A: 'type 4', B: 'FUNDING', C: 'Funding Allocation' }
  ]
  constructor(public apiserv: ApidataService,
    private authserv: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private pdfserv: GenPdfService,
    // private dateserv: DatePlanningService,
    // private modalService: NgbModal,
    private location: Location,
    private modalServicejw: ModalService, 
    private helper2: DialogService) { }

  ngOnInit(): void {
    // this.requestForm.disable();
    this.formChangesSubscription = this.ngForm.form.valueChanges.subscribe(x => {
      // console.log(x);
    })
    this.addFunder();
    this.reqno = this.route.snapshot.paramMap.get('id');

    if (this.reqno >= '60000000') {
      this.existingReq(this.reqno);
      this.location.replaceState(this.location.path().split('?')[0], '');
    } else {
      this.request.request = this.blankRequest();
      // this.reqdates = this.dateserv.getblankDates();
      this.putFormValues();
    }

    this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.edit = params['view'] ? false : true;
        this.request.edit.request = (params['view'] || !this.edit) ? false : true;
        this.request.edit.dates = (params['view']) ? false : true;
        this.request.edit.funding = (params['fund']) ? 'full' : 'basic';
      });
    // this.apiserv.postGEN({MASK:''},'GET_PMLIST').subscribe(list =>{
    this.pmlist = this.apiserv.pmlist;
    // this.addaSite();

    // this.filteredOptions = this.requestForm.controls.cipname.valueChanges.pipe(
    //   startWith(''),
    //   map((value: any) => this._filter(value || '')),
    // );

    // this.apiserv.cipgrouplines$.subscribe(inner => {
    //   this.grouplines = inner
    // })
    // this.apiserv.cipgroupoptions$.subscribe(inner => {
    //   this.groupoptions = inner
    // })

    this.onChanges();
   
  }
  disabled() {
    return true;
  }

  goPlan(){
   // this.router.navigate(['relink/planner'])
  }
  ngOnDestroy() {
    if (this.tasksub) { this.tasksub.unsubscribe() };
    if (this.curreqsub) { this.curreqsub.unsubscribe(); }
    this.formChangesSubscription.unsubscribe();
  }

  get funders(): FormArray {
    return this.requestForm.get("funders") as FormArray
  }
  get sites(): FormArray {
    return this.requestForm.get("sites") as FormArray
  }

  addTask() {
    let lclobj = {
      LINKEDTYPE: 'BT',
      SENTBY: this.authserv.currentUserValue.EMAIL.toLocaleUpperCase(),
      LINKEDOBJNR: this.request.request['ABSAREQNO']
    }
    this.apiserv.postGEN(lclobj, 'NEW_TASKREQUEST').subscribe(reply => {
      const lctask = JSON.parse(JSON.stringify(reply.RESULT));
      this.tasks.push(lctask)
      this.editTask(lctask);
      this.taskedit = true;
      this.task = lctask;
      this.emitEventToChild();
    })
  }
  editTask(task: any) {
    this.task = task;
    this.taskForm.get('DUEDATE').patchValue(task.DUEDATE, { emitEvent: false });
    this.taskForm.get('DUETIME').patchValue(task.DUETIME, { emitEvent: false });
    this.taskForm.get('INSTRUCTION').patchValue(task.INSTRUCTION, { emitEvent: false });
    this.taskForm.get('DATESENT').patchValue(task.DATESENT, { emitEvent: false });
    this.taskForm.get('DELEGATENAME').patchValue(task.DELEGATENAME, { emitEvent: false });
    this.taskForm.get('COMMENT').patchValue(task.COMMENT, { emitEvent: false });
    this.editdetail = true;
  }
  taskClose(reply){
    if  (reply =='cancel'){
     let metemp = this.tasks.pop();
      
    }
    this.taskedit = false;
  }
  tabChanged(event) {
    this.helper = false;
    // tbil - useful for - do you want to save
   // this.requestForm.get('title').disable();
  //  if (event.index == 7){
  //   this.apiserv.getProgresslist('','',this.reqno);
  //  this.router.navigate(['worklist'])
  //  }
  }
  backToList(){
   this.apiserv.getProgresslist('','',this.reqno);
   this.router.navigate(['worklist']) 
  }
  greaterThan(a, b) {
    return a > b
  }
  sectionToggle(idx) {
    this.sectionid[idx] = !this.sectionid[idx];
  }
  emitEventToChild() {
    this.eventsSubject.next();
  }
  newSite(): FormGroup {
    return this.fb.group({
      oneview: '',
      knownas: '',
      startdate: '',
      enddate: '',
      ourpo:'',

    })
  }
  addaSite() {
    //   this.sites.push(this.newSite());
    //  this.varioussites =  this.sites.length > 1 ? true : false 
  }
  removeSite(index = -1) {
    if (index >= 0) {
      this.sites.removeAt(index);
      this.varioussites = this.sites.length > 1 ? true : false
    }
  }
  newFunder(): FormGroup {
    return this.fb.group({
      funderposition: '',
      amount: '',
    })
  }
  addFunder() {
    // this.funders.push(this.newFunder());
    //  this.varioussites =  this.sites.length > 1 ? true : false 
  }
  removeFunder(index = -1) {
    if (index >= 0) {
      this.funders.removeAt(index);
      this.varioussites = this.sites.length > 1 ? true : false
    }
  }
  setVarious() {
    this.varioussites = !this.varioussites;
    if (this.varioussites) {
      this.modalServicejw.open("multisite");
    } else {
      if(confirm("Are you sure to delete ")) {
        // console.log("Implement delete functionality here");
      }
    }
  }
  existingReq(reqno) {
    this.curreqsub = this.apiserv.currentreq$.subscribe(creq => {
      if (creq['ABSAREQNO'] >= '60000000') {
        this.vm = { ...creq };
        this.apiserv.currentprojBS.next(creq);
        // if (this.request.request['DATES'].length > 20) {
        //   this.apiserv.currentdates = JSON.parse(atob(this.request.request['DATES']))
        // } else {
        //   this.apiserv.currentdates = this.dateserv.getblankDates();
        //   this.apiserv.currentdates.DATE06 = this.request.request['PROPSTARTDATE'];
        //   this.apiserv.currentdates.DATE07 = this.request.request['PROPENDDATE'];
        // }
        // this.reqdates = this.apiserv.currentdates;
        // this.apiserv.currentreqdatesBS.next([JSON.parse(atob(this.request.request['DATES']))]);
      //  this.putFormValues();
      //   this.requestForm.get('cipname').setValue(this.request.funding['CIPCODE'] + ':' + this.request.funding['CIPNAME'], { emitEvent: false });
        this.stable = true;
      }
    });
  }
  someDateChange(msg = '') {
    this.requestForm.get("propstartdate").setValue(this.reqdates.DATE06, { emitEvent: false });
    this.requestForm.get("propenddate").setValue(this.reqdates.DATE07, { emitEvent: false });
  }
  someTaskChange(task) {
    Object.assign(this.task, task);

  }
  openTasks() {
    this.openjw('feasibilitymodal')
  }
  someChange(type = '?') {
    if (type == 'close') {
      this.editdetail = false;
    }
  }
  putFormValues() {
    Object.keys(this.requestForm.controls).forEach(key => {
      let innerkey = key.toUpperCase();
      if (this.request.request[innerkey]) {
        
        this.requestForm.get(key).setValue(this.request.request[innerkey], { emitEvent: false });
    
      }
    })
    if (!this.request.edit.request) { this.requestForm.disable() };
    this.requestForm.get('forecast_start').setValue(this.formatDate(this.request.request['FORECAST_START']), { emitEvent: false } );
    this.requestForm.get('forecast_end').setValue(this.formatDate(this.request.request['FORECAST_END']) , { emitEvent: false });

    this.requestForm.get('clientapproval').setValue(this.formatDate(this.request.request['CLIENTAPPROVAL']) );
    // if( this.requestForm.value.oneview?.length < 3 && this.requestForm.value.buildingid?.length > 5 ){
      
    //     this.apiserv.postGEN({ a: '', B: this.requestForm.value.buildingid, C: '', D: 'site' }, 'GET_LOOKUPS').subscribe(reply => {
    //       this.requestForm.get('knownas').patchValue(reply.RESULT[0].B, { emitEvent: false });
    //       this.requestForm.get('oneview').patchValue(reply.RESULT[0].A, { emitEvent: false });
    //     })
    // }
   
   
  }
 
  checkReady(level = '') {
    switch (level) {
      // case 'approve': {
      //   return this.sectionid == 4 && this.request['STATUS'] === 'STEP20'
      // }
      case 'savenew': {
      let returnmsg =  (this.vm['TITLE'] && this.vm['TITLE'].length > 10 && 
        this.vm['DETAILS'].length > 15 
         && this.vm['PROPSTARTDATE'] 
         && this.vm['PROPENDDATE'] 
         && this.vm['REGION']) ? true: false;
         return returnmsg;
        break;
      }
      case 'save': {
        return this.vm['TITLE'] && this.vm['TITLE'].length > 10 && 
        this.vm['DETAILS'].length > 15 ;
        break;
      }
      default: {
        return false;
      }
    }

  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.tag.toLowerCase().includes(filterValue));
  }
  onGroupSelect() {
    this.options = this.grouplines.filter(line => {
      return line.linename.substring(0, 17) == this.requestForm.value.cipgroup.substring(0, 17);
    })
  }
  // onNext() {
  //   this.sectionid = this.sectionid < 4 ? this.sectionid + 1 : 1;
  // }
  // onBack() {
  //   this.sectionid = this.sectionid > 1 ? this.sectionid - 1 : 1;
  // }
  onSave() {

  }
  onSubmit() {
    // this.child.submitData();
   let tempobj = {};
    if (this.request.request['ABSAREQNO'] < '10000000' ) {
    let propstartdate = new Date(this.vm['PROPSTARTDATE'])
    let propenddate = new Date(this.vm['PROPENDDATE'])
    let startdate = propstartdate.getFullYear() +
      this.padStr(propstartdate.getMonth() + 1) +
      this.padStr(propstartdate.getDate());
    let enddate = propenddate.getFullYear() +
      this.padStr(propenddate.getMonth() + 1) +
      this.padStr(propenddate.getDate());
    tempobj = {
      TITLE: this.apiserv.xtdbtoa(this.vm['TITLE']),
      DETAILS: this.apiserv.xtdbtoa(this.vm['DETAILS']),
      REGION: this.vm['REGION'],
      PROPSTARTDATE: startdate,
      PROPENDDATE: enddate,
      SAPUSER: this.authserv.currentUserValue.SAPUSER,
      RETROSPECTIVE: this.vm['RETROSPECTIVE'],
      EPRIORITY: this.vm['EPRIORITY']
    }
  }
    const modeltosap =  (this.vm['ABSAREQNO'] > '10000000' ) ? this.mapFormtoSAP(): tempobj;
    if (this.vm['ABSAREQNO'] > '10000000' ) {
    this.apiserv.postGEN(modeltosap, 'NEW_PROJREQUEST').subscribe(reply => {
      this.apiserv.messagesBS.next(this.replytext + JSON.parse(reply.RESULT).ABSAREQNO);
      
    })
  } else {
    this.apiserv.postGEN(modeltosap, 'NEW_PROJREQUEST').subscribe(reply => {
      this.apiserv.messagesBS.next(this.replytext + JSON.parse(reply.RESULT).ABSAREQNO);
      this.redirectTo('/requestedit~'+JSON.parse(reply.RESULT).ABSAREQNO);
    })
  }
  }
  public async openPDF() {
  await  this.pdfserv.Build_pdf(this.request.request['ABSAREQNO'] );
    
    return;
  }
  redirectTo(uri:string){
    this.router.navigate(['relink' + uri ]);
 }
  mapFormtoSAP() {
    if (!this.vm['PROPSTARTDATE'] || !this.vm['TITLE']) {
      this.apiserv.messagesBS.next('Error! Need Start Date and Title');
      return;
    }
    let propstartdate = new Date(this.vm['PROPSTARTDATE'])
    let propenddate = new Date(this.vm['PROPENDDATE'])
    let startdate = propstartdate.getFullYear() +
      this.padStr(propstartdate.getMonth() + 1) +
      this.padStr(propstartdate.getDate());
    let enddate = propenddate.getFullYear() +
      this.padStr(propenddate.getMonth() + 1) +
      this.padStr(propenddate.getDate());
      let modeltosap = {};
      const control = this.blankRequest();
for (const p in control){
    modeltosap[p] = p in this.vm ? this.vm[p]: '';
}
    
    if (this.vm['ABSAREQNO'] >= '60000000') {
      this.replytext = 'Request Modified ';
    } else {
      this.replytext = 'New Request Created ';
      modeltosap['CREATEDBY'] = this.authserv.currentUserValue['EMAIL'];
     // this.apiserv.currentreqBS.next([modeltosap1])
    }
   // this.reqdates['REFERENCE'] = this.request.request['ABSAREQNO'];
    // let lclobj = {}
    // for (const key in this.requestForm.value ) {
    //   let field = key.toUpperCase();
    //   lclobj[field] = this.requestForm.value[key];
    // }


        modeltosap['STITLE'] = this.encodeTxt( modeltosap['TITLE']) ;
        modeltosap['BACKGROUND'] = this.encodeTxt( modeltosap['BACKGROUND'] ); 
        modeltosap['SITENOTES'] = this.encodeTxt(  modeltosap['SITENOTES']);
        modeltosap['SKNOWNAS'] = this.encodeTxt( modeltosap['KNOWNAS'] );
        modeltosap['DETAILS'] = this.encodeTxt(  modeltosap['DETAILS']);
        // modeltosap['PROPSTARTDATE'] = this.encodeTxt( startdate,
        // modeltosap['PROPENDDATE'] = this.encodeTxt( enddate,
        modeltosap['SITES'] = this.encodeTxt(  modeltosap['SITES'] );
        modeltosap['APPROVAL_MOTIVATE'] = this.encodeTxt( modeltosap['APPROVAL_MOTIVATE'] );
        modeltosap['APPROVAL_NOTE'] = this.encodeTxt( modeltosap['APPROVAL_NOTE'] );
        // modeltosap['APPROVAL_STATUS'] = this.encodeTxt( this.requestForm.value.approval_status,
        // modeltosap['APPROVAL_SUBMITDATE'] = this.encodeTxt( this.requestForm.value.approval_submitdate,
        // modeltosap['APPROVAL_DATE'] = this.encodeTxt( this.requestForm.value.approval_date,
        // modeltosap['APPROVAL_AMT'] = this.encodeTxt( this.requestForm.value.approval_amt,
        // modeltosap['APPROVAL_NOTE '] = this.encodeTxt( this.apiserv.xtdbtoa(this.requestForm.value.approval_note + ' '),

        // modeltosap['DATES'] = this.encodeTxt( JSON.stringify(this.reqdates),

        // modeltosap['FCAST_START'] = this.encodeTxt( this.requestForm.value.fcast_start,
        // modeltosap['FCAST_END'] = this.encodeTxt( this.requestForm.value.fcast_end,
      
    
    return modeltosap;
  }

  encodeTxt(field: string){
    if (field && field.length > 0){
    return  this.apiserv.xtdbtoa(field)
    } else {
      return '';
    }
  }
  padStr(i) {
    return (i < 10) ? "0" + i : "" + i;
  }

savePhases() {
  this.apiserv.pushFeedback() ;
}
  blankRequest(){
    // this.apiserv.currentdates = this.dateserv.getblankDates('PRABSAP');
    return {
      ABSAREQNO: '',
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
      BASELINEBUDGET: 0,
      APPROVAL_MOTIVATE: '',
      APPROVAL_STATUS: '',
      APPROVAL_SUBMITDATE: '',
      APPROVAL_DATE: '',
      APPROVED_AMT: '',
      CONTINGENCY:'',
      APPROVAL_NOTE: '',
      DATES: '',
      APPRO_REQUEST: '',
      FUNDINGSUMMARY: '',
      PONUMBER: '',
      PHASE: '',
      FCAST_START: '',
      FCAST_END: '',
      PORTFOLIOMGR: '',
      ACCOUNTANT: '',
      INITIATIVE: '',
      APPROVALTOLEGAL: '',
      APPROVEDBYLEGAL: '',
      APPTOBFMLEGAL: '',
      APPBYBFMLEGAL: '',      
      POVALUE:0,
      PODATE:'',
      TRACKERCODE: '',
    }
  }
  lessThan(a, b) {
    return a < b;
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
  onChanges() {
    this.requestForm.valueChanges.subscribe(val => {
      // this.reqdates.DATE06 = this.formatDate(val.propstartdate);
      // this.reqdates.DATE07 = this.formatDate(val.propenddate)
      // let newdates = this.dateserv.updatePlans(this.reqdates);
      // Object.assign(this.reqdates, newdates)
      this.emitEventToChild();
    })
   
    this.taskForm.valueChanges.subscribe(val => {
      let lcob = {};
      for (const key in val) {
        this.task[key] = val[key]
        if (key === 'ACTIONTYPE') {
          lcob = this.apiserv.actionlist.find(obj => {
            return obj.code === val[key]
          });

        }
      }
      if (!this.task['INSTRUCTION']) {
        this.task['INSTRUCTION'] = lcob['instruction']
        this.taskForm.get('INSTRUCTION').patchValue(lcob['instruction'], { emitEvent: false });
      }
    })
  }
  onChange(){
        // let siteArr = <FormArray>this.requestForm.controls["sites"];

      if (this.vm['ONEVIEW'].length === 6 && this.vm['ONEVIEW'].substring(5, 6) == 'X') {
        this.apiserv.postGEN({ a: '', B: this.vm['ONEVIEW'], C: '', D: 'site' }, 'GET_LOOKUPS').subscribe(reply => {
          this.vm['KNOWNAS']=reply.RESULT[0].B
          this.vm['BUILDINGID'] = reply.RESULT[0].C;
        })
      }
  }
  openjw(modalname) {
    this.modalServicejw.open(modalname)
  }
  closejw(modalname) {
    this.modalServicejw.close(modalname)
  }
  open(content) {
    // if (content == 'commentmodal') {
    // this.apiserv.getCommentList(this.reqno);
    // // }
    // this.reqdates.DATE06 = this.formatDate(this.requestForm.value.propstartdate);
    // this.reqdates.DATE07 = this.formatDate(this.requestForm.value.propenddate)
    // this.emitEventToChild();
    // this.modalService.open(content, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });
  }
  private getDismissReason(reason: any): string {
  
    return '';
  }
  showHelp(textsin){
    this.helpline = this.apiserv.getHelptexts(textsin);
    this.helper2.helpopen({title:'Requirements', helptext:this.helpline.LINE1}) 
    // = !this.helper;
    // this.hlptxt = this.helper? 'Hide Help' : "Show Help";
    }
}
