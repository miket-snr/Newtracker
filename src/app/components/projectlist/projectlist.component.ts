import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApidataService } from 'src/app/_services/apidata.service';
import { AuthService } from 'src/app/_services/auth.service';
import * as XLSX from 'xlsx';

interface Dropentries {
  code: string;
  text: string;
}
interface Filter {
  field: string;
  selecttype: string;
  title: string;
  selection: string[];
  listof: Dropentries[];
}
@Component({
  selector: 'app-projectlist',
  templateUrl: './projectlist.component.html',
  styleUrls: ['./projectlist.component.css']
})
export class ProjectlistComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  fileName = 'projlist.xlsx';
  sections: any;
  title = '';
  drops: Dropentries[];
  filters = {
    pmlist: [],
    regions: [],
    cipgroups: [],
    cipcodes: [],
    status: [{ code: '*', text: '* Select All' },
    { code: 'DRAFT', text: 'Draft' },
    { code: 'REQUEST', text: 'Formal Request' },
    { code: 'QUOTED', text: 'In Approval Phase' },
    { code: 'EXECUTION', text: 'In Execution' },
    { code: 'CLOSED', text: 'Closed or Cancelled' }
    ],
    site: [],
    workstream: []
  };
  selectedAll = true;
  selectedNames: any;
  searchbox = '';
  pmlist = [];
  regions = [];
  showAll = true;
  btntitle = 'Show Unlinked'
  cipgroups = [];
  cipcodes = [];
  currentposnr = '00000000';
  currentfield = 'details';
  searchlist = [];
  searchlistnew = [];
  pmForm = new FormGroup({
    pm: new FormControl(''),
    region: new FormControl('*'),
    cipgroup: new FormControl(),
    cipcode: new FormControl(),
    status: new FormControl(),
    site: new FormControl()
  })
  constructor(private _router: Router, public apiserv: ApidataService,
    private authserv: AuthService, private route: Router) {
    this.title = "";
    this.sections = [
      { name: 'Basic', selected: true },
      { name: 'Approval Info', selected: true },
      { name: 'Funding', selected: true },
      { name: 'Date Progress', selected: true },
      { name: 'OHS Clearance', selected: true },

    ]

  }

  ngOnInit(): void {
    // this.apiserv.lookupsreadyBS.subscribe(val => {
    //   if (val) {
    //     this.filters.cipcodes = this.apiserv.cipcodes
    //     if (this.filters.cipcodes.findIndex(line => {
    //       return line.code == '*'
    //     }) < 0) {
    //       this.filters.cipcodes.unshift({ code: '*', text: '* Select All' })
    //     }

    //     this.filters.regions = this.apiserv.regions
    //     this.filters.cipgroups = this.apiserv.cipgroups
    //     // this.filters[0].listof = this.apiserv.regions ;
    //     // this.filters[1].listof = this.apiserv.cipgroups ;
    //     // this.filters[2].listof = this.apiserv.cipcodes ;

    //   }
    // })

   this.subscriptions.push(this.pmForm.get('region').valueChanges.subscribe(value => {
      this.searchlistnew = [];
      this.pmlist = ['* Show all'];

      //this.pmForm.get('region').setValue('', { emitEvent: false });
      // this.apiserv.getSearchList(this.pmForm.value.pm);
      this.apiserv.getBIGList(value, '');
    }))
  
      this.pmForm.get('pm').setValue('* Show all');
 
    this.subscriptions.push(
      this.apiserv.biglist$.subscribe(reply => {
        this.searchlist = [];
        if (reply) {
          reply.forEach(element => {
            let tempohs = element.OHS;
            let tempobj = { tag: '' };
            tempobj.tag = Object.values(element).join('-');

            this.searchlist.push({ ...element, ...tempobj ,...tempohs});
            this.searchlistnew = this.searchlist;
            if (!this.pmlist.includes(element.PMANAGER)) {
              this.pmlist.push(element.PMANAGER)
            }
          });
        }
      }));
    this.subscriptions.push(
      // A PM Change only filters the existing records
      this.pmForm.get('pm').valueChanges.subscribe(value => {
        if (value == '* Show all') {
          this.searchlistnew = [...this.searchlist]
        } else {
          let temp = this.searchlist.filter(lt => {
            return lt.PMANAGER == value;
          });
          this.searchlistnew = [];
          if (this.showAll) {
            this.searchlistnew = [...temp]
          } else {
            this.searchlistnew = temp.filter(line => {
              return line.INITIATIVE < 2000;
            })
          }
        }
        return this.searchlistnew;
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
      let retval = obj['REGION'] == region || obj['PROVREGION'] == region || region == '*'
      if (retval) {
        if (!ctemp.includes(obj['CIPGROUP'])) {
          ctemp.push(obj['CIPGROUP']);
          cgroup.push(this.filters.cipgroups.find(what => {
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
      if (ans && !codefilter.includes(obj['CIPCODE'])) {
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
    this.filters.cipcodes = this.apiserv.cipcodes.filter(linecode => {
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
    // console.log(this.searchlistnew);
    // console.log('after')
    this.searchlistnew = this.searchlistnew.filter(obj => {
      return obj['CIPCODE'] == cipline || cipline == '*'
    });
    // console.log(this.searchlistnew);
  }
  exportexcel(): void {
    /* pass the table id */
    let element = document.getElementById('projlist');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, { raw: true });

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Project List');

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

    this.currentposnr = proj.PROJLINK.replace(/\s/g, '');
    this.apiserv.currentpspid = proj.PROJLINK.replace(/\s/g, '');
    this.apiserv.currentprojBS.next(proj);
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
      TRACKNOTE:'',
      ONEVIEW: '',
    }
    this.apiserv.getReqView(proj.ABSAREQNO);
    this._router.navigateByUrl('/requestedit/' + proj.ABSAREQNO)

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
  toggleunlinked() {
    this.showAll = !this.showAll;
    this.btntitle = this.showAll ? 'Show Unlinked' : 'Show All';
    if (this.pmForm.value.pm == '* Show all') {
      this.searchlistnew = [...this.searchlist]
    } else {
      this.searchlistnew = this.searchlist.filter(lt => {
        return lt.PMANAGER == this.pmForm.value.pm;
      });
    }
      if (!this.showAll) {
         this.searchlistnew = this.searchlistnew.filter(line => {
          return line.INITIATIVE < 2000;
        })
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
  formatNumber(numberin){
    return this.formatString((Math.round((numberin + Number.EPSILON) * 100) / 100).toLocaleString())
   }
   formatString(strin = '') {
    if (strin.substring(strin.length - 2).includes('.')) {
      strin = strin + '0';
    }
    if (!strin.substring(strin.length - 3).includes('.')) {
      strin = strin + '.00'
    }
    strin = strin.replace(/,/g," ");
    let tempstr = (strin.includes("-")) ? '    (' + strin.substring(1) + ')' : '       ' + strin;
    return tempstr.substring(tempstr.length - 14)
  }
}
