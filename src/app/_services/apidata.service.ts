import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApidataService {

  lclstate  = {
    sections:[],
    active: 0,
    region: '',
    pmanager: '',
    dates: {},
    sites:'',
    currentreq:{},
    phase: '',
    comments:[],
    feedback: {
      REFERENCE:'',
      BUDGETAMT:0,
      FORECAST_START:'',
      FORECAST_END:'',
      RATING:'',
      LAST_COMMENT: '',
      TRACKNOTE:''
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
  currentcipline: any ;

  public loadingBS = new BehaviorSubject<boolean>(false)
  public ciplineadjBS = new BehaviorSubject([]);

  public messagesBS = new BehaviorSubject<string>('');
  public messages$ = this.messagesBS.asObservable();

  public biglistBS = new BehaviorSubject([]);
  public biglist$ = this.biglistBS.asObservable();

  public tasklistBS = new BehaviorSubject([]);
  public tasklist$ = this.tasklistBS.asObservable();

  public budgetlistBS = new BehaviorSubject([]);
  public budgetlist$ = this.budgetlistBS.asObservable();

  public currentprojBS = new BehaviorSubject([]);
  public currentproj$ = this.currentprojBS.asObservable();

  public currentreqBS = new BehaviorSubject([]);
  public currentreq$ = this.currentreqBS.asObservable();
  
  public commentlistBS = new BehaviorSubject([]);
  public commentlist$ = this.commentlistBS.asObservable();

  public pmlistBS = new BehaviorSubject([]);
  public pmlist$ = this.pmlistBS.asObservable();

  public progressBS = new BehaviorSubject([]);
  public ptogress$ = this.currentprojBS.asObservable();

  public proglookupsBS = new BehaviorSubject([]);
  public proglookups$ = this.proglookupsBS.asObservable();

  public lookupsreadyBS = new BehaviorSubject(false);
  public lookupsready$ = this.lookupsreadyBS.asObservable();
  
  public ciplistBS = new BehaviorSubject([]);
  public tasklinesBS = new BehaviorSubject([]);
  public wbs2reqmapperBS = new BehaviorSubject(false);
  public testcontainerBS = new BehaviorSubject('');
  constructor(private http: HttpClient, @Inject(LOCALE_ID) public locale: string) { }

  getWbs2Req(){
    this.postGEN( {A:''},'GET_REQ2WBS').subscribe(reply =>{
     this.Wbs2Req = JSON.parse(reply.RESULT);
     this.wbs2reqmapperBS.next(true)
    })
  }
  getCipline(cipid = ''){
    this.postGEN( {INITIATIVE: cipid},'GET_CIPLINE_MVTS').subscribe(reply =>{
     this.currentcipline = reply.RESULT[0];
     this.ciplineadjBS.next(reply.RESULT)
    })
  }
  getBIGList(region = '', pm = '*') {
    this.postGEN({ REGION: region, PMANAGER: pm }, "GET_BIGVIEW").subscribe(reply => {
      if (!reply || reply.RESULT.length == 0){
        return
     }
     if ( !Array.isArray(reply.RESULT)){
      if (reply.RESULT.indexOf('Invalid Token') !== -1){
this.messagesBS.next('Invalid Token - Please log in again');
return
      } else {return }  
     }
      reply.RESULT.forEach(ele => {
        ele.DETAILS = atob(ele.DETAILS)
        ele.SITENOTES = atob(ele.SITENOTES)
        ele.SITES = atob(ele.SITES)
        ele.KNOWNAS = atob(ele.KNOWNAS)
        ele.LAST_COMMENT = atob(ele.LAST_COMMENT)
        ele.DATES = ele.DATES? atob(ele.DATES) : ''
        if (ele.DATES.includes('PROG')){ 
          try {
            let lclobj = JSON.parse(ele.DATES)
          ele['PROGRESS']  = lclobj } catch(e) {
            ele['PROGRESS'] = {} ;
            }
          }
        ele.APPROVAL_MOTIVATE = atob(ele.APPROVAL_MOTIVATE)
        ele.APPROVAL_NOTE = atob(ele.APPROVAL_NOTE)
        ele.APPROVAL = atob(ele.APPROVAL)



      })
      this.biglistBS.next(reply.RESULT);
      //  this.getAbsaReqList();
    })
  }
  formatDate(datein ): string {
    datein = new Date(datein);
    datein.setHours(0, 0, 0, 0);
    let dd = ''; let mm = ''; let yyyy = 0;
    try {
      console.log(datein);
      dd = String(datein.getDate()).padStart(2, '0');
      mm = String(datein.getMonth() + 1).padStart(2, '0'); //January is 0!
      yyyy = datein.getFullYear();
    } catch (e) {
      alert(datein)
    }
    return yyyy + '-' + mm + '-' + dd;
  }
   getBUDGETList(region) {
    this.postGEN({ REGION: region }, "GET_BUDGETVIEW").subscribe(reply => {
      if (!reply || reply.RESULT.length == 0){
        return
     }
     if ( !Array.isArray(reply.RESULT)){
      if (reply.RESULT.indexOf('Invalid Token') !== -1){
this.messagesBS.next('Invalid Token - Please log in again');
return
      } else {return }  
     }
      reply.RESULT.forEach(ele => {
        try {
          if (ele.FCASTSTARTDATE < '1900-01-01'){
            ele.FCASTSTARTDATE = ele.PROPSTARTDATE;
            ele.FCASTENDDATE  = ele.PROPENDDATE;
            ele.FCASTCASHFLOWDATE = ele.CASHFLOWDATE;

          }
          if (!ele.PROJLINK){
            ele.DATE06 = ele.FCASTSTARTDATE;
            ele.DATE07 = ele.FCASTENDDATE;
            ele.DATE10 = ele.FCASTCASHFLOWDATE;
          }
          ele.DETAILS = ele.DETAILS.length > 3 ? atob(ele.DETAILS): '';
          ele.LAST_COMMENT = ele.LAST_COMMENT.length > 3 ? atob(ele.LAST_COMMENT): ''
        } catch(e) {

        } 
      })
      this.budgetlistBS.next(reply.RESULT);
      //  this.getAbsaReqList();
    })
  }

  getReqView(reqno: string) {
    let lclobj = { ABSAREQNO: reqno };
    this.biglistBS.next([]);
    this.currentreqBS.next([]);
    this.postGEN(lclobj, "GET_BIGVIEW").subscribe(reply => {
      if (!reply || reply.RESULT.length == 0){
        return
     }
      if (reply.RESULT) {
        try {
          reply.RESULT[0].DETAILS = atob(reply.RESULT[0].DETAILS)
          reply.RESULT[0].KNOWNAS = atob(reply.RESULT[0].KNOWNAS)
          reply.RESULT[0].SITENOTES = atob(reply.RESULT[0].SITENOTES)
          reply.RESULT[0].SITES = atob(reply.RESULT[0].SITES)
          reply.RESULT[0].APPROVAL_MOTIVATE = (reply.RESULT[0].APPROVAL_MOTIVATE) ? atob(reply.RESULT[0].APPROVAL_MOTIVATE) : '';
          reply.RESULT[0].APPROVAL_NOTE = (reply.RESULT[0].APPROVAL_NOTE) ? atob(reply.RESULT[0].APPROVAL_NOTE) : '';
        } catch (ex) {
        }
        this.lclstate.dates = JSON.parse(atob(reply.RESULT[0].DATES))
        this.lclstate.phase = reply.RESULT[0].PHASE ;
        // const fbobj =  {
        //   REFERENCE: reply.RESULT[0].ABSAREQNO,
        //   BUDGETAMT: reply.RESULT[0].BUDGETAMT,
        //   FORECAST_START:reply.RESULT[0].FORECAST_START,
        //   FORECAST_END:reply.RESULT[0].FORECAST_END,
        //   RATING:reply.RESULT[0].RATING,
        //   LAST_COMMENT: atob(reply.RESULT[0].LAST_COMMENT),
        //   TRACKNOTE: ''
        // }
      //  this.lclstate.feedback = {...this.lclstate.feedback, ...fbobj}
        this.lclstate.currentreq = reply.RESULT[0];
        this.biglistBS.next(reply.RESULT);
        this.currentreqBS.next(reply.RESULT[0]);
        this.getTasks({ LINKEDOBJNR: reply.RESULT[0].ABSAREQNO });
      }
    })
  }
  getTasks(task: any) {
    this.tasklistBS.next([]);
    this.reqdata = [];
    this.postGEN(task, 'TASKLIST').subscribe(reply => {
      if (!reply || reply.RESULT.length == 0){
        return
     }
      this.tasklistBS.next(reply.RESULT)
      this.mapSAPtoTasks(reply.RESULT)
    }
    )
  }
  getCIPList(year = '2023', region){
    this.postGEN({ DETAILS: 'FUND', REGION: region }, "GET_BIGVIEW").subscribe(reply => {
      if (!reply || reply.RESULT.length == 0){
        return
     }
     if ( !Array.isArray(reply.RESULT)){
      if (reply.RESULT.indexOf('Invalid Token') !== -1){
  this.messagesBS.next('Invalid Token - Please log in again');
  return
      } else {return }  
     }
      reply.RESULT.forEach(ele => {
        ele.DETAILS = atob(ele.DETAILS)
        ele.LAST_COMMENT = atob(ele.LAST_COMMENT)
        // ele.DATES = ele.DATES? atob(ele.DATES) : ''
      })
      this.ciplistBS.next(reply.RESULT);
      //  this.getAbsaReqList();
    })
    }

  //   getSingle(reqno) {
  //     // if (this.reqdata[0].pReference != reqno){
  //    this.postGEN({ABSAREQNO: reqno}, 'GET_ABSAREQUEST').subscribe(line=> {
  //     this.currentprojBS.next(line.RESULT)
  //     this.postGEN({ LINKEDOBJNR: reqno }, 'TASKLIST').subscribe(taskgroup => {
  //       this.mapSAPtoTasks(taskgroup.RESULT)
  //     })
  //  })
  //     // }
  //   }
 async getone(reference) {
    console.log(reference);
    this.postGEN({ REGION: 'Region 2', MASK: '', REFERENCE: reference, ACTION: 'F' }, 'GET_PROJLIST').subscribe(list => {
     if ( Array.isArray(list.RESULT) && list.RESULT.length > 0){
      console.log('ok'+ list.RESULT[0].ABSAREQNO);
      this.testcontainerBS.next(list.RESULT[0].ABSAREQNO)
this.counter ++;
     }else {
      this.testcontainerBS.next('empty');
     }
    })
  }
    mapSAPtoTasks(tasks = []) {
      let temp = [];
      tasks.forEach((st, index) => {
        var match = st.ACTIONTYPE.match(/\d+/);
      
        let lineout = {
          pID: st.TASKNO,
          pName: st.SHORT_INSTRUCTION,
          pStart: st.STARTDATE,
          pDuration: 45,
          pEnd: st.DUEDATE,
          pRes: st.DELEGATENAME,
          pClass: st.ACTIONTYPE == "PHASE01" ? "ggroupblack" : "gtaskgreen",
          pWeight: 10,
          pParent: st.ACTIONTYPE == "PHASE01" ? st.ACTIONTYPE : 101 ,
          pGroup: 1,
          pOpen: st.ACTIONTYPE == "PHASE01" ? 1 : 0, pComp: '',
          pReference: st.LINKEDOBJNR,
          ACTIONTYPE: st.ACTIONTYPE
        }
        temp.push(lineout)
  
      })
      this.tasklinesBS.next(temp);
      this.reqdata = [...temp];
    }

  getProgresslist(region,pmanager,reference = ''){
    if (this.progressBS.value.length == 0 || this.lclstate.region != region || this.lclstate.pmanager != pmanager){
      this.progressBS.next([]);
      this.lclstate.region = region ;
      this.lclstate.pmanager = pmanager;
      this.postGEN({REGION: region, MASK: pmanager,REFERENCE: reference, ACTION:'F'},'GET_PROJLIST').subscribe( list=> {
        if (list.RESULT[0]?.STATUS != 'Error') {

     let titem =     list.RESULT.map(line => {
      if ( line.length < 2 ) { return }
      let innerline = JSON.parse(line.PROGRESSTRACK)
     let temp = {
        ABSAREQNO: line.ABSAREQNO,
        PROJLINK: line.PROJLINK,
        KNOWNAS: line.KNOWNAS,
        INITIATIVE: line.INITIATIVE,
        STATUS: line.STATUS,
        TITLE: line.TITLE,
        DUEDATE: line.DUEDATE,
        PMANAGER: line.PMANAGER,
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
        DATE06: innerline[0].DATE06,
        DATE07: innerline[0].DATE07,
        COMMENT: line.LASTCOMMENT,
        DATE08: innerline[0].DATE08,
        DATE09: innerline[0].DATE09,
        DATE10: innerline[0].DATE10,
        PHASE: line.PHASE,
        BUDGET: line.BUDGET,
        COSTS: line.COSTS,
        TRAVEL: line.TRAVEL,
        COMMITMENT: line.COMMITMENT,
        REVENUE: line.REVENUE,
        M_FEE: line.M_FEE,
      }
     return temp
     })
          this.progressBS.next(titem);
        }
      })
    }
   let old = ([{
      REFERENCE: 'ASP-GW0123',
      KNOWNAS: 'Maponye Mall',
      STATUS: '',
      TITLE: 'Fix the tiles',
      DUEDATE: '2023-03-12',
      PMANAGER: 'Additional Resource 1',
      PROG_1: '0%',
      PROG_2: '0%',
      PROG_3: '0%',
      PROG_4: '0%',
      PROG_5: '0%',
      PROG_6: '0%',
      PROG_7: '0%',
      PROG_8: '0%',
      PROG_9: '0%',
      PROG10: '0%',
      FORECAST_START: '2023-01-21',
      FORECAST_END: '2023-04-01',
      COMMENT: 'last comment here',
      PHASE: 'PHASE_5'
    },{
      REFERENCE: 'ASP-GW0123',
      KNOWNAS: 'Maponye Mall',
      STATUS: '',
      TITLE: 'Fix the tiles',
      DUEDATE: '2023-03-12',
      PMANAGER: 'Additional Resource 1',
      PROG_1: '0%',
      PROG_2: '0%',
      PROG_3: '0%',
      PROG_4: '0%',
      PROG_5: '0%',
      PROG_6: '0%',
      PROG_7: '0%',
      PROG_8: '0%',
      PROG_9: '0%',
      PROG10: '0%',
      FORECAST_START: '2023-01-21',
      FORECAST_END: '2023-04-01',
      COMMENT: 'last comment here',
      PHASE: 'PHASE_7'
    },{
      REFERENCE: 'ASP-GW0123',
      KNOWNAS: 'Maponye Mall',
      STATUS: '',
      TITLE: 'Fix the tiles',
      DUEDATE: '2023-03-12',
      PMANAGER: 'Additional Resource 1',
      PROG_1: '0%',
      PROG_2: '0%',
      PROG_3: '0%',
      PROG_4: '0%',
      PROG_5: '0%',
      PROG_6: '0%',
      PROG_7: '0%',
      PROG_8: '0%',
      PROG_9: '0%',
      PROG10: '0%',
      FORECAST_START: '2023-01-21',
      FORECAST_END: '2023-04-01',
      COMMENT: 'last comment here',
      PHASE: 'PHASE_3'
    },
    {
      REFERENCE: 'ASP-GW0123',
      KNOWNAS: 'Maponye Mall',
      STATUS: '',
      TITLE: 'Fix the tiles 21',
      DUEDATE: '2023-03-12',
      PMANAGER: 'Additional Resource 2',
      PROG_1: '0%',
      PROG_2: '0%',
      PROG_3: '0%',
      PROG_4: '0%',
      PROG_5: '0%',
      PROG_6: '0%',
      PROG_7: '0%',
      PROG_8: '0%',
      PROG_9: '0%',
      PROG10: '0%',
      FORECAST_START: '2023-01-21',
      FORECAST_END: '2023-04-01',
      COMMENT: 'last comment here',
      PHASE: 'PHASE_2'
    },{
      REFERENCE: 'ASP-GW0123',
      KNOWNAS: 'Maponye Mall',
      STATUS: '',
      TITLE: 'Fix the tiles 22',
      DUEDATE: '2023-03-12',
      PMANAGER: 'Additional Resource 2',
      PROG_1: '0%',
      PROG_2: '0%',
      PROG_3: '0%',
      PROG_4: '0%',
      PROG_5: '0%',
      PROG_6: '0%',
      PROG_7: '0%',
      PROG_8: '0%',
      PROG_9: '0%',
      PROG10: '0%',
      FORECAST_START: '2023-01-21',
      FORECAST_END: '2023-04-01',
      COMMENT: 'last comment here',
      PHASE: 'PHASE_1'
    },{
      REFERENCE: 'ASP-GW0123',
      KNOWNAS: 'Maponye Mall',
      STATUS: '',
      TITLE: 'Fix the tiles 23',
      DUEDATE: '2023-03-12',
      PMANAGER: 'Additional Resource 2',
      PROG_1: '0%',
      PROG_2: '0%',
      PROG_3: '0%',
      PROG_4: '0%',
      PROG_5: '0%',
      PROG_6: '0%',
      PROG_7: '0%',
      PROG_8: '0%',
      PROG_9: '0%',
      PROG10: '0%',
      FORECAST_START: '2023-01-21',
      FORECAST_END: '2023-04-01',
      COMMENT: 'last comment here',
      PHASE: 'PHASE_2'
    },]);
  }

   /*******postGen******************************************************* */
    postGEN(lclobj: any, methodname: string, classname: string = "PSTRACKER") {
    // console.log(lclobj);
    this.loading = true;
    this.loadingBS.next(true);
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
            let represult = (data && data.d && data.d.exResult) ? JSON.parse(JSON.parse(data.d.exResult)) : data
           if ( !represult || !represult.RESULT ) {
            throw 'Error unknown ' } else {
              if (!Array.isArray(represult.RESULT) && typeof represult.RESULT === 'string'  && represult.RESULT.includes('ERR')){
                try {
               let errormsg =   JSON.parse(represult.RESULT)
               this.messagesBS.next(errormsg['ERR']);
               throw errormsg['ERR']
                }
                catch(e){
                  throw 'Error message unknown ' 
                }
              }
            return represult
         }
          } catch (e) {
            this.messagesBS.next('Bad Json Reply');
            throw 'Bad Json reply' 
          }

        })
      )

  }

  getCommentList(Projref = '', area = '', specific = '') {
    this.commentlistBS.next([]);
    if (Projref.length < 5) {
      return
    }
    this.postGEN({ REFERENCE: Projref , LEVEL_2: area, Level_3: specific}, "GET_COMMENTLIST", "PROJECTS").subscribe(reply => {
      if (!reply || reply.RESULT.length == 0){
        return
     }
     this.pdfready = true;
      this.commentlistBS.next(reply.RESULT);
    })
  }
  putComment(projCOMMENT: any) {
    this.postGEN(projCOMMENT, "PUT_COMMENT", "PROJECTS").subscribe(reply => {
      // console.log(reply.RESULT);
      // this.getCommentList(projcomment.PSPID);
    })
  }
  getProgLookups() {
    if (localStorage.getItem('proglookup2')) {
      this.proglookupsBS.next(JSON.parse(localStorage.getItem('proglookup')));
      this.getPMList();
      this.lookupBuilder();
    } else {
      if (this.cipgroups.length < 2) {
        this.postGEN({ D: "prog" }, "GET_LOOKUPS").subscribe(reply => {
          if (!reply || reply.RESULT.length == 0){
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
    if (this.boqs.length > 0 || this.proglookupsBS?.value.length === 0 ) {
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
        case 'WORKSTREAM' :{
           this.workstreams.push({ code: progline.B, text: progline.C })
          break;
        }
        case 'CIPGROUPS': {
          this.cipgroups.push({ code: progline.B, text: progline.B + '-' + progline.C, filter: progline.D })
          break;
        }
      }
    
      if (this.cipgroups.length > 0) {
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
      if (!list || list.RESULT.length == 0){
        return
     }
      this.pmlist = list.RESULT;
      this.pmlistBS.next(list.RESULT);
      localStorage.setItem('pmlist', JSON.stringify(list.RESULT))
    })

  }
pushFeedback(){
     const newdates = { ...this.lclstate.dates, ...this.lclstate.feedback} ;
    let updater = {...this.lclstate.feedback};
    let todo = {DATES: this.lclstate.dates, FEEDBACK: updater}
    this.postGEN(todo, 'UPDATE_TRACKER').subscribe(item => {
      this.messagesBS.next('All Done')
    })
  }
  mapWBS2Req(wbs = ''){
   let lclresult = this.Wbs2Req.find(line=> {
      return line.PROJLINK === wbs 
    })
    if ( lclresult && lclresult['ABSAREQNO']){
      return lclresult['ABSAREQNO'];
    }
   return 0;
  }
buildcodes() {
  this.phaseprog = [] ;
  this.phaseprog.push({phase:'Register', codes:[{code:0,text:'Not started'},{code:100, text:'Completed'}]})
  this.phaseprog.push({phase:'Initiation with Stakeholders', codes:[{code:0,text:'Not started'},
                      {code:20,text:'Site Visited & Assessment Started'},
                      {code:60,text:'Engagements and Scope in Review'},
                      {code:80,text:'Scope Finalisation'},
                      {code:100,text:'Scope Signed Off'}
                      ]})
  this.phaseprog.push({phase:'Costing and DD', codes:[{code:0,text:'Not started'},
                      {code:20,text:'Started'},
                      {code:60,text:'Early Progresss'},
                      {code:80,text:'Advanced Progress'},
                      {code:100,text:'Completed'}
                    ]})
  this.phaseprog.push({phase:'Client Approval', codes:[{code:0,text:'Not started'},{code:50,text:'In Progress'},{code:100, text:'Completed'}]})
  this.phaseprog.push({phase:'Approval Board', codes:[{code:0,text:'Not Started'},{code:40,text:'Submitted'},{code:60,text:'Awaiting'},{code:100, text:'Approved'}]})
  this.phaseprog.push({phase:'Lead Time', codes:[{code:0,text:'Not started'},{code:50,text:'In Progress'},{code:100, text:'Completed'}]})
  this.phaseprog.push({phase:'On Site ', codes:[
                      {code:0,text:'Not started'},
                      {code:20,text:'Started'},
                      {code:40,text:'Progress'},
                      {code:60,text:'Early Progresss'},
                      {code:80,text:'Advanced Progress'},
                      {code:100, text:'Completed'}]})
  this.phaseprog.push({phase:'Proof of Completion', codes:[{code:0,text:'Not started'},{code:100, text:'Completed'}]})
  this.phaseprog.push({phase:'Billing Process', codes:[{code:0,text:'Not started'},{code:60,text:'Invoices Submitted'},{code:100, text:'Completed'}]})
  this.phaseprog.push({phase:'Expected Cash Flow Date', codes:[{code:0,text:'Not started'},{code:100, text:'Completed'}]})
  return this.phaseprog ;
}

}
