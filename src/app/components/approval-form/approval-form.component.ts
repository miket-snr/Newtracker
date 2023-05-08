import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { absareq } from 'src/app/_classes/absareq';
import { ApidataService } from 'src/app/_services/apidata.service';

@Component({
  selector: 'app-approval-form',
  templateUrl: './approval-form.component.html',
  styleUrls: ['./approval-form.component.css']
})
export class ApprovalFormComponent implements OnInit {
@Input() vm : absareq;
@Output() save = new EventEmitter();
  constructor(public apiserv: ApidataService) { }

  ngOnInit(): void {
  }
  onSubmit() { 
    this.save.emit(this.vm); 
  }
}
