import { Component, OnInit } from '@angular/core';
import { ApidataService } from 'src/app/_services/apidata.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  fromno: 0;
  tono: 0;
  phasex = 0;
  phase = [];
  editcode: any;
  show = false;
  constructor(public apiserv: ApidataService) { }

  ngOnInit(): void {
    let temp = this.apiserv.buildcodes();
  }
  goForIt() {
    this.apiserv.postGEN({ ABSAREQNO: this.fromno, INITIATIVE: this.tono, PHASE: 'PHASE' }, 'GET_BIGVIEW').subscribe(reply => {
      // console.log(reply)
    })
  }
  goForProj() {
    this.apiserv.postGEN({ REFERENCE: this.fromno + ':' + this.tono, ACTION: 'F' }, 'GET_PROJLIST').subscribe(reply => {
      // console.log(reply)
    })
  }
  goForReq() {
    this.apiserv.postGEN({ ABSAREQNO: this.fromno, INITIATIVE: this.tono, LOADTYPE: 'A' }, 'GET_CURRENTLIST').subscribe(reply => {
      // console.log(reply)
    })
  }
  gotophase($event) {
    this.phase = this.apiserv.phaseprog[this.phasex]['codes'];
  }
  edit(code){
  this.editcode = {...code}
  this.show = true;
  }
  delete(code){

  }
  updateSAP(){
    this.show=false;
    this.editcode={};
  }
  cancel(){
    this.show=false;
    this.editcode={};
  }
}
