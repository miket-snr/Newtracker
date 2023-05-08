import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApidataService } from 'src/app/_services/apidata.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-mvtdocs-list',
  templateUrl: './mvtdocs-list.component.html',
  styleUrls: ['./mvtdocs-list.component.css']
})
export class MvtdocsListComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  searchlist = [];
  searchlistnew = [];
  searchbox = '';
  fileName = 'Movements.xlsx';
  constructor(public apiserv: ApidataService) { }

  ngOnInit(): void {
    this.apiserv.getMVTDocs();
    this.subscriptions.push(
      this.apiserv.mvtdocs$.subscribe(reply => {
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
    XLSX.utils.book_append_sheet(wb, ws, 'MvtDocs- list');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub =>
      sub.unsubscribe())
  }
}
