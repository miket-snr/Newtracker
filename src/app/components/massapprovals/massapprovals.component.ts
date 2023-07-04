import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApidataService } from 'src/app/_services/apidata.service';
import { AuthService } from 'src/app/_services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-massapprovals',
  templateUrl: './massapprovals.component.html',
  styleUrls: ['./massapprovals.component.css']
})
export class MassapprovalsComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  searchlist = [];
  searchlistnew = [];
  lockbox = [];
  changed=[];
  savelock=[];
  searchbox = '';
  tosave = false;
  myregion=this.authserv.currentUserValue.REGION || '* Show all';
  fileName = 'Cashflow Base.xlsx';
  constructor(public apiserv: ApidataService,private authserv:AuthService) { }

  ngOnInit(): void {
    this.apiserv.getFunding(this.authserv.currentUserValue.REGION || '*');
    this.subscriptions.push(
      this.apiserv.fundinglist$.subscribe(reply => {
        this.searchlist = [];
         if (reply) {
          let id = 0;
          reply.forEach(element => {
            if (element.INITIATIVE == 0){
            let tempobj = { tag: '' ,id: id };
            tempobj.tag = Object.values(element).join('-');
            this.searchlist.push({ ...element, ...tempobj });
            this.searchlistnew = this.searchlist;
            this.lockbox.push(false)
            this.savelock.push(true)
          id++}
          });
        }
      }));
  }
  unlock(id, reset = 'Y'){
    if (!this.lockbox[id] && reset=='Y') {
    let idx = this.searchlistnew.findIndex(line=>{
      return line.id == id
     })
    let idx2 = this.searchlist.findIndex(line=>{
      return line.id == id
     })
     this.searchlistnew[idx2] = { ...this.searchlist[idx]}
    }
    this.lockbox[id] = !this.lockbox[id]
  }
  newValue( item){
    let idx = this.changed.find(line=>{
     return line.id == item.id
    }) 
    if (!idx){
      this.changed.push(item)
    }
  this.tosave = true;
  }
  rowTrackByFunction(index, item) {
    // You will want to return a unique primitive for angular to use as a comparison item
    // (string, number, etc.)
    return item.ABSAREQNO;
 }
 saveLine(item:any){
  this.unlock([item.id],'N')
 }
 updateSap(){
  let outlist = []
  this.changed.forEach(line=>{
  let obj = {
    REFERENCE: line.ABSAREQNO,
    CIPCODE: line.CIPCODE,
    CIPGROUP: line.CIPGROUP,
    BUDGETPROGRAM: line.BUDGETPROGRAM ,
    CAPEX_OPEX: line.CAPEX_OPEX ,
   INITIATIVE: line.INITIATIVE
  }
  outlist.push(obj)
})

  let temp = JSON.stringify(outlist);
  let anobject = {DATA: this.apiserv.xtdbtoa(temp)};
  this.apiserv.putFunding(anobject);
 }
  exportexcel(): void {
    /* pass the table id */
    let element = document.getElementById('fundinglist');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, { raw: true });

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Funding - list');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub =>
      sub.unsubscribe())
  }
 
}
