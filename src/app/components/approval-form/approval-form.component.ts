import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { absareq } from 'src/app/_classes/absareq';
import { ApidataService } from 'src/app/_services/apidata.service';
import { DialogService } from 'src/app/_services/dialog.service';

@Component({
  selector: 'app-approval-form',
  templateUrl: './approval-form.component.html',
  styleUrls: ['./approval-form.component.css']
})
export class ApprovalFormComponent implements OnInit {
@Input() vm : absareq;
@Output() save = new EventEmitter();
hlptxt = 'Show help';
helper=false;
helpline = this.apiserv.getHelptexts('APPROVAL');

  constructor(public apiserv: ApidataService, private helper2: DialogService) { }

  ngOnInit(): void {
  }
  onSubmit() { 
    this.save.emit(this.vm); 
  }
  showHelp(){
    this.helper2.helpopen({title:'Approvals', helptext:this.helpline.LINE1}) 
    // = !this.helper;
    // this.hlptxt = this.helper? 'Hide Help' : "Show Help";
    }
}
