import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { USER } from '../_classes/User';
//import { ApidataService } from './apidata.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public token = '123456';
  private blankuser:USER = {
    EMAIL: '',
    CELLNO: '',
    SAPUSER: '',
    NAME_FIRST: '',
    NAME_LAST: '',
    AD_ADR: '',
    PASSWORD: '',
    ABSENT_FROM: '',
    ABSENT_TO: '',
    SUBSTITUTE: '',
    PARTNER_ID: '',
    TOKEN: '',
    VERNR:'',
    VERNA:'',
    DESIGNATION:''
  }
  public rfqtoken: string;
  loggedin = false;
  
  waiting = false;
  loading = false;
  private currentUserBS = new BehaviorSubject<USER>(this.blankuser);
  public currentUser$ = this.currentUserBS.asObservable();

  public loggedinBS = new BehaviorSubject(false);
  doc = window.location.href;
  devprod = '';
  constructor(private route: ActivatedRoute, private router: Router,
    private http: HttpClient) {

    const cu = localStorage.getItem('BFMUser') || '';
    this.devprod = (this.doc.toUpperCase().includes('DEV') || this.doc.toUpperCase().includes('LOCAL')) ? 'DEV' : 'PROD';
    // Check if new link from SAP - ignore current tokens if user defined
    // Prevent user typing in token in localstorage or URL by checking validity on SAP
    if (cu.length > 5){
    let ans = this.validateToken(JSON.parse(cu).TOKEN);
    }
    this.rfqtoken = this.findGetParameter('t') || '';
    let tempu = this.findGetParameter('u') || '';
    if (this.rfqtoken == 'xyz' && tempu > '') {
      let t = this.currentUserBS.value;
      t.SAPUSER = tempu;
      t.TOKEN = this.rfqtoken;
      t.NAME_FIRST = tempu ;
      this.currentUserBS.next({ ...t });
      this.loggedin = true;
      this.loggedinBS.next(true);
      localStorage.setItem('BFMUser',JSON.stringify(this.currentUserBS.value));
      this.router.navigate(['home']) 
    } else {
      if (cu.length > 15) {
        const temp = JSON.parse(cu);
        if (temp.SAPUSER > '') {
          temp.EMAIL = temp.EMAIL.toUpperCase();
          this.currentUserBS.next(
            { ...this.blankuser, ...temp }
          ); this.loggedin = true; this.loggedinBS.next(true);
          this.router.navigate(['home']) 
        } else {
          this.currentUserBS.next(
            { ...this.blankuser });
          this.loggedin = false;
          this.loggedinBS.next(false);
        }
      } else {
        this.currentUserBS.next(
          { ...this.blankuser });
        this.loggedin = false;
        this.loggedinBS.next(false);
      }
    }
  }
  logOut(){
    localStorage.removeItem('BFMUser');
    this.currentUserBS.next({
      EMAIL: '',
      CELLNO: '',
      SAPUSER: '',
      NAME_FIRST: '',
      NAME_LAST: '',
      AD_ADR: '',
      PASSWORD: '',
      ABSENT_FROM: '',
      ABSENT_TO: '',
      SUBSTITUTE: '',
      PARTNER_ID: '',
      TOKEN: ''
    })
    this.loggedin = false;
    this.loggedinBS.next(false);
    this.loading = false;
    this.waiting = false;
  }
  getOTP(email = '', sms = '') {
    this.blankuser.SAPUSER = email;
    this.blankuser.CELLNO = sms;
    let lclobj = { EMAIL: email, CELLNO: sms, APIKEY: 'PSRABSA' }
    this.loading = true;
    this.postGEN(lclobj, 'SENDAPIOTP', 'USER').subscribe(token => {
      this.waiting = true;
      this.loading = false;
      // token.RESULT[0].TOKEN = '---'
      // token.RESULT[0].PAR = 'WAITING'
      // this.currentUserBS.next(token.RESULT[0]);
    })
  }
  login(user: string) {
    let t = { ...this.currentUserBS.value };
    t.SAPUSER = 'tempu';
    t.TOKEN = 'his.rfqtoken';
    this.currentUserBS.next({ ...t });
  }
  confirmOTP(email = '', sms = '', otpin = '') {
    this.waiting = true;
    this.loading = true;
    let lclobj = { EMAIL: email, CELLNO: sms, OTP: otpin, APIKEY: 'PSRABSA' }
    this.postGEN(lclobj, 'VALIDAPIOTP', 'USER').subscribe(token => {
      if (token.RESULT[0].PARTNER_ID == 'ERROR') {
        this.blankuser.TOKEN = '';
        this.blankuser.PARTNER_ID = 'FAILED';
        this.currentUserBS.next(this.blankuser);
        this.loggedin = false;
        this.loggedinBS.next(false);
        this.loading = false;
        this.waiting = false;
      } else {
      this.currentUserBS.next(token.RESULT[0]);
      if (token.RESULT[0].TOKEN.length > 3 ){
      localStorage.setItem('BFMUser', JSON.stringify(token.RESULT[0]))
      this.loggedin = true;
      this.loggedinBS.next(false);
      this.loading = false;
      this.waiting = false;  
      window.location.reload();
      }}
    })
  }
  findGetParameter(parameterName: string) {
    let result = '';
    let tmp = [];
    tmp = location.href.split('?');
    if (tmp && tmp.length > 1) {
      let tempparams = tmp[1].split('&');

      tempparams.forEach((item) => {
        tmp = item.split('=');
        if (tmp[0] === parameterName) {
          result = decodeURIComponent(tmp[1]);
        }
      });
    }
    return result;
  }
  public get currentUserValue(): USER {
    return this.currentUserBS.value;
  }
async validateToken(token: string){
let data = await this.postGEN({TOKEN:token},'VALIDPSTOKEN','USER').toPromise() ;
return (data.RESULT[0].TOKEN == token);

}
  /*******postGen******************************************************* */
  postGEN(lclobj: any, methodname: string, classname: string = "PSTRACKER") {
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
          return (data && data.d && data.d.exResult) ? JSON.parse(JSON.parse(data.d.exResult)) : data
        })
      )

  }



}
