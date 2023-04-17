import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
export class GanttComponent implements  OnInit {
  @ViewChild("editor") editor: GanttEditorComponent;
  public editorOptions: GanttEditorOptions;
  public data = [];
  rlink = '';
  hide = true;
  reschedule = false;
  progress = false;
  subs: Subscription;
  insert = true;
  dates: any;
  found = 0 ; phaselist = [];
  taskForm = this.newForm() ;
  header = '';
  project = {} ;
  constructor(private apiserv: ApidataService,
    private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  //   this.rlink = this.route.snapshot.paramMap.get('reqno');
  //  if( this.rlink > '9' || this.rlink < '8' ){
  //   this.apiserv.getSingle(this.rlink)
  //  }
   this.apiserv.currentprojBS.subscribe(val => {
    this.project = val
    this.dates = this.apiserv.lclstate.dates 
   })

   this.data = this.initialData();
   this.subs = this.apiserv.tasklinesBS.subscribe(lines=>{
     if (lines.length > 1 && this.data.length < 1){
       this.router.navigate(['relink/planner'])
     }})
       this.phaselist = this.data.filter( tline=> {
        return tline.ACTIONTYPE >= 'PHASE01' && tline.ACTIONTYPE < 'PHASE12'
       });
         this.phaselist.sort( (a,b) => a.ACTIONTYPE.localeCompare(b.ACTIONTYPE))
           this.editorOptions = {
             vFormat: "month",
             vEditable: true,
             vEventsChange: {
               taskname: () => {
                 let x = 1;
               }
             },
             vEvents:
             {
                 taskname: this.handler.bind(this)
               }
           };   
  }

