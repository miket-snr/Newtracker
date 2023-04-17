import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalService } from 'src/app/_modal';
import { ApidataService } from 'src/app/_services/apidata.service';
import { AuthService } from 'src/app/_services/auth.service';
import * as XLSX from 'xlsx';

interface Dropentries{
  code: string;
  text:string;
}
interface Filter {
field: string;
selecttype: string;
title: string;
selection: string[];
listof: Dropentries[];

}
@Component({
  selector: 'app-absabudget',
  templateUrl: './absabudget.component.html',
  styleUrls: ['./absabudget.component.css']
})
export class AbsabudgetComponent implements  OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  fileName = 'Budget.xlsx';
  sections: any;
  title = '';
  drops: Dropentries[];
  filters ={
    pmlist:[],
    regions:[],
    cipgroups:[],
    cipcodes:[],
    status:[{ code: '*', text: '* Select All' },
    { code: 'DRAFT', text: 'Draft' },
    { code: 'REQUEST', text: 'Formal Request' },
    { code: 'QUOTED', text: 'In Approval Phase' },
    { code: 'EXECUTION', text: 'In Execution' },
    { code: 'CLOSED', text: 'Closed or Cancelled' }
  ],
    site:[],
    workstream:[]
  };
  selectedAll = true;
  selectedNames: any;
  todaydate = this.apiserv.formatDate(new Date());
  searchbox = '';
  pmlist = [];
  grouplist = [];
  budgetview: any;
  regions = [];
  cipgroups = [];
  cipcodes = [];
  currentposnr = '00000000';
  currentfield = 'details';
  searchlist = [];
  searchlistnew = [];
  showCipline = false;
  pmForm = new FormGroup({
    pm: new FormControl(''),
    region: new FormControl('*'),
    cipgroup: new FormControl(),
    cipcode: new FormControl(),
    status: new FormControl(),
    site: new FormControl(),
    budgetgroup: new FormControl()
  })
  constructor(private _router: Router,  public apiserv: ApidataService,
    private authserv: AuthService,  public modalServicejw: ModalService,  private route:Router ) {
    this.title = "";
    this.sections = [
    
    ]
 
  }

  ngOnInit(): void {
   
    this.resetFilters();
    this.pmForm.get('region').valueChanges.subscribe(value => {
      this.searchlistnew = [];
     this.resetFilters();
      this.filters.cipcodes = this.apiserv.cipcodes
      this.filters.regions = this.apiserv.regions
      this.filters.cipgroups = this.apiserv.cipgroups
      //this.pmForm.get('region').setValue('', { emitEvent: false });
      // this.apiserv.getSearchList(this.pmForm.value.pm);
      this.apiserv.getBUDGETList(value);
    })
    //   this.pmForm.get('cipgroup').valueChanges.subscribe(value => {
    //     this.searchlistnew = [];
    //     this.searchlistnew = this.searchlist.filter(obj => {
    //       return obj['CIPGROUP']== value || value  =='';
    //     });
    //  this.filters.cipgroups = this.filters.cipgroups.filter( li => {
    //   return li.code == value ;
    //  })
    //   })
    if (this.authserv.currentUserValue.VERNA?.length > 3 && this.pmForm.value.pm?.length < 2) {
      this.pmForm.get('pm').setValue(this.authserv.currentUserValue.VERNA);
    }
    this.subscriptions.push(
      this.apiserv.budgetlist$.subscribe(reply => {
        this.searchlist = [];
        this.grouplist = ['*'];
        if (reply) {
          reply.forEach(element => {
            let tempobj = { tag: '' };
            tempobj.tag = Object.values(element).join('-');
            if (element['STATUS'].includes('CLSD')) {element['PHASE'] = 'PHASE11'; element['PROGRESS']= 100}
            this.searchlist.push({ ...element, ...tempobj });
            this.searchlistnew = this.searchlist;
            if (! this.grouplist.includes(element.BUDGETGROUP)){
              this.grouplist.push(element.BUDGETGROUP)
                 }
          });
        }
      }));
    this.subscriptions.push(
      this.pmForm.get('region').valueChanges.subscribe(li => {
        this.filterByRegion(li);
        // this.filterCipgroup('No');
        // this.filterCipLines(this.pmForm.value.cipcode, 'No')
      })
    )
    this.subscriptions.push(
      this.pmForm.get('budgetgroup').valueChanges.subscribe(li => {
        this.filterByBGROUP(li);
        // this.filterCipgroup('No');
        // this.filterCipLines(this.pmForm.value.cipcode, 'No')
      })
    )
    this.subscriptions.push(
      this.pmForm.get('cipcode').valueChanges.subscribe(li => {
        this.filterByRegion(this.pmForm.value.region || '*');
        this.filterCipgroup('No');
        this.filterCipLines(li, 'No')
      })
    )
  }

  get cipGroup() {
    return this.pmForm.value.cipgroup;
  }
  openpdf(budgetview){
    this.budgetview = budgetview;
    this.modalServicejw.open("pdf")
  }
