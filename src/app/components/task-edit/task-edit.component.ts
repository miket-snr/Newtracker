import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ApidataService } from 'src/app/_services/apidata.service';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit, OnDestroy {
  @Input() task : any
  @Input() events: Observable<void>;
  @Output() someChange = new EventEmitter<string>();
  private eventsSubscription: Subscription;
  pmlist = [];
  taskForm = new FormGroup({
    DATESENT: new FormControl(),
    ACTIONTYPE: new FormControl(),
    DELEGATENAME: new FormControl(),
    INSTRUCTION: new FormControl(),
    DUEDATE: new FormControl(),
    DUETIME: new FormControl(),
    DECISION: new FormControl(),
    COMMENT: new FormControl(),
  })
  constructor(public apiserv: ApidataService) { }

  ngOnInit(): void {
    this.pmlist = this.apiserv.pmlist;
    this.eventsSubscription = this.events.subscribe(() => {
      this.doUpdatefromParent();
  })
  this.doUpdatefromParent();
  this.formChanges();
}
ngOnDestroy()
{
this.eventsSubscription.unsubscribe();
} 
onSave(){
  this.task.LINKEDTYPE = 'NR';
  this.task.DECISION = 'SENDMAIL';
  this.task.INSTRUCTION = this.apiserv.xtdbtoa(this.task.INSTRUCTION )
  this.task.LINKEDOBJNR = this.apiserv.lclstate.currentreq['ABSAREQNO']
  this.apiserv.postGEN(this.task, 'NEW_TASKREQUEST').subscribe(reply =>{
    if (reply && reply.RESULT.TASK_STATUS ){
      this.apiserv.messagesBS.next(reply.RESULT.ACTION_REPLY)

      this.taskForm.get('DUEDATE').patchValue('', { emitEvent: false });
      this.taskForm.get('DUETIME').patchValue('', { emitEvent: false });
      this.taskForm.get('INSTRUCTION').patchValue('' ,{ emitEvent: false });
      this.taskForm.get('DATESENT').patchValue('', { emitEvent: false });
      this.taskForm.get('DELEGATENAME').patchValue('', { emitEvent: false });
      this.taskForm.get('COMMENT').patchValue('', { emitEvent: false });
      this.someChange.emit('close')
    }
  }
    )
}

onCancel(){
  this.someChange.emit('cancel')
}

formChanges(){
  this.taskForm.valueChanges.subscribe(val => {
    let lcob  = {};
   for (const key in val){
    this.task[key] = val[key]
    if (key === 'ACTIONTYPE') {
     lcob = this.apiserv.actionlist.find(obj => {
        return obj.code === val[key]
      });
     
    }
   }
   this.task['DELEGATENAME'] = this.task['DELEGATENAME'] > ' ' ? this.task['DELEGATENAME']: this.task['SENTBY'];
   if (!this.task['INSTRUCTION']) {
    this.task['INSTRUCTION']  = lcob['instruction']
    this.taskForm.get('INSTRUCTION').patchValue(lcob['instruction'], { emitEvent: false });
   }  
  // this.someChange.emit(this.task)
  })
}
doUpdatefromParent(){
  for (const field in this.taskForm.controls) { // 'field' is a string

   this.taskForm.get(field).patchValue(this.task[field], { emitEvent: false }); // 'control' is a FormControl  
  
  }
}
}
