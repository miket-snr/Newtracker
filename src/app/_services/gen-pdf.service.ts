import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ApidataService } from './apidata.service';
import { Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GenPdfService {
  summarytab = [];
  private subs: Subscription[] = []; 
  gmparray = [];
  proarray =[];
  resarray =[];
  impactarray = [];
  consarray =[];
  mkarray = [];
  bccount = 1;
  PageCnt = 1;
  currentline = 1;
  cnHead: any = {};
  bigview: any = {};
  fileName = 'Test-inprogress.pdf';
  //  let totalHeight = targetElm.offsetHeight;
  pdf = new jsPDF('p', 'mm', 'a4');
  pdfWidth = this.pdf.internal.pageSize.width - 20;
  pdfHeight = this.pdf.internal.pageSize.height - 10;
  printout = false;
  appendixheader = ["Service", "With Wty", "Without Wty", "Wty Months",
  "In Year"];
  comments = [];
  constructor(private apiserv: ApidataService) { }

  public async openPDF() {
  this.bigview = this.apiserv.currentreqBS.value ;
  this.pdf = new jsPDF('p', 'mm', 'a4');
    this.printout = true;
    let OPTIONS = {
      'jsPDF': {
        'orientation': 'p',
        'unit': 'mm',
        'format': 'a4',
        'putOnlyUsedFonts': false,
        'compress': false,
        'precision': 2,
        'userUnit': 1.0,
      },
      'html2canvas': {
        'allowTaint': false,
        'backgroundColor': '#ffffff',
        'canvas': null,
        'foreignObjectRendering': false,
        'imageTimeout': 15000,
        'logging': false,
        'onclone': null,
        'proxy': null,
        'removeContainer': true,
        'scale': 3,
        'useCORS': false,
      },
    }
    this.pdf.setFont("arial");

  }
  
  // OPTIONS: { jsPDF: { orientation: string; unit: string; format: string; putOnlyUsedFonts: boolean; 
  //   compress: boolean; precision: number; userUnit: number }; 
  //   html2canvas: { allowTaint: boolean; backgroundColor: string; canvas: any; foreignObjectRendering: boolean; imageTimeout: number; logging: boolean; onclone: any; proxy: any; removeContainer: boolean; scale: number; useCORS: boolean; }; },
  //   pdfWidth: number, pdfHeight: number)
  putPDFTABLE(gmpitems = [{LINETEXT:'',WITHW:'0', WITHOUTW:'0' ,MONTHSW: '0', Y1:0,Y2:0,Y3:0,Y4:0,Y5:0,CONTRACT:0, LINETYPE:"",DONEBY:"",CHANGEDBY:""}],
                          Headline = 'ZZZ AND ZZZ PROFIT BEFORE SERVICE INCREASE',
                          outlet = 'Unknown Site', impdate = '') {
    if ( this.currentline > 2 ){
      this.pdf.addPage();
      this.PageCnt++;
      this.currentline = 1;
    }
    this.pdf.setPage(this.PageCnt);
    let LINE1 = 'APPENDIX 2: APPROVED CHARGES';
    this.pdf.setFont("arial", 'bold')
    this.pdf.setFontSize(9);
    this.pdf.text(LINE1, 110, 10);
    LINE1 = Headline;
    let cnt = Headline.length / 2  + 1 ;
    this.pdf.text(LINE1, (130 - cnt), 15);
    this.pdf.setFont("arial", 'normal')
    this.pdf.setFontSize(7);
    if ( outlet.length > 3 ){
    LINE1 = 'Leave Site Date:' + impdate ;
    this.pdf.text(LINE1, 10, 11);
    LINE1 = 'OUTLET ' + outlet
    this.pdf.text(LINE1, 10, 18);
    }
    let proparr = [];
    let data1 = [];

 
    autoTable(this.pdf, {
      head: [this.appendixheader],
      headStyles:{
        valign: 'middle',
        halign : 'center',
        fillColor: [255,255,255],
        textColor: [0,0,0],
        lineWidth: 1,
        lineColor: [128, 128, 128]
      },
      body: proparr, styles: { font: "arial", fontSize: 7, cellPadding: 0.6 },
      startY: 20,
      theme: 'grid',
      columnStyles: {
        0: { cellWidth: 70, halign: "left" },
        1: { cellWidth: 20, halign: "right" }, 2: { cellWidth: 20, halign: "right" },
        3: { cellWidth: 15, halign: "right" }, 4: { cellWidth: 25, halign: "right" },
        5: { cellWidth: 25, halign: "right" }, 6: { cellWidth: 25, halign: "right" },
        7: { cellWidth: 25, halign: "right" }, 8: { cellWidth: 25, halign: "right" },
        9: { cellWidth: 30, halign: "right" },
      }
    })

    autoTable(this.pdf, {
      head: [],
      
      body: proparr, styles: { font: "arial", fontSize: 7, cellPadding: 0.5},
      startY: 164,
      theme: 'plain',
      columnStyles: {
        0: { cellWidth: 70, halign: "left" },
        1: { cellWidth: 20, halign: "right" }, 2: { cellWidth: 20, halign: "right" },
        3: { cellWidth: 15, halign: "right" }, 4: { cellWidth: 25, halign: "right" },
        5: { cellWidth: 25, halign: "right" }, 6: { cellWidth: 25, halign: "right" },
        7: { cellWidth: 25, halign: "right" }, 8: { cellWidth: 25, halign: "right" },
        9: { cellWidth: 30, halign: "right" },
      }
    })
    this.pdf.addPage();
    this.PageCnt++;
    this.currentline = 1;
    
    
  }
  printComments(){
    let pdf = this.pdf;
    this.setSectionHeader(pdf,'Comments');
    this.comments.forEach(commentline=> {
      this.pdf.setFont("arial", 'bold')
      this.pdf.setFontSize(9);
      this. pdf.text(commentline.DATEOF, 10, this.currentline * 5 + 25);
      this. pdf.text(commentline.COMMENTBY, 80, this.currentline * 5 + 25);
      this.nextLine(1);
      this.pdf.setFont("arial", 'normal')
      let thearray = this.preptext(commentline.COMMENT_TEXT.replace(/\n/g, '<br \/>'));
      thearray.forEach(line => {
        pdf.text(line, 20, this.currentline * 5 + 25);
        this.nextLine( 1);

      })
    })
  }
async putMain(pdf = this.pdf){
 
  this.setProjHeader(this.pdf);
  this.nextLine(12);
  this.printComments(); 
  this.printPDF()
  // pdf.save(this.fileName);
  this.printout = false;
  // });
  window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
  window.scrollTo(0, 0);
  this.subs.forEach(sub => sub.unsubscribe());
        this.subs = [];
  return
  this.setCNSolution(pdf)
  this.nextLine( 1);
  let topy = (this.currentline - 1) * 5 + 25
  let topx = 13
  // await this.setCNChargeable(pdf)
  this.nextLine( 2)
  let boty = (this.currentline - 1) * 5 + 25
  pdf.setDrawColor("#000000");
  pdf.rect(8, topy, 5, boty - topy, 'S');
  pdf.rect(topx, topy, 270, boty - topy, 'S');
  pdf.text('2', 10, topy + 5);
  topy = (this.currentline - 1) * 5 + 25
  topx = 13
 
  await this.setCNSignatures(pdf);
  pdf.addPage();
  this.PageCnt++;
  this.currentline = 1;


  /*********************Finish off Document and Save ***************/
  if (this.fileName == null) {
    this.fileName = '';
  }
  let pagecount = pdf.internal.pages;
  let img = new Image();
  img.src = '../assets/LogoAbsa.jpg';
  for (var i = 1; i < pagecount.length; i++) {
    // Go to page i
    pdf.setPage(i);

    pdf.addImage(img, 'JPG', 260, 3, 15, 15);
    pdf.setTextColor(255, 0, 0);
    pdf.setFont("arial", 'bold')
    pdf.text('Change Note', 230, 16);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("arial", 'normal')
    //Print Page 1 of 4 for example
    //  if (i >= landscapes[0]) {
    pdf.text('Page ' + String(i) + ' of ' + String(pagecount.length - 1), 297 - 28, 210 - 10);
    // } else {
    //   pdf.text('Page ' + String(i) + ' of ' + String(pagecount.length - 1), 210 - 28, 297 - 10);
    // }
    // pdf.setDrawColor("#000000");
    // if ( i> 1){
    //   pdf.rect(8, 25, 280, 165, 'S');
    // } else {
    //   pdf.rect(8, 28, 280, 170, 'S');
    // }

  }
  // fileName += this.getCurrentDateStr();
  // let string = pdf.output('datauristring');
  // let embed = "<embed width='100%' height='100%' src='" + string + "'/>"
  // let x = window.open();
  // x.document.open();
  // x.document.write(embed);
  // x.document.close();
  this.printPDF()
  // pdf.save(this.fileName);
  this.printout = false;
  // });
  window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
  window.scrollTo(0, 0);

}

  formatString(strin = '') {
    if (strin.substring(strin.length - 2).includes('.')) {
      strin = strin + '0';
    }
    if (!strin.substring(strin.length - 3).includes('.')) {
      strin = strin + '.00'
    }
    let tempstr = (strin.includes("-")) ? '    (' + strin.substring(1) + ')' : '       ' + strin;
    return tempstr.substring(tempstr.length - 12)
  }

 printPDF() {
  var blob = this.pdf.output("blob");
    window.open(URL.createObjectURL(blob));
 // this.pdf.save(this.fileName);
 }
 nextLine( cnt = 1 , topy = 0 , marker = '1') {
  this.currentline += cnt;
  let yrow = this.currentline * 5 + 25;
  if (yrow > (180)) {
    if ( topy > 0 ){
      let boty = this.currentline * 5 + 25 ;
      this.pdf.setDrawColor("#000000");
      this.pdf.rect(8, topy, 5, boty - topy, 'S');
      this.pdf.rect(13, topy, 270, boty - topy, 'S');
      this.pdf.text(marker, 10, topy + 5);}
    this.pdf.addPage();
    this.PageCnt++;
    this.currentline = 1;
  }
}
  setProjHeader(pdf = this.pdf) {
    // let img = new Image();
    // img.src = '../assets/Bidvestfmlogo.png';
    const event = new Date(Date());
    this.currentline = 1;
  
    pdf.setFontSize(12);
    pdf.setFont("arial", 'bold')
    let refer = ( this.bigview.PROJLINK )? 'Project Details ' + this.bigview.PROJLINK : 'Request Details ' +this.bigview.ABSAREQNO 
  
    
    pdf.text(refer, 80, this.currentline * 5 + 25);
   
    pdf.setDrawColor("#000000");
    // pdf.rect(8, 25,185, 6, 'S');
    pdf.setFontSize(9);
    pdf.setFont("arial", 'normal')
    this.nextLine(2);
    autoTable(pdf, {
      head: [],
      theme: 'grid',
      body:[['Project Title',this.bigview.TITLE], 
      ['Proposed Start',this.bigview.PROPSTARTDATE],
      ['Proposed Off Site',this.bigview.PROPENDDATE],
      ['Region',this.bigview.REGION],
      ['Location',this.bigview.ONEVIEW + ' ' + this.bigview.KNOWNAS],
      ['Project Manager',this.bigview.PMANAGER],
      ['Absa Purchase Order',this.bigview.PONUMBER],
    ],
      styles: {  font: "arial",textColor:[0,0,0], fontSize: 10 ,cellPadding: 1, fontStyle:"normal"},
      startY: this.currentline * 5 + 21,
      margin:{left:8},
      columnStyles: {
        0: { cellWidth: 50, halign: "center" },
        1: { cellWidth: 135, halign: "center" }
       
      },
      bodyStyles: {
        lineColor: [0,0,0]
      }

    })
    this.nextLine(10);

    let topy = (this.currentline - 1 ) * 5 + 25 + 1
    let thearray = this.preptext(this.bigview.DETAILS.replace(/\n/g, '<br \/>'));
    thearray.forEach(line => {
      pdf.text(line, 20, this.currentline * 5 + 25);
      this.nextLine( 1, topy, '1');
      topy = this.currentline === 1 ? 24 : topy
    })

    this.nextLine(4);
    this.setSectionHeader(this.pdf,'Planned Schedule')
    this.nextLine(1);
    // pdf.setFontSize(12);
    // pdf.setFont("arial", 'bold')
        
    // pdf.text('Planned Schedule', 10, this.currentline * 5 + 25);
    // pdf.setFontSize(9);
    // pdf.setFont("arial", 'normal')
    //this.nextLine(2);
    if (this.currentline > 30){
      this.pdf.addPage();
      this.PageCnt++;
      this.currentline = 1;
    }
    autoTable(pdf, {
      head: [['Milestone','Planned Start','Planned End', 'Progress']],
      theme: 'grid',
      body:[['Initialisation and Scoping', this.bigview.DATE02, this.bigview.DATE03, 'TBA' ], 
      ['Costing and Due Diligence',this.bigview.DATE03, this.bigview.DATE04, 'TBA' ],
      ['Approval Preparation',this.bigview.DATE04, this.bigview.DATE05, 'TBA' ],
      ['Approval Board', this.bigview.DATE05, this.bigview.DATE06, 'TBA' ],
      ['Site Execution', this.bigview.DATE06, this.bigview.DATE07, 'TBA' ],
      ['Proof of Completion', this.bigview.DATE07, this.bigview.DATE08, 'TBA' ],
      ['Billing  Period', this.bigview.DATE08, this.bigview.DATE09, 'TBA' ],
      ['Cash flow', this.bigview.DATE09, this.bigview.DATE10, 'TBA' ],
    ],
      styles: {  font: "arial",textColor:[0,0,0], fontSize: 10 ,cellPadding: 1, fontStyle:"normal"},
      startY: this.currentline * 5 + 21,
      margin:{left:8},
      columnStyles: {
        0: { cellWidth: 60, halign: "left" },
        1: { cellWidth: 50, halign: "center" },
        2: { cellWidth: 50, halign: "center" }
       
      },
      bodyStyles: {
        lineColor: [0,0,0]
      }

    })

    // LINE1 = 'This Change Note records a Change to the Agreement: The Agreement is amended as described further in this Change Note. Unless the context requires'
    // LINE2 = 'otherwise, all terms shall have the same meaning as defined in the Agreement unless otherwise set out in an Appendix to this Change Note.'
    // pdf.text(LINE1, 40, this.currentline * 5 + 25);
    // this.nextLine(1);
    // pdf.text(LINE2, 50, this.currentline * 5 + 25);
    // this.nextLine(1);

   // let topy = (this.currentline - 1 ) * 5 + 25 + 1
    // pdf.setDrawColor("#999999");
    // pdf.rect(8, 31,270, topy - 31, 'S');
    // pdf.setDrawColor("#000000");
    let topx = 8
    pdf.setFontSize(9);
    return;
    autoTable(pdf, {
      head: [],
      theme: 'grid',
      body:[[this.cnHead.CNNAME,this.cnHead.GUID], 
      ['Change Request Title','Change Number'],
      ['Bidvest Facilities Management Chief Operating Officer: Absa','Bidvest Facilities Management (Pty) Ltd'],
      ['Originator Title','Originator Company']],

      styles: {  font: "arial",textColor:[0,0,0], fontSize: 8.5 ,cellPadding: 1, fontStyle:"bold"},
      startY: this.currentline * 5 + 21,
      margin:{left:8},
      columnStyles: {
        0: { cellWidth: 135, halign: "center" },
        1: { cellWidth: 135, halign: "center" }
       
      },
      bodyStyles: {
        lineColor: [0,0,0]
      }

    })
    this.nextLine(8);
    let boty = (this.currentline - 1 ) * 5 + 25 
    pdf.rect(8, topy,270, boty - topy + 1, 'S');
     topy = (this.currentline - 1 ) * 5 + 25 
    this.setSectionHeader(pdf,'Categorisation: (* X marks as applicable)')
    this.nextLine(1);
    let imgyes = new Image();
    imgyes.src = '../assets/yes.jpg';
    let imgno = new Image();
    imgno.src = '../assets/no.jpg';    
  
    
 
      pdf.addImage(imgno, 'JPG', 16, this.currentline * 5 + 22, 4,4);

    pdf.text(this.cnHead.ADDSERVICE? '  Additional Service': '  Additional Service', 20,this.currentline  * 5 + 25);
    this.nextLine(1);
    
    pdf.text(this.cnHead.GMPCHANGE? '  GMP Change': '  GMP Change', 20, this.currentline * 5 + 25);
    this.nextLine(1);
    boty = (this.currentline - 1 ) * 5 + 25 
    pdf.setDrawColor("#000000");
    pdf.rect(8, topy+ 1,270, boty - topy + 3, 'S');
 
  }
    setSectionHeader(pdf = this.pdf, textline) {
    pdf.setFont("arial", 'bold');
    pdf.setFontSize(12)
    let yrow = this.currentline * 5 + 25;
    if (yrow > 180) {
      pdf.addPage();
      this.PageCnt++;
      this.currentline = 1;
    }
    pdf.text(textline, 10, this.currentline * 5 + 25);
    this.nextLine(2);
    pdf.setFont("arial", 'normal')
    this.pdf.setFontSize(9);
  }
 async Build_pdf(reqno){
  this.apiserv.getCommentList(reqno,'','');
  this.subs.push(this.apiserv.commentlist$.subscribe(async datain =>{
    if ( !this.apiserv.pdfready ) return ;
     this.comments = datain.map(linein => {
       return {
         REFERENCE: linein.REFERENCE,
         LINE_2:linein.LINE_2,
         LINE_3:linein.LINE_3,
         DATEOF: linein.DATEOF, 
         COMMENTBY: linein.COMMENTBY,
         COMMENT_TEXT: atob(linein.COMMENT_TEXT),
         COMMENTNO: linein.COMMENTNO
       }
     })
     this.comments.sort((a,b) => b.COMMENTNO - a.COMMENTNO);
     this.apiserv.pdfready = false;
     await this.openPDF();
     await this.putMain();
   }))
   }

    setCNSolution(pdf = this.pdf) {
    pdf.setFont("arial", 'normal')
    pdf.setFontSize(9);
    this.nextLine(1) ;
    let textline = 'It is agreed that the following changes shall be made:'
    pdf.text(textline, 20, this.currentline * 5 + 25);
    this.nextLine(2) ;
    let topy = this.currentline * 5 + 25 -6 ;
   
    pdf.setFont("arial", 'normal', 'bold');

    textline = 'Change Request Solution / Additional Service Description'
    pdf.text(textline, 20, this.currentline * 5 + 25);
    this.nextLine( 1) ;
    pdf.setFont("arial", 'normal')
    let thearray = this.preptext(this.cnHead.CNDETAIL.replace(/\n/g, '<br \/>'));
    thearray.forEach(line => {
      pdf.text(line, 20, this.currentline * 5 + 25);
      this.nextLine( 1, topy, '1');
      topy = this.currentline === 1 ? 24 : topy
    })
    // let boty = this.currentline * 5 + 25 ;
    // pdf.setDrawColor("#000000");
    // pdf.rect(8, topy, 5, boty - topy, 'S');
    // pdf.rect(13, topy, 270, boty - topy, 'S');
    // pdf.text('1', 10, topy + 5);
    // topy = boty ;
    this.nextLine( 1, topy, '1');
    topy = this.currentline === 1?  24 : topy
 
    this.nextLine( 5, topy, '1');
    topy = this.currentline === 1?  24 : topy
    thearray = this.preptext(this.cnHead.CNDETAIL2.replace(/\n/g, '<br \/>'));
    topy = this.currentline === 1?  24 : topy
    thearray.forEach(line => {
      pdf.text(line, 20, this.currentline * 5 + 25);
      this.nextLine( 1, topy, '1');
      topy = this.currentline === 1?  24 : topy
    })
    if (this.currentline > 1 ) {
      let boty = this.currentline * 5 + 25 ;
      pdf.setDrawColor("#000000");
      pdf.rect(8, topy, 5, boty - topy, 'S');
      pdf.rect(13, topy, 270, boty - topy, 'S');
      pdf.text('1', 10, topy + 5);}
    
  }

    preptext(textin = '', chunksize = 100) {
    let preppedtext = [];
    textin.replace(/\t/g, ' ');
    textin.replace(/\r/g, '');
    let mypreppedtext = textin.split('<br />');
    mypreppedtext.forEach((chunk: string) => {
      if (chunk.length < chunksize) {
        preppedtext.push(chunk)
      } else {
        let xleft = 0;
        while (xleft < chunk.length) {
          if ((chunk.length - xleft) <= chunksize) {
            preppedtext.push(chunk.substring(xleft))
            xleft = chunk.length;
          } else {
            let subtext = chunk.substring(xleft, xleft + chunksize);
            let pointer = Math.max(subtext.lastIndexOf(" "), subtext.lastIndexOf("."));
            if (pointer <= 1) {
              pointer = subtext.length;
            } else {
              pointer += 1;
            }
            preppedtext.push(chunk.substring(xleft, xleft + pointer))
            xleft = xleft + pointer;
          }
        }
      }

    })
    return preppedtext;
  }


  async setCNSignatures(pdf = this.pdf) {
    let signelem: any = document.getElementById('signatures');
    let line = ' If this Change Note is accepted, acceptance should be indicated by an authorised signatory' +
      ' of the recipient signing this Change Note below, and returning it to the originating party.'
    pdf.setFontSize(9);
    pdf.text(line, 10, this.currentline * 5 + 25);
    this.nextLine( 2)
    let topy = (this.currentline - 1) * 5 + 25
    let topx = 8
    pdf.setFont("arial", 'bold')
    pdf.setFontSize(9);
    pdf.text('Signatures from authorised signatories', 80, this.currentline * 5 + 25)
    this.nextLine( 2);
    let boty = (this.currentline - 1) * 5 + 25
    pdf.setDrawColor("#000000");
    pdf.rect(8, topy, 270, boty - topy, 'S');
    topy = (this.currentline - 1) * 5 + 25
    pdf.text('For Absa Bank Limited', 45, this.currentline * 5 + 25)
    pdf.text('For Bidvest Facilities Management (Pty) Ltd', 165, this.currentline * 5 + 25);
    this.nextLine( 2)
    boty = (this.currentline - 1) * 5 + 25
    pdf.setDrawColor("#000000");
    pdf.rect(8, topy, 135, boty - topy, 'S');
    pdf.rect(8, topy, 270, boty - topy, 'S');
    topy = (this.currentline - 1) * 5 + 25;
    let bigtopy = topy;
    pdf.setFontSize(9);
    this.nextLine( 3)
    pdf.text('Signature', 10, this.currentline * 5 + 25)
    pdf.text('Signature', 145, this.currentline * 5 + 25)
    this.nextLine( 4)
    boty = (this.currentline - 1) * 5 + 25
    pdf.setDrawColor("#000000");
    pdf.rect(8, topy, 135, boty - topy, 'S');
    pdf.rect(8, topy, 270, boty - topy, 'S');
    topy = (this.currentline - 1) * 5 + 25
    pdf.text('Name', 10, this.currentline * 5 + 25)
    pdf.text('Name', 145, this.currentline * 5 + 25)
    // pdf.text(this.apiserv.changenoteclass.ABSASIGN, 30, this.currentline * 5 + 25)
    // pdf.text(this.apiserv.changenoteclass.BFMSIGN, 165, this.currentline * 5 + 25)
    this.nextLine( 2)
    boty = (this.currentline - 1) * 5 + 25
    pdf.setDrawColor("#000000");
    pdf.rect(8, topy, 135, boty - topy, 'S');
    pdf.rect(8, topy, 270, boty - topy, 'S');
    topy = (this.currentline - 1) * 5 + 25
    pdf.text('Title:', 10, this.currentline * 5 + 25)
    pdf.text('Title:', 145, this.currentline * 5 + 25)
    // pdf.text(this.apiserv.changenoteclass.ABSAROLE, 30, this.currentline * 5 + 25)
    // pdf.text(this.apiserv.changenoteclass.BFMROLE, 165, this.currentline * 5 + 25)
    this.nextLine( 2)
    boty = (this.currentline - 1) * 5 + 25
    pdf.setDrawColor("#000000");
    pdf.rect(8, topy, 135, boty - topy, 'S');
    pdf.rect(8, topy, 270, boty - topy, 'S');
    topy = (this.currentline - 1) * 5 + 25
    pdf.text('Date:', 10, this.currentline * 5 + 25)
    pdf.text('Date:', 145, this.currentline * 5 + 25)
    this.nextLine( 2)
    boty = (this.currentline - 1) * 5 + 25
    pdf.setDrawColor("#000000");
    pdf.rect(8, topy, 135, boty - topy, 'S');
    pdf.rect(8, topy, 270, boty - topy, 'S');
    pdf.rect(8, bigtopy, 20, boty - bigtopy, 'S');
    pdf.rect(8, bigtopy, 155, boty - bigtopy, 'S');

    this.nextLine( 4);
    

  }

}


