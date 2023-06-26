import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ApidataService } from 'src/app/_services/apidata.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css']
})
export class TasklistComponent implements OnInit, OnDestroy {
@Input() reference: any;
tasksub: Subscription;
eventsSubject: Subject<void> = new Subject<void>();
tasks = [];
currenttask: any;
taskedit = false;
editdetail = false;

  constructor(private authserv: AuthService, private apiserv: ApidataService) { }

  ngOnInit(): void {
    this.tasksub = this.apiserv.tasklist$.subscribe(lines=>{
      this.tasks = lines;
     })
  }
  ngOnDestroy() {
    if (this.tasksub) { this.tasksub.unsubscribe() };
   
  }
  addTask() {
    let lclobj = {
      LINKEDTYPE: 'BT',
      SENTBY: this.authserv.currentUserValue.EMAIL.toLocaleUpperCase(),
      LINKEDOBJNR: this.reference
    }
    this.apiserv.postGEN(lclobj, 'NEW_TASKREQUEST').subscribe(reply => {
      const lctask = JSON.parse(JSON.stringify(reply.RESULT));
      this.tasks.push(lctask)
      // this.editTask(lctask);
    
      this.currenttask = lctask;
      this.taskedit = true;
      this.emitEventToChild();
    })
  }
  emitEventToChild() {
    this.eventsSubject.next();
  }
  editTask(task: any) {
    this.currenttask = task;
    // this.taskForm.get('DUEDATE').patchValue(task.DUEDATE, { emitEvent: false });
    // this.taskForm.get('DUETIME').patchValue(task.DUETIME, { emitEvent: false });
    // this.taskForm.get('INSTRUCTION').patchValue(task.INSTRUCTION, { emitEvent: false });
    // this.taskForm.get('DATESENT').patchValue(task.DATESENT, { emitEvent: false });
    // this.taskForm.get('DELEGATENAME').patchValue(task.DELEGATENAME, { emitEvent: false });
    // this.taskForm.get('COMMENT').patchValue(task.COMMENT, { emitEvent: false });
    this.editdetail = true;
  }
  taskClose(reply){
    if  (reply =='cancel'){
     let metemp = this.tasks.pop();
      
    }
    this.taskedit = false;
  }
}
