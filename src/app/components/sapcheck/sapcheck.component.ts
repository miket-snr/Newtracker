import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApidataService } from 'src/app/_services/apidata.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-sapcheck',
  templateUrl: './sapcheck.component.html',
  styleUrls: ['./sapcheck.component.css']
})
export class SapcheckComponent implements OnInit {
  subscriptions: Subscription[] = [];
  searchlist = [];
  searchlistnew = [];
  searchbox = '';
  fileName = 'Debtors.xlsx';
  constructor(public apiserv: ApidataService) { }

  ngOnInit(): void {
    this.apiserv.getSapcheck();
    this.subscriptions.push(
      this.apiserv.saplist$.subscribe(reply => {
        this.searchlist = [];
         if (reply) {
          reply.forEach(element => {
            let tempobj = { tag: '' };
            tempobj.tag = Object.values(element).join('-');
            this.searchlist.push({ ...element, ...tempobj });
            this.searchlistnew = this.searchlist;
          });
        }
        this.searchlist.sort((a, b)=> {
          // if (a.PROJLINK === b.PROJLINK){
          //   return a.LOADTYPE < b.LOADTYPE ? -1 : 1
          // } else {
            return a.PROJLINK < b.PROJLINK ? -1 : 1
   //       }
        })
        this.searchlistnew = this.searchlist;
      }));
  }
  exportexcel(): void {
    /* pass the table id */
    let element = document.getElementById('doclist');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, { raw: true });

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Debtors - list');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub =>
      sub.unsubscribe())
  }
}



