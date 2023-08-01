import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { ApidataService } from 'src/app/_services/apidata.service';
import { AuthService } from 'src/app/_services/auth.service';
import { ModalService } from 'src/app/_modal';
import * as XLSX from 'xlsx';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-fundcipline',
  templateUrl: './fundcipline.component.html',
  styleUrls: ['./fundcipline.component.css']
})
export class FundciplineComponent implements OnInit, OnDestroy {
  pmForm = new FormGroup({
    pmanager: new FormControl(''),
    region: new FormControl('*'),
    budgetgroup: new FormControl(['*']),
    cipgroup: new FormControl(['*']),
    cipcode: new FormControl(['*']),
    status: new FormControl(['*']),
    site: new FormControl(['*']),
    workstream: new FormControl(['*'])
  })
  searchlist = [];
  sections: any;
  currentitemBS = new BehaviorSubject({})
  filters ={
    // pmlist:{fieldname:'pmanager', codes:[],selected:['*'],type:'s',temp:[]},
    regions:{fieldname:'region', codes:[],selected:['*'],type:'s',temp:[]},
    cipgroups:{fieldname:'cipgroup', codes:[],selected:['*'],type:'m',temp:[]},
    cipcodes:{fieldname:'cipcode', codes:[],selected:['*'],type:'m',temp:[]},
    // status:{fieldname:'status', codes:[],selected:['*'],type:'m',temp:[]},
    sites:{fieldname:'site', codes:[],selected:['*'],type:'m',temp:[]},
    workstream:{fieldname:'workstream', codes:[],selected:['*'],type:'m',temp:[]}
  };
  // { code: '*', text: '* Select All' },
  //   { code: 'DRAFT', text: 'Draft' },
  //   { code: 'REQUEST', text: 'Formal Request' },
  //   { code: 'QUOTED', text: 'In Approval Phase' },
  //   { code: 'EXECUTION', text: 'In Execution' },
  //   { code: 'CLOSED', text: 'Closed or Cancelled' }
 
  searchbox = '';
  pmlist = [];
  regions = [];
  funding = true;
  cipgroups = [];
  cipcodes = [];
  currentposnr = '00000000';
  currentfield = 'status';
  amountclaimed = 0;  
  searchlistnew = [];
  printing = false;
  currentpsid = '';
  selectedAll = false;
  scopes = [];
  approvals=[];
  boqs = [];
  costs = [];
  pos = [];
  invsubs = [];
  implements = [];
  risks = [];
  changelist = [];
  comments = false;
  item = {};
  destroy$ = new Subject();
  fileName =' tracklist.xlsx';
  todo = '';
  constructor(private authserv: AuthService,
     public apiserv: ApidataService,  public modalServicejw: ModalService,
     private router: Router) {
      this.sections = [
        { name: 'CIP2023', selected: true },
        { name: 'OPEX', selected: true },
        { name: 'ROL2022', selected: true },
        { name: 'RXL2022', selected: true },
        { name: 'UNKNOWN', selected: true },
  
      ]
      }

