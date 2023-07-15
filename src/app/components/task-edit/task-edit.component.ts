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
  @Input() events: Observable<any>;
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
    this.eventsSubscription = this.events.subscribe((tasker) => {
      this.task = tasker;
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
  let taskout = {...this.task}

  taskout.LINKEDTYPE = 'NR';
  taskout.DECISION = 'SENDMAIL';
  taskout.INSTRUCTION = this.apiserv.xtdbtoa(this.task.INSTRUCTION )
  taskout.LINKEDOBJNR = this.apiserv.lclstate.currentreq['ABSAREQNO']
  this.apiserv.postGEN(taskout, 'NEW_TASKREQUEST').subscribe(reply =>{
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
    this.task['INSTRUCTION']  =  ' ';
    this.taskForm.get('INSTRUCTION').patchValue(' ', { emitEvent: false });
   }  
  // this.someChange.emit(this.task)
  })
}
doUpdatefromParent(){
  for (const field in this.taskForm.controls) { // 'field' is a string
    if (this.task && this.task['DUEDATE'] && !(this.task['DUEDATE'].includes('-') > 0)){
      this.task['DUEDATE'] = this.task['DUEDATE'].substring(0,4) + '-' + this.task['DUEDATE'].substring(4,6) + '-' + this.task['DUEDATE'].substring(6,8)
    }
    if (this.task && this.task['DUETIME'] && !(this.task['DUETIME'].includes(':') > 0)){
      this.task['DUETIME'] = this.task['DUETIME'].substring(0,2) + ':' + this.task['DUETIME'].substring(2,4) 
    }
if (this.task && this.task[field]){
  console.log(field + this.task[field])
   this.taskForm.get(field).patchValue(this.task[field],{ emitEvent: false}); // 'control' is a FormControl  
}
  }
  // if (this.taskForm.value.DUEDATE.index('-') < 0){
  //   this.taskForm.get('DUEDATE').setValue('2021-01-01' ,{ emitEvent: false});
  // }
  // if (this.taskForm.value.DUETIME.substring(':') <  0){
  //   this.taskForm.get('DUETIME').setValue('18:00:00' ,{ emitEvent: false});
  // }
  console.log(this.taskForm.value.DUETIME)
  console.log(this.taskForm.value.DUEDATE)
}

}
