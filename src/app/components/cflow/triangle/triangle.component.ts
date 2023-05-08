import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApidataService } from 'src/app/_services/apidata.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-triangle',
  templateUrl: './triangle.component.html',
  styleUrls: ['./triangle.component.css']
})
export class TriangleComponent implements OnInit {
  subscriptions: Subscription[] = [];
  searchlist = [];
  searchlistnew = [];
  searchbox = '';
  fileName = 'ApprovaltoBudget.xlsx';
  constructor(public apiserv: ApidataService) { }

  ngOnInit(): void {
    this.apiserv.getReqList();
    this.subscriptions.push(
      this.apiserv.triangle$.subscribe(reply => {
        this.searchlist = [];
         if (reply) {
          reply.forEach(element => {
            element.PONUMBER = element.PONUMBER.replace(/#/g,'');
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
    let element = document.getElementById('apptopolist');
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

