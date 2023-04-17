import { Component, OnInit } from '@angular/core';
import { ApidataService } from 'src/app/_services/apidata.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.css']
})
export class ProgressComponent implements OnInit {
searchlistnew = [];
item = this.initdata();

  constructor(public apiserv: ApidataService) { }

  ngOnInit(): void {
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
}
