import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApidataService } from 'src/app/_services/apidata.service';
import { AuthService } from 'src/app/_services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-imports',
  templateUrl: './imports.component.html',
  styleUrls: ['./imports.component.css']
})
export class ImportsComponent implements OnInit, OnDestroy {
  @Input() importtype = 'APPROVE'
  docToUpload: any;
  excelRows = [];
  importlines = [];
  rejects = [];
  sub: Subscription[] = [];
  multiprogress = [];

  readytoimport = this.apiserv.wbs2reqmapperBS.value;
  constructor(public authserv: AuthService, public apiserv: ApidataService, private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.importtype = this.route.snapshot.paramMap.get('importtype');
    if (!this.apiserv.wbs2reqmapperBS.value) {
      this.apiserv.getWbs2Req();
    }
    this.sub.push( this.apiserv.wbs2reqmapperBS.subscribe(hint => {
      this.readytoimport = hint;
    }))
  }
  ngOnDestroy(): void {
    this.sub.forEach(onesub=>{
      onesub.unsubscribe();
  })
}
  handleFileInput(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {

      this.docToUpload = fileInput.target.files[0];
      const reader = new FileReader();
      // const preview = document.querySelector('#myImageSrc');
      reader.onloadend = () => {
        let data = reader.result;
        let workbook = XLSX.read(data, {
          type: 'binary'
        });

        //Fetch the name of First Sheet.
        let firstSheet = workbook.SheetNames[0];

        //Read all rows from First Sheet into an JSON array.
        this.excelRows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);
        // let xtemp = `<p>` + excelRows[0].Name +  `</p>`;
        // xtemp = xtemp.replace(/\r\n/g,"<br>");
        let y = this.excelRows;
        this.SendToSap();
      }

      if (this.docToUpload) {
        //  reader.readAsArrayBuffer(this.docToUpload); // reads the data as a URL
        reader.readAsBinaryString(this.docToUpload);
      } else {

      }

    }
  }
  SendToSap() {
    switch (this.importtype) {
      case 'APPROVE': {

        this.excelRows.forEach(newobj => {
          let newdate = {};

          // PROJLINK NOTE STATUS TITLE POSTINGDATE VALUEOF BUDGETGROUP CIPCODE CIPGROUP PARTNERID
          // MOTIVATE	 VALUEOF 	NOTE	 PROJLINK 	CIPCODE	CIPGROUP	STATUS	POSTINGDATE	 CAPEX_OPEX 	BUDGETGROUP	INITIATIVE

          newdate['PROJLINK'] = (newobj['PROJLINK']);
          newdate['POSTINGDATE'] = this.formatDate(newobj['POSTINGDATE']);
          newdate['NOTE'] = this.apiserv.xtdbtoa(newobj['MOTIVATE']);
          newdate['BUDGETGROUP'] = (newobj['BUDGETGROUP']);
          newdate['CIPCODE'] = (newobj['CIPCODE']);
          newdate['CAPEX_OPEX'] = (newobj['CAPEX_OPEX']);
          newdate['VALUEOF'] = (newobj['VALUEOF']);
          newdate['TITLE'] = this.apiserv.xtdbtoa(newobj['NOTE']);
          newdate['CIPGROUP'] = (newobj['CIPGROUP']);
          newdate['STATUS'] = (newobj['STATUS']);
          newdate['PARTNERID'] = (newobj['INITIATIVE']);
          newdate['VATINCL'] = 'X';
          newdate['ENTRYCODE'] = 'APPROVAL';

          if (/^[A-Z]{3}-[A-Z][A-Z0-9]{5}$/.test(newobj['PROJLINK']) && this.apiserv.mapWBS2Req(newobj['PROJLINK']) > 0 ) {
            newdate['AGREEMENT'] = 'IMPORT';
            this.importlines.push(JSON.parse(JSON.stringify(newdate)))
          } else {
            newdate['AGREEMENT'] = 'REJECT';
            this.importlines.push(JSON.parse(JSON.stringify(newdate)))
            newdate['NOTE'] = (newobj['MOTIVATE'].substring(0, 40));
            this.rejects.push(JSON.parse(JSON.stringify(newdate)))
          }
        }
        )
        if (this.importlines.length > 0) {
         this.sub.push(this.apiserv.postGEN({ DATA: JSON.stringify(this.importlines) }, 'PUT_APPROVALDOC').subscribe(result => {
            this.apiserv.messagesBS.next('Done');
          })
         )
        }
        else {
          this.apiserv.messagesBS.next('No Valid lines');
        }
        break;
      }
      case 'PORDERS': {

        this.excelRows.forEach(newobj => {
          let newdate = {};
          newdate['SHORTCOMMENT'] = (newobj['PONUMBER']);
          newdate['PROJLINK'] = (newobj['PROJLINK']);
          newdate['POSTINGDATE'] = this.formatSAPdats(this.formatDate(newobj['PODATE']));
          newdate['NOTE'] = this.apiserv.xtdbtoa(newobj['REFERENCE']);
          newdate['VALUEOF'] = (newobj['VALUEOF(EX-VAT)']);
          newdate['ENTRYCODE'] = 'PONUMBER';
          newdate['SHORTCOMMENT']  = newdate['SHORTCOMMENT'] .replaceAll(/[^a-zA-Z0-9]/gi, '');
          newdate['PROJLINK']  = newdate['PROJLINK'] .replaceAll(/\s/gi, '');
          if (/^[A-Z]{3}-[A-Z][A-Z0-9]{5}$/.test(newobj['PROJLINK']) && this.apiserv.mapWBS2Req(newobj['PROJLINK']) > 0 ) {
            newdate['ENTRYTYPE'] = 'IMPORT';
            this.importlines.push(JSON.parse(JSON.stringify(newdate)))
          } else {
            newdate['ENTRYTYPE'] = 'REJECT';
            this.importlines.push(JSON.parse(JSON.stringify(newdate)))
            newdate['NOTE'] = 'Invalid Project Number';
            this.rejects.push(JSON.parse(JSON.stringify(newdate)))
          }
        }
        )
        if (this.importlines.length > 0) {
         this.sub.push(this.apiserv.postGEN({ DATA: JSON.stringify(this.importlines) }, 'PUT_PONUMBERDOC').subscribe(result => {
            this.apiserv.messagesBS.next('Done');
          })
         )
        }
        else {
          this.apiserv.messagesBS.next('No Valid lines');
        }
        break;
      }
    }
  }

  formatDate(serialno) {
    var utc_days = Math.floor(serialno - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);
    return date_info.getFullYear().toString() + '-' + String(date_info.getMonth() + 1).padStart(2, '0') + '-' + String(date_info.getDate()).padStart(2, '0');
  }
  formatSAPdats(datein= '1900-01-01'){
   return datein.replace(/-/g,'')
  }
  getHeaders(value: any) {
    let headers: string[] = [];
    if (value) {
      Object.keys(value).forEach((key) => {
        if (!headers.find((header) => header == key)) {
          headers.push(key)
        }
      })
    }
    return headers;
  }
}