  ngOnInit(): void {
// Regional filter for ciplines - these are the funding lines and as the year goes by the data becomes complicated

this.resetFilters();
    
    this.pmForm.get('region').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.searchlist = [];
     this.resetFilters();
      this.apiserv.getCIPList(' ', value);
    })
     this.apiserv.ciplistBS.pipe(takeUntil(this.destroy$)).subscribe(reply=>{
      this.resetSearchlist()
    })
    if (this.implements.length < 1) this.apiserv.getProgLookups();
    this.apiserv.lookupsreadyBS.pipe(takeUntil(this.destroy$)).subscribe( rep => {
  
     this.scopes = this.apiserv.scopes;
     this.boqs =  this.apiserv.boqs;
     this.costs =  this.apiserv.costs;
     this.pos =  this.apiserv.pos;
     this.invsubs =  this.apiserv.invsubs;
     this.implements =  this.apiserv.implements;
     this.risks =  this.apiserv.risks;
    //  this.filters.cipcodes.codes = this.apiserv.cipcodes;
    this.regions = [];
    //  this.filters.cipgroups = this.apiserv.cipgroups;
      })
    if (this.authserv.currentUserValue.REGION?.length > 2 ) {
      this.pmForm.get('region').setValue(this.authserv.currentUserValue.REGION);
    }
    this.pmForm.get('cipgroup').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.searchlistnew = this.searchlist.filter(linex=> {
        return ( ( linex.cipgroup == value || value.length < 1 )
          && ( linex.cipcode == this.pmForm.value.cipcode || this.pmForm.value.cipcode.length < 1  ) )
      });

    })
    this.pmForm.get('cipcode').valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.searchlistnew = this.searchlist.filter(linex=> {
        return (( linex.cipcode == value || value.length < 1 )
         && ( linex.cipgroup == this.pmForm.value.cipgroup || this.pmForm.value.cipgroup.length < 1  ))
      });

    })



  }
 ngOnDestroy(): void {
   this.destroy$.next();
    this.destroy$.complete();
 }

  buildSearchCodes(){

   if(this.searchlistnew.length > 0 ) {
    let filterkeys = Object.keys(this.filters);
    filterkeys.forEach( keyline=> {
      this.filters[keyline].codes = [{code:'*',text:'* Select All', selected:false}]
      this.filters[keyline].temp = [];
    })
    this.searchlistnew.forEach(listline=> {
     filterkeys.forEach( keyline=> {
      if (! this.filters[keyline].temp.includes(listline[this.filters[keyline].fieldname])){
      this.filters[keyline].temp.push(listline[this.filters[keyline].fieldname]);
      this.filters[keyline].codes.push({code:listline[this.filters[keyline].fieldname],text:listline[this.filters[keyline].fieldname], selected: false});
      }
     })
    })
   }
   if (this.authserv.currentUserValue.NAME_LAST == 'Thomson'){
   this.filters.regions.codes = this.apiserv.regions ;
   }
  }
  resetSearchlist(){
    this.searchlist = [];
     this.searchlist = this.apiserv.ciplistBS.value.map(line => {
          return {
          reference: (line.PROJLINK.length > 2)? line.PROJLINK : line.INITIATIVE? line.INITIATIVE :line.ABSAREQNO,
          initiative: line.INITIATIVE? line.INITIATIVE :line.ABSAREQNO,
          title: line.TITLE,
          scope: line.SCOPE || '0%',
          boq: line.BOQ  || '0%',
          costs: line.COSTS  || '0%',
          OHSRisk: line.OHSRISK,
          approval: line.CLIENTAPPROVAL,
          absaPO: line.PO  || '0%',
          forecaststart: line.DATE06,
          forecastend: line.DATE07,
          cashflowdate: line.DATE10,
          implement: line.IMPLEMENT  || '0%',
          practicalcomp: line.PPRACT_COMPLETE,
          invsubmitted: line.INVSUBMITTED  || '0%',
          progress: '',
          pmanager: line.PMANAGER,
          status: line.STATUS,
          site: line.CATEGORY == 'POOL'? 'POOL':line.ONEVIEW,
          knownas: line.KNOWNAS,
          region: line.REGION,
          cipcode: line.CIPCODE,
          cipline: line.IM_POSITION,
          cipgroup:line.CIPGROUP,
          workstream:line.WORKSTREAM,
          quotation: line.QUOTATION, claiming: 0,
          cipbudget: line.CIPLINEBUDGET || 0,
          estimatedbudget: line.APPROVED_AMT || 0,
          available: Math.floor(( line.BUDGETDIF ) * 100) /100 ,
          ponumber: line.PONUMBER,
          costfee : line.COSTFEE || 0,
          travel: line.TRAVEL || 0,
          commitment: line.COMMITMENT || 0,
          revenue: line.REVENUE || 0,
          m_fee: line.M_FEE || 0,
          budgetgroup: line.BUDGETGROUP,
          category: line.CATEGORY,
          tag: line.INITIATIVE + ' ' + line.PROJLINK + ' ' + line.ONEVIEW + ' ' +  line.TITLE + ' ' + line.BUDGETGROUP + ' ' + line.PONUMBER + ' ' + line.CIPLINEBUDGET + line.KNOWNAS  + ' ' + line.CATEGORY
        }
      })
      // this.searchlist.forEach(item => {
      //   let numberans = parseInt(item.scope.slice(0,-1)) * 5 +
      //   parseInt(item.boq.slice(0,-1)) * 2.5 +
      //   parseInt(item.costs.slice(0,-1)) * 2.5  +
      //   parseInt(item.approval.slice(0,-1)) * 5  +
      //   parseInt(item.implement.slice(0,-1)) * 65  +
      //   parseInt(item.invsubmitted.slice(0,-1)) * 7.5  ;
      //   numberans = numberans / 100;
      //   let myanswer = numberans.toString() + '%';
      //   item.progress = myanswer;
      // })
      this.searchlistnew = this.searchlist;

     //  this.buildSearchCodes();
  }
  resetFilters() {
   
    // this.pmForm.get('region').setValue(this.authserv.currentUserValue.REGION, { emitEvent: false });
    this.pmForm.get('cipcode').setValue('', { emitEvent: false });
    this.pmForm.get('cipgroup').setValue('', { emitEvent: false });
    // this.pmForm.get('status').setValue(['*'], { emitEvent: false });
    // this.pmForm.get('site').setValue(['*'], { emitEvent: false });
    // this.pmForm.get('workstream').setValue(['*'], { emitEvent: false });
    // // this.filters.cipcodes = this.apiserv.cipcodes
    // this.filters.regions.codes = this.apiserv.regions
    // // this.filters.cipgroups = this.apiserv.cipgroups
    // this.buildSearchCodes();
  }
  formatDate(datein = '00000000'){
    datein = datein.replace(/-/g,'')
    return datein.slice(0,4) +'-' + datein.slice(4,6) + '-' + datein.slice(6,8)
  }
  checkChange() {
   return  this.changelist.length > 0? 'Ignore Changes and Close' : 'Close'
  }

  showHelp() {
    this.modalServicejw.open('helptext')
  }
  openjw(thefield = 'ABSAREQNO') {
    if (thefield == 'areyousure') {
      this.modalServicejw.open('areyousure')
    } else {
    this.currentfield = thefield.toUpperCase();
    this.modalServicejw.open('selections')
    }
  }
 
  closejw(modalname = 'selections') {

    // if (modalname == 'areyousure'){
    //   this.createNew();
    //   return;
   // }
    let filterkeys = Object.keys(this.filters);   
    this.searchlistnew = this.searchlist.filter(originalline=>{
      let ans = true;
for (let x = 0; x < filterkeys.length; x++){
  let thisfilter = filterkeys[x];
  if (this.filters[thisfilter].type == 's'){
    if (!(this.pmForm.value[this.filters[thisfilter].fieldname] == (originalline[this.filters[thisfilter].fieldname]) || 
    this.pmForm.value[this.filters[thisfilter].fieldname] == '*')) {
      x = 1000;
       ans = false
      
  } } else {
  if (!(this.pmForm.value[this.filters[thisfilter].fieldname].includes(originalline[this.filters[thisfilter].fieldname]) || 
 (this.pmForm.value[this.filters[thisfilter].fieldname].length ==1 && this.pmForm.value[this.filters[thisfilter].fieldname].includes('*')))) {
    x = 1000;
    ans = false
  }
}}
return ans;
    })
   
    filterkeys.forEach( keyline=> {
      this.filters[keyline].codes = [{code:'*',text:'* Select All'}]
      this.filters[keyline].temp = [];
    })
    this.searchlistnew.forEach(listline=> {
     filterkeys.forEach( keyline=> {
      if (! this.filters[keyline].temp.includes(listline[this.filters[keyline].fieldname])){
      this.filters[keyline].temp.push(listline[this.filters[keyline].fieldname]);
      this.filters[keyline].codes.push({code:listline[this.filters[keyline].fieldname],text:listline[this.filters[keyline].fieldname]});
      }
     })
    })
    if (this.authserv.currentUserValue.NAME_LAST == 'Thomson'){
      this.filters.regions.codes = this.apiserv.regions ;
    }
    this.modalServicejw.close('selections')
  }
  checkAll(code = ''){
  // if (code == '*'){
  //   if( this.pmForm.value.cipgroup.includes('*')){
  //     this.pmForm.get('cipgroup').patchValue([this.pmForm.value.cipgroup.filter(l => {return l != '*'}),0])
  //   } else {
  //   this.pmForm.get('cipgroup').patchValue(['*'])
  // }}
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
      let tpro = [item.progress_1,item.progress_2,item.progress_3,item.progress_4,item.progress_5,
        item.progress_6,item.progress_7,item.progress_8,item.progress_9,item.progress_a,];
      let tdate = [item.fdates_1,item.fdates_2,item.fdates_3,item.fdates_4,item.fdates_5,
        item.fdates_6,item.fdates_7,item.fdates_8,item.fdates_9,item.fdates_a,];
      tosave.push({
        REFERENCE: item.reference,
        SCOPE: item.scope,
        BOQ: item.boq,
        COSTS: item.costs,
        RATING: item.OHSRisk,
        CLIENTAPPROVAL: item.approval,
        PO: item.absaPO,
        FORECAST_START: item.forecaststart,
        FORECAST_END: item.forecastend,
        // DONEBY: this.authserv.currentUserValue.SAPUSER,
        IMPLEMENT: item.implement,
        PPRACT_COMPLETE: item.practicalcomp,
        INVSUBMITTED: item.invsubmitted,
    //    PROGRESS: item.progress
      });
    })
    this.todo =  JSON.stringify(tosave);
    let todo = { DATA: JSON.stringify(tosave) };
    this.apiserv.postGEN(todo, 'UPDATE_PSTRACKER').pipe(takeUntil(this.destroy$)).subscribe(item => {
      this.apiserv.messagesBS.next('All Done')
      this.changelist = [];
    })
  }
  confirm(item) {
    this.currentitemBS.next(item);
    this.amountclaimed = 1;
    this.openjw('areyousure');
  }
  createNew(item){
      this.apiserv.postGEN({ABSAREQNO: item ['reference']},'COPY_CIPLINE').pipe(takeUntil(this.destroy$)).subscribe( rep=> {
      if (rep.RESULT.TYPE == 'E'){
        // console.log('Error')
      } else {
        this.router.navigate(['/requestedit/' + rep.RESULT.MESSAGE])
      }
    })
  }
  closeDialog() {
   // this.apiserv.projfeedbacklistBS.next([])
    // this.dialogRef.close();
  }
  trackById(index, item) {
    return item.reference + index.toString();
  }
  goTo(item: any) {
    this.apiserv.getCipline(item.initiative);
  //  this.showCipline = true;
   this.modalServicejw.open("cipline")
    // this.apiserv.getCommentList(item.reference)
    // this.item = item;
    // this.currentpsid = item.reference
    this.comments = true;

  }
  newValue($event, idx, item) {
    // item.scope = item.progress_1;
    // item.boq = item.progress_2;
    // item.costs = item.progress_2;
    // item.absaPO = item.progress_3;
    // item.implement = item.progress_6;
    // item.invsubmitted = item.progress_7
    if (this.changelist.indexOf(item.reference) === -1) {
      this.changelist.push(item.reference);
    }
    let numberans = parseInt(item.scope.slice(0,-1)) * 5 +
    parseInt(item.boq.slice(0,-1)) * 2.5 +
    parseInt(item.costs.slice(0,-1)) * 2.5  +
    parseInt(item.approval.slice(0,-1)) * 5  +
    parseInt(item.implement.slice(0,-1)) * 65  +
    parseInt(item.invsubmitted.slice(0,-1)) * 7.5  ;
    numberans = numberans / 100;
    this.amountclaimed = 0;
    this.searchlistnew.forEach(line => {
      if (this.changelist.indexOf(line.reference) != -1) {
       this.amountclaimed += parseFloat(line.claiming);
      }
    })
    // if (item.approval){
    //   numberans = numberans + 10;
    //   this.approvalweek = 'Week ' + this.getWeek(new Date(item.approval),0).toString();
    // }
    // if (item.practicalcomp){
    //   numberans = numberans + 2.5;
    //   this.practicalweek = 'Week ' + this.getWeek(new Date(item.practicalcomp),0).toString();
    // }
    let myanswer = numberans.toString() + '%';
    item.progress = myanswer;
  }
  exportexcel(): void
  {
    this.printing = true;
    /* pass here the table id */
    let element = document.getElementById('tracklist');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
    /* save to file */  
    XLSX.writeFile(wb, this.fileName);
 this.printing = false;
  }