  onChanges(): void {
    let tt = {}
    this.taskForm.get('pParent').valueChanges.subscribe(val => {
       tt = this.data.find(line=>{
        return line.pID == val
      })
      this.taskForm.get('pStart').setValue(tt['pStart']);
      this.taskForm.get('pEnd').setValue(tt['pEnd']);
    });
  }
ngOnDestroy(){
  this.subs.unsubscribe();
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
  this.insert = false;
  this.hide = false;
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
    this.hide = false;
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

   return this.apiserv.reqdata ;
    // [
    //   {
    //     pID: 1,
    //     pName: "Define Chart API",
    //     pStart: "",
    //     pEnd: "",
    //     pClass: "ggroupblack",
    //     pLink: "",
    //     pMile: 0,
    //     pRes: "Brian",
    //     pComp: 0,
    //     pGroup: 1,
    //     pParent: 0,
    //     pOpen: 1,
    //     pDepend: "",
    //     pCaption: "",
    //     pNotes: "Some Notes text"
    //   },
    //   {
    //     pID: 11,
    //     pName: "Chart Object",
    //     pStart: "2017-02-20",
    //     pEnd: "2017-02-20",
    //     pClass: "gmilestone",
    //     pLink: "",
    //     pMile: 1,
    //     pRes: "Shlomy",
    //     pComp: 100,
    //     pGroup: 0,
    //     pParent: 1,
    //     pOpen: 1,
    //     pDepend: "",
    //     pCaption: "",
    //     pNotes: ""
    //   },
    //   {
    //     pID: 12,
    //     pName: "Task Objects",
    //     pStart: "",
    //     pEnd: "",
    //     pClass: "ggroupblack",
    //     pLink: "",
    //     pMile: 0,
    //     pRes: "Shlomy",
    //     pComp: 40,
    //     pGroup: 1,
    //     pParent: 1,
    //     pOpen: 1,
    //     pDepend: "",
    //     pCaption: "",
    //     pNotes: ""
    //   },
    //   {
    //     pID: 121,
    //     pName: "Constructor Proc #1234 of February 2017",
    //     pStart: "2017-02-21",
    //     pEnd: "2017-03-09",
    //     pClass: "gtaskblue",
    //     pLink: "",
    //     pMile: 0,
    //     pRes: "Brian T.",
    //     pComp: 60,
    //     pGroup: 0,
    //     pParent: 12,
    //     pOpen: 1,
    //     pDepend: "",
    //     pCaption: "",
    //     pNotes: ""
    //   },
    //   {
    //     pID: 122,
    //     pName: "Task Variables",
    //     pStart: "2017-03-06",
    //     pEnd: "2017-03-11",
    //     pClass: "gtaskred",
    //     pLink: "",
    //     pMile: 0,
    //     pRes: "Brian",
    //     pComp: 60,
    //     pGroup: 0,
    //     pParent: 12,
    //     pOpen: 1,
    //     pDepend: 121,
    //     pCaption: "",
    //     pNotes: ""
    //   },
    //   {
    //     pID: 123,
    //     pName: "Task by Minute/Hour",
    //     pStart: "2017-03-09",
    //     pEnd: "2017-03-14 12: 00",
    //     pClass: "gtaskyellow",
    //     pLink: "",
    //     pMile: 0,
    //     pRes: "Ilan",
    //     pComp: 60,
    //     pGroup: 0,
    //     pParent: 12,
    //     pOpen: 1,
    //     pDepend: "",
    //     pCaption: "",
    //     pNotes: ""
    //   },
    //   {
    //     pID: 124,
    //     pName: "Task Functions",
    //     pStart: "2017-03-09",
    //     pEnd: "2017-03-29",
    //     pClass: "gtaskred",
    //     pLink: "",
    //     pMile: 0,
    //     pRes: "Anyone",
    //     pComp: 60,
    //     pGroup: 0,
    //     pParent: 12,
    //     pOpen: 1,
    //     pDepend: "123SS",
    //     pCaption: "This is a caption",
    //     pNotes: null
    //   },
    //   {
    //     pID: 2,
    //     pName: "Create HTML Shell",
    //     pStart: "2017-03-24",
    //     pEnd: "2017-03-24",
    //     pClass: "gtaskyellow",
    //     pLink: "",
    //     pMile: 0,
    //     pRes: "Brian",
    //     pComp: 20,
    //     pGroup: 0,
    //     pParent: 0,
    //     pOpen: 1,
    //     pDepend: 122,
    //     pCaption: "",
    //     pNotes: ""
    //   },
    //   {
    //     pID: 3,
    //     pName: "Code Javascript",
    //     pStart: "",
    //     pEnd: "",
    //     pClass: "ggroupblack",
    //     pLink: "",
    //     pMile: 0,
    //     pRes: "Brian",
    //     pComp: 0,
    //     pGroup: 1,
    //     pParent: 0,
    //     pOpen: 1,
    //     pDepend: "",
    //     pCaption: "",
    //     pNotes: ""
    //   },
    //   {
    //     pID: 31,
    //     pName: "Define Variables",
    //     pStart: "2017-02-25",
    //     pEnd: "2017-03-17",
    //     pClass: "gtaskpurple",
    //     pLink: "",
    //     pMile: 0,
    //     pRes: "Brian",
    //     pComp: 30,
    //     pGroup: 0,
    //     pParent: 3,
    //     pOpen: 1,
    //     pDepend: "",
    //     pCaption: "",
    //     pNotes: ""
    //   },
    //   {
    //     pID: 32,
    //     pName: "Calculate Chart Size",
    //     pStart: "2017-03-15",
    //     pEnd: "2017-03-24",
    //     pClass: "gtaskgreen",
    //     pLink: "",
    //     pMile: 0,
    //     pRes: "Shlomy",
    //     pComp: 40,
    //     pGroup: 0,
    //     pParent: 3,
    //     pOpen: 1,
    //     pDepend: "",
    //     pCaption: "",
    //     pNotes: ""
    //   },
    //   {
    //     pID: 33,
    //     pName: "Draw Task Items",
    //     pStart: "",
    //     pEnd: "",
    //     pClass: "ggroupblack",
    //     pLink: "",
    //     pMile: 0,
    //     pRes: "Someone",
    //     pComp: 40,
    //     pGroup: 2,
    //     pParent: 3,
    //     pOpen: 1,
    //     pDepend: "",
    //     pCaption: "",
    //     pNotes: ""
    //   },
    //   {
    //     pID: 332,
    //     pName: "Task Label Table",
    //     pStart: "2017-03-06",
    //     pEnd: "2017-03-09",
    //     pClass: "gtaskblue",
    //     pLink: "",
    //     pMile: 0,
    //     pRes: "Brian",
    //     pComp: 60,
    //     pGroup: 0,
    //     pParent: 33,
    //     pOpen: 1,
    //     pDepend: "",
    //     pCaption: "",
    //     pNotes: ""
    //   },
    //   {
    //     pID: 333,
    //     pName: "Task Scrolling Grid",
    //     pStart: "2017-03-11",
    //     pEnd: "2017-03-20",
    //     pClass: "gtaskblue",
    //     pLink: "",
    //     pMile: 0,
    //     pRes: "Brian",
    //     pComp: 0,
    //     pGroup: 0,
    //     pParent: 33,
    //     pOpen: 1,
    //     pDepend: "332",
    //     pCaption: "",
    //     pNotes: ""
    //   },
    //   {
    //     pID: 34,
    //     pName: "Draw Task Bars",
    //     pStart: "",
    //     pEnd: "",
    //     pClass: "ggroupblack",
    //     pLink: "",
    //     pMile: 0,
    //     pRes: "Anybody",
    //     pComp: 60,
    //     pGroup: 1,
    //     pParent: 3,
    //     pOpen: 0,
    //     pDepend: "",
    //     pCaption: "",
    //     pNotes: ""
    //   },
    //   {
    //     pID: 341,
    //     pName: "Loop each Task",
    //     pStart: "2017-03-26",
    //     pEnd: "2017-04-11",
    //     pClass: "gtaskred",
    //     pLink: "",
    //     pMile: 0,
    //     pRes: "Brian",
    //     pComp: 60,
    //     pGroup: 0,
    //     pParent: 34,
    //     pOpen: 1,
    //     pDepend: "",
    //     pCaption: "",
    //     pNotes: ""
    //   },
    //   {
    //     pID: 342,
    //     pName: "Calculate Start/Stop",
    //     pStart: "2017-04-12",
    //     pEnd: "2017-05-18",
    //     pClass: "gtaskpink",
    //     pLink: "",
    //     pMile: 0,
    //     pRes: "Brian",
    //     pComp: 60,
    //     pGroup: 0,
    //     pParent: 34,
    //     pOpen: 1,
    //     pDepend: "",
    //     pCaption: "",
    //     pNotes: ""
    //   },
    //   {
    //     pID: 343,
    //     pName: "Draw Task Div",
    //     pStart: "2017-05-13",
    //     pEnd: "2017-05-17",
    //     pClass: "gtaskred",
    //     pLink: "",
    //     pMile: 0,
    //     pRes: "Brian",
    //     pComp: 60,
    //     pGroup: 0,
    //     pParent: 34,
    //     pOpen: 1,
    //     pDepend: "",
    //     pCaption: "",
    //     pNotes: ""
    //   },
    //   {
    //     pID: 344,
    //     pName: "Draw Completion Div",
    //     pStart: "2017-05-17",
    //     pEnd: "2017-06-04",
    //     pClass: "gtaskred",
    //     pLink: "",
    //     pMile: 0,
    //     pRes: "Brian",
    //     pComp: 60,
    //     pGroup: 0,
    //     pParent: 34,
    //     pOpen: 1,
    //     pDepend: "342,343",
    //     pCaption: "",
    //     pNotes: ""
    //   },
    //   {
    //     pID: 35,
    //     pName: "Make Updates",
    //     pStart: "2017-07-17",
    //     pEnd: "2017-09-04",
    //     pClass: "gtaskpurple",
    //     pLink: "",
    //     pMile: 0,
    //     pRes: "Brian",
    //     pComp: 30,
    //     pGroup: 0,
    //     pParent: 3,
    //     pOpen: 1,
    //     pDepend: "333",
    //     pCaption: "",
    //     pNotes: ""
    //   }
    // ];
  }
}