resetFilters() {
  this.pmForm.get('region').setValue('*', { emitEvent: false });
  this.pmForm.get('cipcode').setValue('*', { emitEvent: false });
  this.pmForm.get('cipgroup').setValue(['*'], { emitEvent: false });
  this.pmForm.get('status').setValue(['*'], { emitEvent: false });
  this.pmForm.get('site').setValue(['*'], { emitEvent: false });
}
  openjw(thefield = 'ABSAREQNO') {
    this.currentfield = thefield.toUpperCase();
  //  this.modalServicejw.open('selections')
  }
  closejw(modalname) {
 
   // this.modalServicejw.close('selections')
  }
  filterByRegion(region = '*') {
    this.searchlistnew = [];
    let ctemp = [];  // holds  the groupcode to prevent duplicates
    let cgroup = [];
    this.filters.cipgroups = this.apiserv.cipgroups
    this.searchlistnew = this.searchlist.filter(obj => {
      let retval =  obj['REGION'] == region || obj['PROVREGION'] == region || region == '*'
      if (retval){
        if (!ctemp.includes(obj['CIPGROUP']))
        {
          ctemp.push(obj['CIPGROUP']);
          cgroup.push( this.filters.cipgroups.find(what=>{
            return what.code == obj['CIPGROUP'];
          }))
        }
      }
      return retval;
    });
    cgroup.unshift({ code: '*', text: '*Select All' })
    this.filters.cipgroups = cgroup;
  }
/****************************************************
 * cipgroups now must reduce the lines for cipcodes
 */
  filterCipgroup(restart = '*') {
    if (restart == '*') {
      this.filterByRegion(this.pmForm.value.region)
    }
    let filterar = []; // Multiple selections are contained in an Array
    let selected = this.cipGroup as Array<string>; // using getter
    if (selected.length == 0 || selected.includes('*')) {
      this.apiserv.cipgroups.forEach(line => {
        filterar.push(line.code)
      })
    } else {
      filterar = selected;
    }
    let codefilter = [];
    this.searchlistnew = this.searchlistnew.filter(obj => {
      let ans = false;
      for (let x = 0; x < filterar.length; x++) {
        ans = obj['CIPGROUP'] == filterar[x] || filterar[x] == '*' ? true : false
        x = (ans) ? 10000 : x;
      }
      if ( ans && !codefilter.includes(obj['CIPCODE']) ) {
        codefilter.push(obj['CIPCODE']);
      }
      return ans;
    });

    this.filters.cipgroups = this.filters.cipgroups.filter(li => {
      return filterar.includes(li.code)
    });
    if (this.filters.cipgroups.findIndex(line => {
      return line.code == '*'
    }) < 0) {
      this.filters.cipgroups.unshift({ code: '*', text: '*Select All' })
    }
    this.filters.cipcodes = this.apiserv.cipcodes.filter( linecode=> {
       return codefilter.includes(linecode.code)
    })
    if (this.filters.cipcodes.findIndex(line => {
      return line.code == '*'
    }) < 0) {
      this.filters.cipcodes.unshift({ code: '*', text: '* Select All' })
    }
  }
  filterCipLines(cipline = '*', restart = '*') {
    if (restart == '*') {
      this.filterByRegion(this.pmForm.value.region);
      this.filterCipgroup('No')
    }
    console.log(this.searchlistnew);
    console.log('after')
    this.searchlistnew = this.searchlistnew.filter(obj => {
      return obj['CIPCODE'] == cipline || cipline == '*'
    });
    console.log(this.searchlistnew);
  }

  filterByBGROUP(budgetgroup = '*') {
    this.searchlistnew = [];
    this.searchlistnew = this.searchlist.filter(obj => {
      return   obj['BUDGETGROUP'] == budgetgroup  || budgetgroup == '*'
   
    });
 
  }

  exportexcel(): void {
    /* pass the table id */
    let element = document.getElementById('projlist');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, { raw: true });

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Budget- list');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }
  feedback() {

    this.route.navigate(['/feedback'])
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = false;
    // dialogConfig.autoFocus = true;
    // dialogConfig.maxWidth = '100vw';
    // dialogConfig.maxHeight = '100vh';
    // dialogConfig.height = '100%';
    // dialogConfig.width = '100%';
    // dialogConfig.panelClass = 'full-screen-modal';
    // this.dialog.open(ProgressTrackerComponent, dialogConfig);
  }
  onNoneofAbove() {

  }
  onSelect(proj: any) {

   this.apiserv.getCipline(proj.INITIATIVE);
   this.showCipline = true;
   this.modalServicejw.open("cipline")
   // this.apiserv.getCommentList(this.currentposnr);
   // this._router.navigateByUrl('/requestedit/' + proj.ABSAREQNO)

    //this.openDialog();
  }
 
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub =>
      sub.unsubscribe())
  }
  selectAll() {
    this.selectedAll = !this.selectedAll;

    for (var i = 0; i < this.sections.length; i++) {
      this.sections[i].selected = this.selectedAll;
    }
  }
  checkIfAllSelected() {
    var totalSelected = 0;
    for (var i = 0; i < this.sections.length; i++) {
      if (this.sections[i].selected) totalSelected++;
    }
    this.selectedAll = totalSelected === this.sections.length;

    return true;
  }
}
