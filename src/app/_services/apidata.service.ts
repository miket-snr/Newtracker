import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Approval } from '../_classes/approval';
import { ApprovalClass } from '../_classes/approvalclass';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApidataService {

  lclstate = {
    sections: [],
    active: 0,
    region: '',
    pmanager: '',
    accountant: '',
    filtercip: false,
    filteropen: false,
    dates: {},
    ohs:{},
    approval:{},
    psfunding:{},
    sites: '',
    currentreq: {},
    phase: '',
    closed: false,
    comments: [],
    funding: [],
    feedback: {
      REFERENCE: '',
      BUDGETAMT: 0,
      FORECAST_START: '',
      FORECAST_END: '',
      RATING: '',
      LAST_COMMENT: '',
      TRACKNOTE: '',
      ONEVIEW: '',
    }
  }
  regions = [];
  provregions = [];
  actionlist = [];
  Wbs2Req = [];
  menu = true;
  boqs = [];
  cipcodes = [];
  cipgroups = [];
  approvals = [];
  workstreams = [];
  pmlist = [];
  pms = [];
  scopes = [];
  costs = [];
  pos = [];
  invsubs = [];
  implements = [];
  risks = [];
  reqdata = [];
  loading = false;
  pdfready = false;
  phaseprog = [];
  counter = 0;
  currentpspid = '00000000';
  currentcipline: any;
  helptexts = []
  budgetgroups = ['* All', 'CIP2023',
    'OPEX',
    'ROL2022',
    'RXL2022',
    'UNKNOWN',
  ]
  public loadingBS = new BehaviorSubject<boolean>(false)
  public approvalBS = new BehaviorSubject<Approval>(new ApprovalClass().approval)
  public approval$ = this.approvalBS.asObservable();

  public ciplineadjBS = new BehaviorSubject([]);
  public helptextsBS = new BehaviorSubject([]);

  public messagesBS = new BehaviorSubject<string>('');
  public messages$ = this.messagesBS.asObservable();

  public biglistBS = new BehaviorSubject([]);
  public biglist$ = this.biglistBS.asObservable();

  public tasklistBS = new BehaviorSubject([]);
  public tasklist$ = this.tasklistBS.asObservable();

  public budgetlistBS = new BehaviorSubject([]);
  public budgetlist$ = this.budgetlistBS.asObservable();

  public fundinglistBS = new BehaviorSubject([]);
  public fundinglist$ = this.fundinglistBS.asObservable();

  public mvtdocsBS = new BehaviorSubject([]);
  public mvtdocs$ = this.mvtdocsBS.asObservable();

  public cashflowBS = new BehaviorSubject([]);
  public cashflow$ = this.cashflowBS.asObservable();

  public debtorsBS = new BehaviorSubject([]);
  public debtors$ = this.debtorsBS.asObservable();

  public saplistBS = new BehaviorSubject([]);
  public saplist$ = this.saplistBS.asObservable();

  public triangleBS = new BehaviorSubject([]);
  public triangle$ = this.triangleBS.asObservable();


  public currentprojBS = new BehaviorSubject([]);
  public currentproj$ = this.currentprojBS.asObservable();

  public currentreqBS = new BehaviorSubject([]);
  public currentreq$ = this.currentreqBS.asObservable();

  public commentlistBS = new BehaviorSubject([]);
  public commentlist$ = this.commentlistBS.asObservable();

  public pmlistBS = new BehaviorSubject([]);
  public pmlist$ = this.pmlistBS.asObservable();

  public progressBS = new BehaviorSubject([]);
  public progress$ = this.progressBS.asObservable();

  public proglookupsBS = new BehaviorSubject([]);
  public proglookups$ = this.proglookupsBS.asObservable();

  public lookupsreadyBS = new BehaviorSubject(false);
  public lookupsready$ = this.lookupsreadyBS.asObservable();

  public ciplistBS = new BehaviorSubject([]);
  public tasklinesBS = new BehaviorSubject([]);
  public wbs2reqmapperBS = new BehaviorSubject(false);
  public testcontainerBS = new BehaviorSubject('');
  constructor(private http: HttpClient, private router: Router,
              @Inject(LOCALE_ID) public locale: string) { }

  getWbs2Req() {
    this.postGEN({ A: '' }, 'GET_REQ2WBS').subscribe(reply => {
      this.Wbs2Req = JSON.parse(reply.RESULT);
      this.wbs2reqmapperBS.next(true)
    })
  }
  getFunding(region = '*') {
    this.postGEN({ REGION: region }, 'GET_FUNDING').subscribe(reply => {
      reply.RESULT.forEach(line => {
        line.TITLE = this.xtdatob(line.TITLE);
        line.KNOWNAS = this.xtdatob(line.KNOWNAS);
        line.FUND_COMMENT = this.xtdatob(line.FUND_COMMENT);
        line.FUND_SOURCES = this.xtdatob(line.FUND_SOURCES);
      })
      this.lclstate.funding = reply.RESULT;
      this.fundinglistBS.next(reply.RESULT)
    })
  }

  putFunding(lclobj: any) {
    this.postGEN(lclobj, 'UPDATE_MASSFUNDING').subscribe(reply => {
      
    })
  }
  updateOHS(lclobj:any){
    this.postGEN(lclobj, 'PUT_OHSRECORD').subscribe(reply => {
      this.messagesBS.next('Done');
    })
  }
  getCipline(cipid = '') {
    this.postGEN({ INITIATIVE: cipid }, 'GET_CIPLINE_MVTS').subscribe(reply => {
      reply.RESULT.forEach(line => {
        line.TITLE = this.xtdatob(line.TITLE);
        line.KNOWNAS = this.xtdatob(line.KNOWNAS);
        line.DETAILS = this.xtdatob(line.DETAILS);
      })
      this.currentcipline = reply.RESULT[0];
      this.ciplineadjBS.next(reply.RESULT)
    })
  }

  getMVTDocs() {
    this.postGEN({ INITIATIVE: "0" }, 'GET_CIPLINE_MVTDOCS').subscribe(reply => {
      reply.RESULT.forEach(line => {
        line.SHORTCOMMENT = this.xtdatob(line.SHORTCOMMENT);
        line.NOTE = this.xtdatob(line.NOTE);
      })
      this.mvtdocsBS.next(reply.RESULT)
    })
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
  getCashflow() {
    this.postGEN({ REGION: "*" }, 'BUILD_CASHFLOW').subscribe(reply => {
      reply.RESULT.forEach(line => {
        line.SHORTCOMMENT = this.xtdatob(line.SHORTCOMMENT);
        line.NOTE = this.xtdatob(line.NOTE);
      })
      this.cashflowBS.next(reply.RESULT)
    })
  }
  getDebtors() {
    this.postGEN({ BUKRS: "1000" }, 'GET_DEBTORDOCS', 'PROJECTS').subscribe(reply => {
      reply.RESULT.forEach(line => {
        line.SGTXT = this.xtdatob(line.SGTXT);

      })
      this.debtorsBS.next(reply.RESULT)
    })
  }

  getSapcheck() {
    this.postGEN({ ABSAREQNO: "1000" }, 'COMPARE_SAP_TRACKER', 'PSTRACKER').subscribe(reply => {
      let xarray = JSON.parse(reply.RESULT)
      xarray.forEach(line => {
        line.POST1 = this.xtdatob(line.POST1);
      })
      this.saplistBS.next(xarray)
    })
  }

  getReqList(reqno = 0) {
    let lclobj = {};
    if (reqno > 100000) {
      lclobj = { ABSAREQNO: reqno, LOADTYPE: "A" }
    } else {
      lclobj = { LOADTYPE: "A" }
    }
    this.postGEN(lclobj, 'GET_CURRENTLIST').subscribe(reply => {
      reply.RESULT.forEach(line => {
        line.TITLE = this.xtdatob(line.TITLE);
        line.KNOWNAS = this.xtdatob(line.KNOWNAS);
        line.APPROVAL_MOTIVATE = this.xtdatob(line.APPROVAL_MOTIVATE);
        line.APPROVAL_NOTE = this.xtdatob(line.APPROVAL_NOTE);
      })
      this.triangleBS.next(reply.RESULT)
    })

  }
  getBIGList(region = '', pm = '*', asbsareqno = '') {

    this.postGEN({ REGION: region, PMANAGER: pm }, "GET_BIGVIEW").subscribe(reply => {
      if (!reply || reply.RESULT.length == 0) {
        return
      }
      if (!Array.isArray(reply.RESULT)) {
        if (reply.RESULT.indexOf('Invalid Token') !== -1) {
          this.messagesBS.next('Invalid Token - Please log in again');
          return
        } else { return }
      }
      let feedback = this.processBigview(reply.RESULT)
      this.biglistBS.next(feedback);
      //  this.getAbsaReqList();
    })
  }
  processBigview(reply) {
    let ans = reply;
    ans.forEach(ele => {
      ele.DETAILS = this.xtdatob(ele.DETAILS)
      ele.SITENOTES = this.xtdatob(ele.SITENOTES)
      ele.SITES = this.xtdatob(ele.SITES)
      ele.KNOWNAS = this.xtdatob(ele.SKNOWNAS)
      ele.TITLE = this.xtdatob(ele.STITLE)
      ele.TRACKNOTE = this.xtdatob(ele.TRACKNOTE)
      ele.LAST_COMMENT = ele.LAST_COMMENT? this.xtdatob(ele.LAST_COMMENT): ele.TRACKNOTE.substring(0,250);
      ele.DATES = ele.DATES ? ele.DATES : ''
      ele.ABSAPHASE = ele.PHASE < 'PHASE05 '? 'Planning' : ele.PHASE < 'PHASE07 '? 'Implementation' : ele.PHASE < 'PHASE08 '? 'Execution' : 'Closing'
      if (ele.DATES.includes('PROG')) {
        try {
          let lclobj = JSON.parse(ele.DATES)
          ele['PROGRESS'] = lclobj
        } catch (e) {
          ele['PROGRESS'] = {};
        }
      }
     ele['OHS'] = JSON.parse(this.xtdatob(ele.OHS))
      ele.FUNDING = this.xtdatob(ele.FUNDING)
      ele.APPROVAL_MOTIVATE = this.xtdatob(ele.APPROVAL_MOTIVATE)
      ele.APPROVAL_NOTE = this.xtdatob(ele.APPROVAL_NOTE)
      // ele.APPROVAL = this.xtdatob(ele.APPROVAL)
    })
    return ans;
  }
  formatDate(datein): string {
    datein = new Date(datein);
    datein.setHours(0, 0, 0, 0);
    let dd = ''; let mm = ''; let yyyy = 0;
    try {
     
      dd = String(datein.getDate()).padStart(2, '0');
      mm = String(datein.getMonth() + 1).padStart(2, '0'); //January is 0!
      yyyy = datein.getFullYear();
    } catch (e) {
      alert(datein)
    }
    return yyyy + '-' + mm + '-' + dd;
  }
  getHelptexts(textname = '') {

    if (textname) {
      let reply = this.helptextsBS.value.find(line => {
        return line.KEYCODE == textname;
      })
      if (reply) {
        return reply
      } else {
        let reply =
        {
          CONTRACTCODE: 'PSPT', KEYCODE: textname, TITLE: '', QUESTION: '',
          LINE1: ` <p>Simply fill the correct information in </p>`
          , LINE2: ''
        }
        return reply
      }
    }
    this.postGEN({ CONTRACTCODE: "PSPT" }, "GET_HELPTEXTS", "PROJECTS").subscribe(helps => {
      helps?.RESULT?.forEach(liner => {
        liner['LINE1'] = this.xtdatob(liner['LINE1'])
      })
      this.helptextsBS.next(helps.RESULT);
    })
  }
  getBUDGETList(region) {
    this.postGEN({ REGION: region }, "GET_BUDGETVIEW").subscribe(reply => {
      if (!reply || reply.RESULT.length == 0) {
        return
      }
      if (!Array.isArray(reply.RESULT)) {
        if (reply.RESULT.indexOf('Invalid Token') !== -1) {
          this.messagesBS.next('Invalid Token - Please log in again');
          return
        } else { return }
      }
      reply.RESULT.forEach(ele => {
        try {
          if (ele.FCASTSTARTDATE < '1900-01-01') {
            ele.FCASTSTARTDATE = ele.PROPSTARTDATE;
            ele.FCASTENDDATE = ele.PROPENDDATE;
            ele.FCASTCASHFLOWDATE = ele.CASHFLOWDATE;

          }
          if (!ele.PROJLINK) {
            ele.DATE06 = ele.FCASTSTARTDATE;
            ele.DATE07 = ele.FCASTENDDATE;
            ele.DATE10 = ele.FCASTCASHFLOWDATE;
          }
          ele.DETAILS = ele.DETAILS.length > 3 ? this.xtdatob(ele.DETAILS) : '';
          ele.LAST_COMMENT = ele.LAST_COMMENT.length > 3 ? this.xtdatob(ele.LAST_COMMENT) : ''
        } catch (e) {

        }
      })
      this.budgetlistBS.next(reply.RESULT);
      //  this.getAbsaReqList();
    })
  }

  getReqView(reqno: string) {
    let lclobj = { ABSAREQNO: reqno };
    this.currentreqBS.next([]);
    this.postGEN(lclobj, "GET_BIGVIEW").subscribe(reply => {
      if (!reply || reply.RESULT.length == 0) {
        return
      }
      if (reply.RESULT) {

        let feedback = this.processBigview(reply.RESULT)
        this.lclstate.dates = JSON.parse(reply.RESULT[0].DATES)
        let tempohs = {
          REFERENCE:'',
          OHSRISK:'',
          AGREEDRISK:'',
          PROJSCREENING:'',
          VENDORVETTED:'',
          SWMS_OHS_REQ:'',
          SWMS_OHS_AP_DATE:'',
          COMPLIANCE_CONTACT:'',
          SWMS_OHS_NA: false,
          PROGRESS: 0,
          COMMENTS:''
        }
        let inputohs = reply.RESULT[0].OHS
        this.lclstate.ohs = { ...tempohs, ... inputohs }
        this.lclstate.dates['TRACKNOTE'] = this.xtdatob(this.lclstate.dates['TRACKNOTE'])
        this.lclstate.dates['LAST_COMMENT'] =  this.lclstate.dates['TRACKNOTE'].substring(0,250);
        this.lclstate.phase = reply.RESULT[0].PHASE;
        this.lclstate.closed = (this.lclstate.phase > 'PHASE' && this.lclstate.phase < 'PHASE11') ? false : true;
        this.lclstate.currentreq = reply.RESULT[0];
        this.currentreqBS.next(feedback[0]);
        this.getTasks({ LINKEDOBJNR: feedback[0].ABSAREQNO });
        this.router.navigate(['requestedit/' + feedback[0].ABSAREQNO])
      }
    })
  }
  getTasks(task: any) {
    this.tasklistBS.next([]);
    this.tasklinesBS.next([]);
    this.reqdata = [];
    this.postGEN(task, 'TASKLIST').subscribe(reply => {
      if (!reply || reply.RESULT.length == 0) {
        return
      }
      reply.RESULT.forEach(line => {
        line.INSTRUCTION = decodeURIComponent(line.INSTRUCTION)
      })
      this.tasklistBS.next(reply.RESULT)
      this.mapSAPtoTasks(reply.RESULT)
    }
    )
  }
  getCIPList(year = '2023', region) {
    this.postGEN({ DETAILS: 'FUND', REGION: region }, "GET_BIGVIEW").subscribe(reply => {
      if (!reply || reply.RESULT.length == 0) {
        return
      }
      if (!Array.isArray(reply.RESULT)) {
        if (reply.RESULT.indexOf('Invalid Token') !== -1) {
          this.messagesBS.next('Invalid Token - Please log in again');
          return
        } else { return }
      }
      reply.RESULT.forEach(ele => {
        ele.DETAILS = this.xtdatob(ele.DETAILS)
        ele.LAST_COMMENT = this.xtdatob(ele.LAST_COMMENT)
        // ele.DATES = ele.DATES?this.xtdatob(ele.DATES) : ''
      })
      this.ciplistBS.next(reply.RESULT);
      //  this.getAbsaReqList();
    })
  }

  xtdbtoa(instring: string) {
    if (instring) {
      try {
        return btoa(encodeURIComponent(instring))
      } catch (err) {
        this.messagesBS.next('Conversion Failed')
      }
      return '';
    } else {
      return '';
    }
  }

  xtdatob(instring: string) {
    if (instring) {
      try {
        return atob(decodeURIComponent(instring))
      } catch (err) {
        this.messagesBS.next('Conversion Failed')
      }
      return '';
    } else {
      return '';
    }
  }

  async getone(reference) {
    
    this.postGEN({ REGION: 'Region 2', MASK: '', REFERENCE: reference, ACTION: 'F' }, 'GET_PROJLIST').subscribe(list => {
      if (Array.isArray(list.RESULT) && list.RESULT.length > 0) {
       
        this.testcontainerBS.next(list.RESULT[0].ABSAREQNO)
        this.counter++;
      } else {
        this.testcontainerBS.next('empty');
      }
    })
  }
  mapSAPtoTasks(tasks = []) {
    let temp = [
      {
        pID: 101,
        pName: this.currentprojBS.value['TITLE'],
        pStart: "",
        pEnd: "",
        pClass: "ggroupblack",
        pLink: "",
        pMile: 0,
        pRes: "Brian",
        pComp: 0,
        pGroup: 1,
        pParent: 0,
        pOpen: 1,
        pDepend: "",
        pCaption: "",
        pNotes: "Some Notes text",
      }];
    tasks.forEach((st, index) => {
     if (st['NEXTSTATUS'] == 'PHASES') {
      let today = new Date();
      let ptarget = new Date(st.DUEDATE);
      console.log(ptarget);
      console.log(today)
      //turn string 'yyyy-mm-dd' into date


      let slate = st.TASK_STATUS == 100 ?  "gtaskblue" : today < ptarget?"gtaskgreen": "gtaskred";
      let lineout = {
        pID: st.TASKNO,
        pName: st.SHORT_INSTRUCTION,
        pStart: st.STARTDATE,
        pEnd: st.DUEDATE,
        pRes: st.DELEGATENAME,
        pClass: slate,
        pComp: 80 ,
        pParent: 101,
        pLink: "",
        pMile: 0,
        pGroup: 1,
        pDepend: "",
        pCaption: "",
        pNotes: "Some Notes text",
        pOpen: 0, 
    
     }
    //   let linout2 = {
    //     pID: st.TASKNO,
    //     pName: st.SHORT_INSTRUCTION,
    //     pStart: st.STARTDATE,
    //     pDuration: 45,
    //     pEnd: st.DUEDATE,
    //     pRes: st.DELEGATENAME,
    //     pClass: slate,
    //     pWeight: 10,
    //     pComp: parseInt(st.TASK_STATUS) ,
    //     pParent: 0,
    //     pGroup: 1,
    //     pOpen: st.ACTIONTYPE == "PHASE01" ? 1 : 0, 
    //     pReference: st.LINKEDOBJNR,
    //     ACTIONTYPE: st.ACTIONTYPE
   
  temp.push(lineout)
}
    })
    this.tasklinesBS.next(temp);
    this.reqdata = [...temp];
  }
  locateFunds(region, cipgroup, cipcode) {

  }
  getProgresslist(region, pmanager, reference = '') {
    if (reference.length > 1) {
      region = '*';
      pmanager = '*'
    } else {
      if (this.progressBS.value.length == 0 || this.lclstate.region != region || this.lclstate.pmanager != pmanager) {
        this.progressBS.next([]);
        this.lclstate.region = region;
        this.lclstate.pmanager = pmanager;
      } else {
        region = this.lclstate.region;
        pmanager = this.lclstate.pmanager;
      }
    }
    this.postGEN({ REGION: region, MASK: pmanager, REFERENCE: reference, ACTION: 'F' }, 'GET_PROJLIST').subscribe(list => {
      if (list.RESULT[0]?.STATUS != 'Error') {

        let titem = list.RESULT.map(line => {
          if (line.length < 2) { return }
          let innerline = JSON.parse(line.PROGRESSTRACK)
          let temp = {
            ABSAREQNO: line.ABSAREQNO,
            PROJLINK: line.PROJLINK,
            ONEVIEW: line.ONEVIEW,
            REGION: line.REGION,
            KNOWNAS: this.xtdatob(line.SKNOWNAS),
            BASELINEBUDGET: line.BASELINEBUDGET,
            POVALUE: line.POVALUE,
            TRACKERCODE: line.TRACKERCODE,
            CIPBUDGET: line.CIPBUDGET,
            APPROVAL_STATUS: this.getApprovalText(line.APPROVAL_STATUS),
            CONTINGENCY: line.CONTINGENCY,
            INITIATIVE: line.INITIATIVE,
            CIPCODE: line.CIPCODE,
            BUDGETGROUP: line.CIPGROUP,
            STATUS: line.STATUS,
            TITLE: this.xtdatob(line.STITLE),
            DUEDATE: line.DUEDATE,
            PMANAGER: line.PMANAGER,
            ACCOUNTANT: line.ACCOUNTANT,
            PROG01: innerline[0].PROG01,
            PROG02: innerline[0].PROG02,
            PROG03: innerline[0].PROG03,
            PROG04: innerline[0].PROG04,
            PROG05: innerline[0].PROG05,
            PROG06: innerline[0].PROG06,
            PROG07: innerline[0].PROG07,
            PROG08: innerline[0].PROG08,
            PROG09: innerline[0].PROG09,
            PROG10: innerline[0].PROG10,
            DATE01: innerline[0].DATE01,
            DATE02: innerline[0].DATE02,
            DATE03: innerline[0].DATE03,
            DATE04: innerline[0].DATE04,
            DATE05: innerline[0].DATE05,
            DATE06: innerline[0].DATE06,
            DATE07: innerline[0].DATE07,
            COMMENT: line.LASTCOMMENT,
            DATE08: innerline[0].DATE08,
            DATE09: innerline[0].DATE09,
            DATE10: innerline[0].DATE10,
            TRACKNOTE: this.xtdatob(innerline[0].TRACKNOTE),
            PHASE: line.PHASE,
            ABSAPHASE : line.PHASE < 'PHASE05 '? 'Planning' : line.PHASE < 'PHASE07 '? 'Implementation' : line.PHASE < 'PHASE08 '? 'Execution' :  line.PHASE < 'PHASE11 '? 'Closing': 'Closed',
            BUDGET: line.BUDGET,
            COSTS: line.COSTS,
            TRAVEL: line.TRAVEL,
            COMMITMENT: line.COMMITMENT,
            REVENUE: line.REVENUE,
            M_FEE: line.M_FEE,
          }
          return temp
        })
        if (this.progressBS.value.length == 0) {
          this.progressBS.next(titem);
        } else {
          let tbstemp = this.progressBS.value;
          let idx = tbstemp.findIndex(line => {
            return line.ABSAREQNO == titem[0].ABSAREQNO;
          })
          if (idx) {
            tbstemp[idx] = titem[0];
            this.progressBS.next(tbstemp);
          } else {
            this.progressBS.next(titem);
          }
        }

      }
    })


  }

  /*******postGen******************************************************* */
  postGEN(lclobj: any, methodname: string, classname: string = "PSTRACKER") {
    // // console.log(lclobj);
    this.loading = true;
    this.loadingBS.next(true);
    let sys = "PROD";

    if (classname !== 'USER' && sys != 'PROD') {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          token: 'BK175mqMN0',
        })
      };
      const call2 = {
        context: {
          CLASS: classname,
          TOKEN: 'BK175mqMN0',
          METHOD: methodname
        },
        data: lclobj

      };
      let mypost = this.http.post('https://io.bidvestfm.co.za/BIDVESTFM_API_ZRFC3/request?sys=prod',
        call2, httpOptions);

      return mypost.pipe(
        map(data => {
          this.loading = false;
          this.loadingBS.next(false);
          try {
            let represult = (data && data['d'] && data['d'].exResult) ? JSON.parse(JSON.parse(data['d'].exResult.replace(/[^\x00-\x7F]/g, ""))) : data
            if (!represult || !represult.RESULT) {
              throw 'Error unknown '
            } else {
              if (!Array.isArray(represult.RESULT) && typeof represult.RESULT === 'string' && represult.RESULT.includes('ERR')) {
                try {
                  let errormsg = JSON.parse(represult.RESULT)
                  this.messagesBS.next(errormsg['ERR']);
                  throw errormsg['ERR']
                }
                catch (e) {
                  throw 'Error message unknown '
                }
              }
              return represult
            }
          } catch (e) {
            this.messagesBS.next('Bad Json Reply -' + call2.context.METHOD);
            // console.log(JSON.parse(data['d'].exResult.replace(/[^\x00-\x7F]/g, "")))
            throw 'Bad Json reply'
          }

        })
      )
    } else {
      const BASE_POST = 'https://io.bidvestfm.co.za/BIDVESTFM_API_GEN_PROD/genpost';
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'Basic dXNlcm5hbWU6cGFzc3dvcmQ='
        })
      };
      const uploadvar = {
        callType: 'post',
        chContext: {
          CLASS: classname,
          METHOD: methodname,
          TOKEN: "BK175mqMN0"
        },
        chData: lclobj
      };
      return this.http
        .post<any>(BASE_POST, uploadvar, httpOptions).pipe(
          map(data => {
            this.loading = false;
            this.loadingBS.next(false);
            try {
              let represult = (data && data.d && data.d.exResult) ? JSON.parse(JSON.parse(data.d.exResult.replace(/[^\x00-\x7F]/g, ""))) : data
              if (!represult || !represult.RESULT) {
                throw 'Error unknown '
              } else {
                if (!Array.isArray(represult.RESULT) && typeof represult.RESULT === 'string' && represult.RESULT.includes('ERR')) {
                  try {
                    let errormsg = JSON.parse(represult.RESULT)
                    this.messagesBS.next(errormsg['ERR']);
                    throw errormsg['ERR']
                  }
                  catch (e) {
                    throw 'Error message unknown '
                  }
                }
                return represult
              }
            } catch (e) {
              this.messagesBS.next('Bad Json Reply');
              // console.log(JSON.parse(data.d.exResult.replace(/[^\x00-\x7F]/g, "")))
              throw 'Bad Json reply'
            }

          })
        )
    }

  }
  getSingleApproval(reqno) {
    this.postGEN({ ABSAREQNO: reqno }, "GET_APPROVAL", "PSTRACKER").subscribe(reply => {
      if (!reply || reply.RESULT.length == 0) {
        return
      }
      this.approvalBS.next(JSON.parse(reply.RESULT));
    })
  }
  getCommentList(Projref = '', area = '', specific = '') {
    this.commentlistBS.next([]);
    if (Projref.length < 5) {
      return
    }
    this.postGEN({ REFERENCE: Projref, LEVEL_2: area, Level_3: specific }, "GET_COMMENTLIST", "PROJECTS").subscribe(reply => {
      if (!reply || reply.RESULT.length == 0) {
        return
      }
      this.pdfready = true;
      this.commentlistBS.next(reply.RESULT);
    })
  }
  putComment(projCOMMENT: any) {
    this.postGEN(projCOMMENT, "PUT_COMMENT", "PROJECTS").subscribe(reply => {
      // // console.log(reply.RESULT);
      // this.getCommentList(projcomment.PSPID);
    })
  }
  getProgLookups() {
    if (localStorage.getItem('proglookupx')) {
      this.proglookupsBS.next(JSON.parse(localStorage.getItem('proglookup')));
      this.getPMList();
      this.lookupBuilder();
    } else {
      if (this.cipgroups.length < 2) {
        this.postGEN({ D: "prog" }, "GET_LOOKUPS").subscribe(reply => {
          if (!reply || reply.RESULT.length == 0) {
            return
          }
          this.proglookupsBS.next(reply.RESULT);
          localStorage.setItem('proglookup', JSON.stringify(reply.RESULT));
          this.getPMList();
          this.lookupBuilder();
        })
      }
    }
  }
  lookupBuilder() {
    if (this.boqs.length > 0 || this.proglookupsBS?.value.length === 0) {
      return;
    }
    this.cipcodes = [];
    this.workstreams = [];
    this.cipgroups = [];
    this.boqs = [];
    this.approvals = [];
    this.scopes = [];
    this.costs = [];
    this.pos = [];
    this.invsubs = [];
    this.implements = [];
    this.risks = [];
    this.regions = [];
    this.provregions = [];
    this.actionlist = [];
    this.proglookupsBS.value.forEach(progline => {
      switch (progline.A) {
        case 'SCOPE': {
          this.scopes.push({ code: progline.B, text: progline.C })
          break;
        }
        case 'ACTIONS': {
          this.actionlist.push({ code: progline.B, text: progline.C, instruction: progline.E })
          break;
        }
        case 'APPROVAL': {
          this.approvals.push({ code: progline.B, text: progline.C })
          break;
        }
        case 'BOQ': {
          this.boqs.push({ code: progline.B, text: progline.C })
          break;
        }
        case 'COSTS': {
          this.costs.push({ code: progline.B, text: progline.C })
          break;
        }
        case 'PO': {
          this.pos.push({ code: progline.B, text: progline.C })
          break;
        }
        case 'IMPLEMENT': {
          this.implements.push({ code: progline.B, text: progline.C })
          break;
        }
        case 'INVSUB': {
          this.invsubs.push({ code: progline.B, text: progline.C });
          break;
        }
        case 'RISKS': {
          this.risks.push({ code: progline.B, text: progline.B });
          break;
        }
        case 'REGIONS': {
          this.regions.push({ code: progline.B, text: progline.C })
          break;
        }
        case 'PROVREGIONS': {
          this.provregions.push({ code: progline.B, text: progline.C })
          break;
        }
        case 'CIPCODE': {
          this.cipcodes.push({ code: progline.B, text: progline.B + '-' + progline.C, filter: progline.E })
          break;
        }
        case 'WORKSTREAM': {
          this.workstreams.push({ code: progline.B, text: progline.C })
          break;
        }
        case 'CIPGROUPS': {
          this.cipgroups.push({ code: progline.B, text: progline.B + '-' + progline.C, filter: progline.D })
          break;
        }
      }

      if (this.cipgroups.length > 0) {
        this.cipcodes.sort((a, b) => (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0))
        this.cipgroups.sort((a, b) => (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0))
        if (this.regions.length > 1) {
          const index = this.regions.findIndex(object => object.code === 'ALL');
          if (index === -1) {
            this.regions.push({ code: 'ALL', text: '* Show All' })
          }
        }
        this.lookupsreadyBS.next(true);
      }
    })
  }
  getPMList() {

    this.postGEN({ MASK: '' }, 'GET_PMLIST').subscribe(list => {
      if (!list || list.RESULT.length == 0) {
        return
      }
      this.pms = [];
      list.RESULT.forEach(a => {
        a.D = a.D.replace(/\s\s+/g, ' ');
        //check for duplicate of a.D in array this.pms if not push a to pms
        if (this.pms.findIndex(b => b.D === a.D) === -1) {
          this.pms.push(a);
        }
      })
      this.pmlist = [...this.pms];
      this.pmlistBS.next(this.pmlist);
      localStorage.setItem('pmlist', JSON.stringify(list.RESULT))
    })

  }
  getApprovalText(APPROVAL_STATUS = '') {
    if (APPROVAL_STATUS === '' || this.approvals.length === 0) {
      return 'Unknown'
    }
    let re = /pprov|100/g;

    if (APPROVAL_STATUS.search(re) != -1) return 'Approved';

    let temp = this.approvals.find(line => {
      return line.code === APPROVAL_STATUS.replace(/%/g, '');
    })
    if (temp && temp.text) {
      return temp.text;
    } else {
      return 'Unknown'
    }

  }
  pushFeedback() {
    const newdates = { ...this.lclstate.dates, ...this.lclstate.feedback };
    let updater = { ...this.lclstate.feedback };
    let todo = { DATES: this.lclstate.dates, FEEDBACK: updater }
    this.postGEN(todo, 'UPDATE_TRACKER').subscribe(item => {
      this.messagesBS.next('All Done')
    })
  }
  mapWBS2Req(wbs = '') {
    let lclresult = this.Wbs2Req.find(line => {
      return line.PROJLINK === wbs
    })
    if (lclresult && lclresult['ABSAREQNO']) {
      return lclresult['ABSAREQNO'];
    }
    return 0;
  }
  buildcodes() {
    this.phaseprog = [];
    this.phaseprog.push({ phase: 'Register', codes: [{ code: 0, text: 'Not started' }, { code: 100, text: 'Completed' }] })
    this.phaseprog.push({
      phase: 'Initiation with Stakeholders', codes: [{ code: 0, text: 'Not started' },
      { code: 20, text: 'Site Visited & Assessment Started' },
      { code: 60, text: 'Engagements and Scope in Review' },
      { code: 80, text: 'Scope Finalisation' },
      { code: 100, text: 'Scope Signed Off' }
      ]
    })
    this.phaseprog.push({
      phase: 'Costing and DD', codes: [{ code: 0, text: 'Not started' },
      { code: 20, text: 'Started' },
      { code: 60, text: 'Early Progresss' },
      { code: 80, text: 'Advanced Progress' },
      { code: 100, text: 'Completed' }
      ]
    })
    this.phaseprog.push({ phase: 'OHS Clearance', codes: [{ code: 0, text: 'Not started' },
    { code: 10, text: 'Project Screening' }, { code: 20, text: 'Initial Risk' }, { code: 30, text: 'Agreed Risk' }, { code: 50, text: 'SWMS Submission' },
     { code: 75, text: 'SWMS Approved' },  { code: 85, text: 'ABSA OHS Submission' }, { code: 100, text: 'OHS Cleared' }] })
 
    this.phaseprog.push({ phase: 'Approval Board', codes: [{ code: 0, text: 'Not Started' }, { code: 40, text: 'Submitted' }, { code: 60, text: 'Awaiting' }, { code: 100, text: 'Approved' }] })
    this.phaseprog.push({ phase: 'Lead Time', codes: [{ code: 0, text: 'Not started' }, { code: 50, text: 'In Progress' }, { code: 100, text: 'Completed' }] })
    this.phaseprog.push({
      phase: 'On Site ', codes: [
        { code: 0, text: 'Not started' },
        { code: 20, text: 'Started' },
        { code: 40, text: 'Progress' },
        { code: 60, text: 'Early Progresss' },
        { code: 80, text: 'Advanced Progress' },
        { code: 100, text: 'Completed' }]
    })
    this.phaseprog.push({ phase: 'Proof of Completion', codes: [{ code: 0, text: 'Not started' },{ code: 50, text: 'Partial POC Submitted' }, { code: 100, text: 'Completed' }] })
  this.phaseprog.push({ phase: 'Billing Process', codes: [{ code: 0, text: 'Not started' }, { code: 30, text: 'Partially Invoiced' }, { code: 60, text: 'Invoices Submitted' }, { code: 100, text: 'Completed' }] })
  this.phaseprog.push({ phase: 'Expected Cash Flow Date', codes: [{ code: 0, text: 'Not started' }, { code: 50, text: 'Partial Cash Flow' },{ code: 100, text: 'Completed' }] })
    return this.phaseprog;
  }
  formatString(strin = '') {
    if (strin.substring(strin.length - 2).includes('.')) {
      strin = strin + '0';
    }
    if (!strin.substring(strin.length - 3).includes('.')) {
      strin = strin + '.00'
    }
    strin = strin.replace(/,/g, " ");
    let tempstr = (strin.includes("-")) ? '    (' + strin.substring(1) + ')' : '       ' + strin;
    return tempstr.substring(tempstr.length - 14)
  }
  /******************************************* */
  uploadQuoteFile2SAP(file, resultobj, filerefer, vendor, currentUser) {
    const filedata = resultobj.split(',').pop();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic dXNlcm5hbWU6cGFzc3dvcmQ='
      })
    };
    const uploadvar = {
      callType: 'post',
      chContext: {
        CLASS: 'ATTACH',
        METHOD: ''
      },
      chData: {
        fileName: file[0].name,
        fileSize: file[0].size,
        fileType: file[0].type,
        fileContent: filedata,
        uname: currentUser,
        targetObjId: filerefer,
        targetObjType: 'RFQDOC',
        extras: vendor,
        apikey: 'PSTRACKER'
      }
    };
    return this.http
      .post<any>('https://io.bidvestfm.co.za/BIDVESTFM_API_GEN_PROD/genpost' + '?sys=PROD', uploadvar, httpOptions);
  }
}
