import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { ApidataService } from 'src/app/_services/apidata.service';
import { AuthService } from 'src/app/_services/auth.service';
import { ModalService } from 'src/app/_modal';

@Component({
  selector: 'app-worklist-multi',
  templateUrl: './worklist-multi.component.html',
  styleUrls: ['./worklist-multi.component.css']
})
export class WorklistMultiComponent implements  OnInit,OnDestroy {
  @Input() reference = 0;
  searchlist = [];
  searchlistnew = [];
  searchbox = '';
  pmlist = [];
  changelist = [];
 pmanager = 'Unknown';
 region = '';
 subs: Subscription
 codes = this.apiserv.buildcodes();
pmForm = new FormGroup({
  pm: new FormControl(''),
  region: new FormControl('*'),
  cipgroup: new FormControl(),
  cipcode: new FormControl(),
  status: new FormControl(),
  site: new FormControl()
})
  constructor(public apiserv: ApidataService,
      private modalServicejw: ModalService,
      private authserv: AuthService,
      private router: Router) { }

  ngOnInit() {
    this.pmanager = this.apiserv.lclstate.pmanager
    this.region = this.apiserv.lclstate.region
    if (this.reference > 3){
      this.apiserv.getProgresslist(this.region,this.pmanager, this.reference.toString())
    } else {
    this.apiserv.getProgresslist(this.region,this.pmanager);
    }
    this.pmlist = ['* Show all'];

    // A Region change results in a new call to the API - 
    this.pmForm.get('region').valueChanges.subscribe(value => {
      this.searchlistnew = [];
      this.pmlist = ['* Show all'];
      this.region = value;
      this.apiserv.getProgresslist(value,'*');
    })  

    // A New region will trigger this on the return from the API call
  this.subs = this.apiserv.progressBS.subscribe(reply => {
    this.searchlist = [];
    if (reply) {
      reply.forEach(element => {
        let tempobj = { tag: '' };
        tempobj.tag = Object.values(element).join('-');

        this.searchlist.push({ ...element, ...tempobj });
        this.searchlistnew = this.searchlist;
        if (! this.pmlist.includes(element.PMANAGER)){
          this.pmlist.push(element.PMANAGER)
                  }
      });
    }
    this.apiserv.pmlist = this.pmlist ;
  if (this.pmlist.length === 2 ) {
    this.pmForm.get('pm').setValue(this.pmlist[1], { emitEvent: false });
  }
  this.searchlistnew = [...this.searchlist];
  })

  // A PM Change only filters the existing records
  this.pmForm.get('pm').valueChanges.subscribe(value => {
    if (value == '* Show all'){
      this.searchlistnew = [...this.searchlist]
    } else {
    let temp = this.searchlist.filter(lt=>{
      return lt.PMANAGER == value;
    });
    this.searchlistnew = [];
    this.searchlistnew = [...temp];
  }
  })
  
  }
  goTo(item){
    this.router.navigate(['requestedit/'+ item.ABSAREQNO])
  }
ngOnDestroy(): void {
  this.subs.unsubscribe();
  }
  newValue($event, idx, item) {
   
    if (this.changelist.indexOf(item.ABSAREQNO) === -1) {
      this.changelist.push(item.ABSAREQNO);
    }
    // let numberans = parseInt(item.scope.slice(0,-1)) * 5 +
    // parseInt(item.boq.slice(0,-1)) * 2.5 +
    // parseInt(item.costs.slice(0,-1)) * 2.5  +
    // parseInt(item.approval.slice(0,-1)) * 5  +
    // parseInt(item.implement.slice(0,-1)) * 65  +
    // parseInt(item.invsubmitted.slice(0,-1)) * 7.5  ;
    // numberans = numberans / 100;
    // this.amountclaimed = 0;
    // this.searchlistnew.forEach(line => {
    //   if (this.changelist.indexOf(line.reference) != -1) {
    //    this.amountclaimed += parseFloat(line.claiming);
    //   }
    // })
    // // if (item.approval){
    // //   numberans = numberans + 10;
    // //   this.approvalweek = 'Week ' + this.getWeek(new Date(item.approval),0).toString();
    // // }
    // // if (item.practicalcomp){
    // //   numberans = numberans + 2.5;
    // //   this.practicalweek = 'Week ' + this.getWeek(new Date(item.practicalcomp),0).toString();
    // // }
    // let myanswer = numberans.toString() + '%';
    // item.progress = myanswer;
  }
  saveToSAP() {
    let saved = [];
    this.searchlistnew.forEach(line => {
      if (this.changelist.indexOf(line.reference) != -1) {
        saved.push(line);
      }
    })
    let tosave = [];
    saved.forEach(item => {
      tosave.push({
        REFERENCE: item.ABSAREQNO,
        PROG01: item.PROG01,
        PROG02: item.PROG02,
        PROG03: item.PROG03,
        PROG04: item.PROG04,
        PROG05: item.PROG05,
        PROG06: item.PROG06,
        PROG07: item.PROG07,
        PROG08: item.PROG08,
        PROG09: item.PROG09,
        PROG10: item.PROG10,
        PROPSTARTDATE: item.PROPSTARTDATE,
        PROPENDDATE: item.PROPENDDATE
    //    PROGRESS: item.progress
      });
    })
    let todo = { DATA: JSON.stringify(tosave) };
    this.apiserv.postGEN(todo, 'UPDATE_PSTRACKER').subscribe(item => {
      this.apiserv.messagesBS.next('All Done')
      this.changelist = [];
    })
  }
  showComment(rowitem){
    
  }
}


