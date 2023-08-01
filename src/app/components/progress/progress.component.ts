import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApidataService } from 'src/app/_services/apidata.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit, OnDestroy {
searchlistnew = [];
searchlist=[];
searchbox = '';
item={};
subs: Subscription;
//item = this.initdata();

  constructor(public apiserv: ApidataService, private router: Router) { }

  ngOnInit(): void {
    this.subs = this.apiserv.progressBS.subscribe(reply => {
      this.searchlist = [];
      if (reply) {
        reply.forEach(element => {
          let tempobj = { tag: '' };
          tempobj.tag = Object.values(element).join('-');
          // element['PROG06'] = element['PROG06'] > 100 ? 0 : element['PROG06'];
          let prog = { progress: this.progressCalc(element) }
          this.searchlist.push({ ...element, ...tempobj, ...prog });
          this.searchlistnew = this.searchlist;
         
        });
 
      }

      this.searchlistnew = [...this.searchlist];

    })
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  
  progressCalc(item) {
    let numberans = (item.PROG02) * 5 +
      (item.PROG03) * 2.5 +
      (item.PROG04) * 2.5 +
      (item.PROG05) * 5 +
      (item.PROG06) * 5 +
      (item.PROG07) * 65 +
      (item.PROG08) * 5 +
      (item.PROG09) * 5 +
      (item.PROG10) * 5;
    return Math.round(numberans / 100);
  }
  initdata(){
    return      {
      REFERENCE: '',
      ABSAREQNO:'',
      PROJLINK:'',
      KNOWNAS:'',
      STATUS:'',
      TITLE:'',
      DUEDATE:'',
      multisite:'',
      phase: '',
      PROG01: ' ',
      PROG02: ' ',
      PROG03: ' ',
      PROG04: ' ',
      PROG05: ' ',
      PROG06: ' ',
      PROG07: ' ',
      PROG08: ' ',
      PROG09: ' ',
      PROG10: ' ',
      PROPSTARTDATE: '',
      PROPENDDATE:'',
      FORECAST_START: '',
      FORECAST_END: ''
  //    PROGRESS: item.progress
    }
  }
  newValue($event,  item) {
   
    // if (this.changelist.indexOf(item.ABSAREQNO) === -1) {
    //   this.changelist.push(item.ABSAREQNO);
    // }
  }
  gotoItem(item:any){
    this.item = {...item};
  }
}
