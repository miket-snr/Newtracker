import { Component, OnInit } from '@angular/core';
import { ApidataService } from 'src/app/_services/apidata.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
fromno:0;
tono:0;
  constructor(private apiserv: ApidataService) { }

  ngOnInit(): void {
  }
goForIt(){
this.apiserv.postGEN({ABSAREQNO: this.fromno, INITIATIVE:this.tono, PHASE:'PHASE'}, 'GET_BIGVIEW').subscribe( reply => {
  console.log(reply)
})
}
}
