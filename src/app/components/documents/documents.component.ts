import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApidataService } from 'src/app/_services/apidata.service';
import { AuthService } from 'src/app/_services/auth.service';
import { FileSaverService } from 'ngx-filesaver';
@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  docToUpload: any;
  public doclist = new BehaviorSubject<any>([]);
  public currentblob = new BehaviorSubject<Blob>(null);
//
  line2load = this.blankSAPDocline();
  dataURL: any;
  helper=false;
  hlptxt = 'Show Help';
  docs = [];
  SP1: any;
  constructor(private apiserv: ApidataService,
    public authaserv: AuthService,public filesaver: FileSaverService,) { }

  ngOnInit(): void {
    this.getdoclist({APIKEY:"PSTRACKER",DOCNO:"HELPFILE"})
  }
  showHelp(){
  this.helper = !this.helper;
  this.hlptxt = this.helper? 'Hide Help' : "Show Help";
  }
  handleFileInput(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {

      this.docToUpload = fileInput.target.files[0];
      const reader = new FileReader();
      // const preview = document.querySelector('#myImageSrc');
      reader.onloadend = () => {
        let dataURL = reader.result;
        this.line2load = this.blankSAPDocline();
        const docno = 'HELPFILE';
        const vendor = '';
        this.apiserv.uploadQuoteFile2SAP(fileInput.target.files, dataURL, 'HELPFILE', 'DOCS', this.authaserv.currentUserValue.EMAIL).subscribe(
          data => {
           this.getdoclist({APIKEY:"PSTRACKER",DOCNO:"HELPFILE"})
          })
//        this.line2load.LINETYPE = this.doctype; //this.bchead ;
    
        // line2load.DOCNO  = this.bchead ;
        // this.line2load.ORIGINALNAME = this.docToUpload.name;
        // this.line2load.FILESIZE = this.docToUpload.size;
        // this.line2load.CONTENTHASH = contenthash.toString();
        // this.line2load.LOADEDBY = this.apiservice.user.name;
        // this.line2load.DONEBY = this.apiservice.user.login;
        // this.line2load.DOCTEXT = 'Testphase';
        // this.docservice.putBCDocument(this.line2load);
      }

      if (this.docToUpload) {
      //  reader.readAsArrayBuffer(this.docToUpload); // reads the data as a URL
      reader.readAsDataURL(this.docToUpload);
      } else {

      }

    }
  }
  blankSAPDocline() {
    return {
      MANDT: '',
      APIKEY: 'PSTRACKER',
      DOCNO: '',
      PARTNER: '',
      COUNTER: '',
      CONTENT: '',
      DATELOADED: '',
      LOADEDBY: '',
      IMPORTED: '',
      ORIGINALNAME: '',
      FILESIZE: '',
      MIMETYPE: '',
      CHARSHOLDER: ''
    };
  }
   /********************************************** */
   b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    if (b64Data === 'undefined') {
      return;
    }
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, {
      type: contentType
    });
    return blob;
  }
  /***************************************************** */
  getdoc(docref: any) {
    let datain = '';
    this.apiserv.postGEN(docref,'GET_DOCUMENT','PROJECTS')
      .subscribe(data => {
        if (data.RESULT instanceof Array) {
            const b64Data = data.RESULT[0].COMMENT_TEXT;
          if (b64Data !== undefined) {
            this.currentblob.next(
              this.apiserv.b64toBlob(b64Data, docref.MIMETYPE, 512)
            );
          }
        }
      });
      this.currentblob.subscribe(datain => {
        if (datain) {
          const ieEDGE = navigator.userAgent.match(/Edge/g);
          const ie = navigator.userAgent.match(/.NET/g); // IE 11+
          const oldIE = navigator.userAgent.match(/MSIE/g);
          //  				 if (ie || oldIE || ieEDGE) {
          this.filesaver.save(datain, docref.ORIGINALNAME);
          this.currentblob.next(null);
        }
      });
  }
   /***************************************************** */
   getdoclist(docref: any) {
    this.docs = [];
    this.apiserv.postGEN(docref,'GET_DOCLIST','PROJECTS')
      .subscribe(data => {
        if (data.RESULT instanceof Array) {
            data.RESULT.forEach(dataline=>{
              let tobj = {...dataline}
              this.docs.push(tobj);
            })
        }
      });
  }
  deletedoc(docref: any) {
    let datain = '';
    this.apiserv.postGEN(docref,'DELETE_DOCUMENT','PROJECTS')
      .subscribe(data => {
        this.getdoclist({APIKEY:"PSTRACKER",DOCNO:"HELPFILE"})
    });
  }
}
