import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApidataService } from 'src/app/_services/apidata.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-cashflow',
  templateUrl: './cashflow.component.html',
  styleUrls: ['./cashflow.component.css']
})
export class CashflowComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  searchlist = [];
  searchlistnew = [];
  searchbox = '';
  fileName = 'Cashflow Base.xlsx';
  constructor(public apiserv: ApidataService) { }

  ngOnInit(): void {
    this.apiserv.getCashflow();
    this.subscriptions.push(
      this.apiserv.cashflow$.subscribe(reply => {
        this.searchlist = [];
         if (reply) {
          reply.forEach(element => {
            let tempobj = { tag: '' };
            tempobj.tag = Object.values(element).join('-');
            this.searchlist.push({ ...element, ...tempobj });
            this.searchlistnew = this.searchlist;
          });
        }
      }));
  }
  exportexcel(): void {
    /* pass the table id */
    let element = document.getElementById('doclist');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, { raw: true });

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cip and WBS - list');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub =>
      sub.unsubscribe())
  }
}











// implements OnInit {

//   cashflows = [
//     {cfitemname:'Estimate',cfdate:'',cfamt:0,cfincl:0},
//     {cfitemname:'Quotation',cfdate:'',cfamt:0,cfincl:0},
//     {cfitemname:'PO Amt',cfdate:'',cfamt:0,cfincl:0},
//     {cfitemname:'SAP Budget',cfdate:'',cfamt:0,cfincl:0},
//     {cfitemname:'PO Outbound',cfdate:'',cfamt:0,cfincl:0},
//     {cfitemname:'Expenses',cfdate:'',cfamt:0,cfincl:0},
//     {cfitemname:'Travel',cfdate:'',cfamt:0,cfincl:0},
//     {cfitemname:'Billing',cfdate:'',cfamt:0,cfincl:0},
//     {cfitemname:'MFee',cfdate:'',cfamt:0,cfincl:0},
//     {cfitemname:'Variance',cfdate:'',cfamt:0,cfincl:0},
    
//   ]
//   constructor() { }

//   ngOnInit(): void {
//   }

// }