filterme(){
  let filterkeys = Object.keys(this.filters);   
  this.searchlistnew = this.searchlist.filter(originalline=>{
    let ans = true;
for (let x = 0; x < filterkeys.length; x++){
let thisfilter = filterkeys[x];
if (this.filters[thisfilter].type == 's'){
  if (!(this.pmForm.value[this.filters[thisfilter].fieldname] == (originalline[this.filters[thisfilter].fieldname]) || 
  this.pmForm.value[this.filters[thisfilter].fieldname] == '*')) {
    x = 1000;
     ans = false
    
} } else {
if (!(this.pmForm.value[this.filters[thisfilter].fieldname].includes(originalline[this.filters[thisfilter].fieldname]) || 
(this.pmForm.value[this.filters[thisfilter].fieldname].length ==1 && this.pmForm.value[this.filters[thisfilter].fieldname].includes('*')))) {
  x = 1000;
  ans = false
}
}}
return ans;
  })
 
  filterkeys.forEach( keyline=> {
    this.filters[keyline].codes = [{code:'*',text:'* Select All'}]
    this.filters[keyline].temp = [];
  })
  this.searchlistnew.forEach(listline=> {
   filterkeys.forEach( keyline=> {
    if (! this.filters[keyline].temp.includes(listline[this.filters[keyline].fieldname])){
    this.filters[keyline].temp.push(listline[this.filters[keyline].fieldname]);
    this.filters[keyline].codes.push({code:listline[this.filters[keyline].fieldname],text:listline[this.filters[keyline].fieldname]});
    }
   })
  })
  if (this.authserv.currentUserValue.NAME_LAST == 'Thomson'){
    this.filters.regions.codes = this.apiserv.regions ;
  }
  this.modalServicejw.close('selections')

}
checkIfAllSelected() {
  var totalSelected = 0;
  for (var i = 0; i < this.sections.length; i++) {
    if (this.sections[i].selected) totalSelected++;
  }
  this.selectedAll = totalSelected === this.sections.length;

  return true;
}
selectAll() {
  this.selectedAll = !this.selectedAll;

  for (var i = 0; i < this.sections.length; i++) {
    this.sections[i].selected = this.selectedAll;
  }
}
}

