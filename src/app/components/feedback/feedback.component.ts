import { Component, OnInit } from '@angular/core';
import { absareq } from 'src/app/_classes/absareq';
import { dateset } from 'src/app/_classes/dateset';
import { ApidataService } from 'src/app/_services/apidata.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  feedback:dateset = this.apiserv.lclstate.dates;
 vm = {    CONTINGENCYUSED: 0,
  CONTINGENCYLEFT: 0,
  POC_DATESENT: '',
  POC_DATEREC: ''}
  constructor(public apiserv:ApidataService) {

   }

  ngOnInit(): void {
    
  }

}
