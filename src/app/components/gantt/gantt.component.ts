import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GanttEditorComponent, GanttEditorOptions } from 'ng-gantt';
import { Subscription } from 'rxjs';
import { ApidataService } from 'src/app/_services/apidata.service';

@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.css']
})
export class GanttComponent implements  OnInit , OnDestroy{
  @ViewChild("editor") editor: GanttEditorComponent;
  public editorOptions: GanttEditorOptions;
  public data = [];
  rlink = '';
  hide = true;
  reschedule = false;
  progress = true;
  subs: Subscription[] = [];
  insert = true;
  dates: any;
  found = 0 ; phaselist = [];
  taskForm = this.newForm() ;
  header = '';
  project = {} ;
  constructor(public apiserv: ApidataService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  //   this.rlink = this.route.snapshot.paramMap.get('reqno');
  //  if( this.rlink > '9' || this.rlink < '8' ){
  //   this.apiserv.getSingle(this.rlink)
  //  }
   this.subs.push(this.apiserv.currentprojBS.subscribe(val => {
    this.project = val
    this.dates = this.apiserv.lclstate.dates 
   }))

  //  let t = JSON.parse(JSON.stringify(this.initialData()));
  //  t.forEach(element => {
  //   this.data.push(element);
  // });
  // t = [];
  //  this.subs.push( this.apiserv.tasklinesBS.subscribe(lines=>{
  //    if (lines.length > 1 && this.data.length < 1){
  //     this.data = lines
       
  //      this.initGantt();
  //    }}))
     this.editorOptions = {
      vFormat: "month",
      vEditable: false,
      vEventsChange: {
        taskname: () => {
          let x = 1; 
        }
      },
      vEvents:
      {
          taskname: this.handler.bind(this),
          taskmove: this.handler.bind(this),        }
    };   
  }
  // To be removed if not used
  ngOnDestry(){
    this.subs.forEach(li=> {
      li.unsubscribe();
    })
    this.apiserv.reqdata = [];
  }
  // For removal
initGantt(){
  this.phaselist = this.data
  // .filter( tline=> {
  //   return tline.ACTIONTYPE >= 'PHASE01' && tline.ACTIONTYPE < 'PHASE12'
  //  });
  //    this.phaselist.sort( (a,b) => a.ACTIONTYPE.localeCompare(b.ACTIONTYPE))
      
}
  onChanges(): void {
    let tt = {}
   this.subs.push(this.taskForm.get('pParent').valueChanges.subscribe(val => {
       tt = this.data.find(line=>{
        return line.pID == val
      })
      this.taskForm.get('pStart').setValue(tt['pStart']);
      this.taskForm.get('pEnd').setValue(tt['pEnd']);
    }));
  }
ngOnDestroy(){
  this.subs.forEach(li=> {
    li.unsubscribe();
  })
}
progressUpdate(sortof){
  switch (sortof){
    case ('progress'): {
      this.progress = !this.progress;
      this.reschedule = false;
      break;
    }
    case ('reschedule'): {
      this.progress = false;
      this.reschedule = !this.reschedule;
      break;
    }
  }


}
handler(task, event, cell, column) {
  let selectedData = task.getDataObject();
  alert(selectedData.pID)
  this.insert = false;
  this.hide = true;
  this.taskForm.get('pID').setValue(selectedData.pID);
  this.taskForm.get('pName').setValue(selectedData.pName);
  this.taskForm.get('pStart').setValue(selectedData.pStart);
  this.taskForm.get('pEnd').setValue(selectedData.pEnd);
  this.taskForm.get('pClass').setValue(selectedData.pClass);
  this.taskForm.get('pLink').setValue(selectedData.pLink);
  this.taskForm.get('pMile').setValue(selectedData.pMile);
  this.taskForm.get('pRes').setValue(selectedData.pRes);
  this.taskForm.get('pComp').setValue(selectedData.pComp);
  this.taskForm.get('pGroup').setValue(selectedData.pGroup);
  this.taskForm.get('pParent').setValue(selectedData.pParent);
  if (selectedData.pParent == 1) {
    this.taskForm.get('pParent').disable();
  } else {
    this.taskForm.get('pParent').enable();
  }
  this.taskForm.get('pOpen').setValue(selectedData.pOpen);
  this.taskForm.get('pDepend').setValue(selectedData.pDepend);
  this.taskForm.get('pCaption').setValue(selectedData.pCaption);
  this.taskForm.get('pNotes').setValue(selectedData.pNotes);
  this.taskForm.get('pSendMail').setValue(selectedData.pSendMail);
  this.taskForm.get('pReminder').setValue(selectedData.pReminder);
  this.taskForm.get('pWeight').setValue(selectedData.pWeight);
}  

newForm(){
  return new FormGroup({
    pID: new FormControl('',{}),
    pName: new FormControl('', Validators.required),
    pStart: new FormControl('', Validators.required),
    pEnd:  new FormControl('', Validators.required),
    pClass: new FormControl(''),
    pLink:  new FormControl(''),
    pMile:  new FormControl(''),
    pRes:  new FormControl('', Validators.required),
    pComp:  new FormControl(''),
    pGroup:  new FormControl(''),
    pParent:  new FormControl('', Validators.required),
    pOpen:  new FormControl(''),
    pDepend:  new FormControl(''),
    pCaption: new FormControl(''),
    pNotes: new FormControl(''),
    pSendMail: new FormControl(''),
    pReminder: new FormControl(''),
    pWeight: new FormControl('')
  })
}


// }

  changeData() {
    this.taskForm = this.newForm();
    this.onChanges();
    this.insert = true;
    this.hide = true;
    // this.data = [... this.data,
    //   {   pID: Math.random() * 100,
    //       pName: "Loop each Task",
    //       pStart: "2017-03-26",
    //       pEnd: "2017-04-11",
    //       pClass: "gtaskred",
    //       pLink: "",
    //       pMile: 0,
    //       pRes: "Brian",
    //       pComp: 60,
    //       pGroup: 0,
    //       pParent: 34,
    //       pOpen: 1,
    //       pDepend: "",
    //       pCaption: "",
    //       pNotes: ""
    //     }];
  }

 
insertTask(){
let temp = {};

 Object.keys(this.taskForm.controls).forEach(element => {
  temp[element] = this.taskForm.getRawValue()[element]
});
temp['pID'] = Math.random() * 100 + 11 ;
temp['pClass'] = 'gtaskred' ;
temp['pRes'] = 'Someone';

let datax = this.data;
datax.push(temp);
this.data = [...datax];
this.router.navigate(['relink/planner']);

}
updateTask(){
  let temp = {};
  let temptask = this.data.findIndex(obj=>{
    return obj.pID == this.taskForm.value['pID']
  })
  
   Object.keys(this.taskForm.controls).forEach(element => {
    temp[element] = this.taskForm.getRawValue()[element]
  });
  this.data[temptask] = temp;
  let datax = this.data;
  this.data = [...datax];
  this.router.navigate(['relink/planner']);
  
  }
cancelTask() {

}
deleteTask(){

}
  initialData() {
 return  this.apiserv.reqdata ;
   

  }
  backToWorklist(){
    this.router.navigate(['relink/worklist'])
  }
}
