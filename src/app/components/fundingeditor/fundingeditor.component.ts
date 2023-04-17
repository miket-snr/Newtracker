import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { ModalService } from 'src/app/_modal';
import { ApidataService } from 'src/app/_services/apidata.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-fundingeditor',
  templateUrl: './fundingeditor.component.html',
  styleUrls: ['./fundingeditor.component.css']
})
export class FundingeditorComponent implements OnInit, OnDestroy {
  @Input() formGroupName!: string
  @Output() closer = new EventEmitter<string>();
  options = [];
  request = {};
  help = false;
  helptext = "Show Help";
  eventsSubject: Subject<void> = new Subject<void>();
  task = {};
  sectionid = [true, true, true, true, true];
  grouplines = [];
  resource = '';
  parentForm: FormGroup;
  fundingForm =  this.fb.group({
    reference: '',
    cipname: '',
    cipcode: '',
    cipgroup: '',
    workstream: '',
    im_position: '',
    appreqlink: '',
    projlink: '',
    estimatedbudget: '',
    baselinebudget: '',
    quotation: '',
    quoteamt: '',
    approvedamt: '',
    invoicedamt: '',
    authorizer: '',
    priority: '',
    discretionary: '',
    capex_opex: '',
    fundingyear: '',
    budgetdif: '',
    fund_comment: '',
    initiative: '',
    budgetprogram: '',
    funding: this.fb.array([])
  })
  subs: Subscription ;
  constructor(public apiserv: ApidataService, public fb: FormBuilder,
    private rootFormGroup: FormGroupDirective,
     public modalServicejw: ModalService,
     private authserv: AuthService) { }

  ngOnInit(): void {
    this.parentForm = this.rootFormGroup.control as FormGroup
    this.subs =    this.apiserv.postGEN({REFERENCE: this.parentForm.value.absareqno}, 'GET_FUNDING').subscribe( line=>{
      for (let prop in this.fundingForm.value ) {
      if(line.RESULT[prop.toUpperCase()]){   this.fundingForm.get(prop).setValue(line.RESULT[prop.toUpperCase()],  { emitEvent: false })
      }
      }
    
    this.fundingForm.get('fund_comment').setValue(atob(this.fundingForm.value.fund_comment))
     } )
    this.onChanges();
  }
  ngOnDestroy() {
    this.subs.unsubscribe() ;
  }
  onChanges(): void {
    this.fundingForm.valueChanges.subscribe(val => {
     this.onCodeSelect();
    });
  }
  onSubmit() {
    let tobj = {};
    for (const key in this.fundingForm.value) {  
      tobj[key.toUpperCase()] = (key == 'funding')? JSON.stringify(this.fundingForm.value[key]) : this.fundingForm.value[key];
    }
    tobj['FUND_COMMENT'] = btoa( tobj['FUND_COMMENT']);
    tobj['FUNDING_SOURCES'] = btoa( tobj['FUNDING_SOURCES']);
    tobj['REFERENCE'] = this.parentForm.value['absareqno'];
    this.apiserv.postGEN(tobj, 'UPDATE_FUNDING'). subscribe( ans=> {
      this.apiserv.messagesBS.next(ans.RESULT.MESSAGE);
    })
    
    this.resource = JSON.stringify(tobj);
  }
  closeme(code) {
    this.closer.emit(code)
  }
  get funding(): FormArray {
    return this.fundingForm.get("funding") as FormArray
  }
  newFunder(): FormGroup {
    return this.fb.group({
      funderposition: '',
      amount: '',
    })
  }
  addFunder() {
    this.funding.push(this.newFunder());
    //  this.varioussites =  this.sites.length > 1 ? true : false 
  }
  removeFunder(index = -1) {
    if (index >= 0) {
      this.funding.removeAt(index);
    }
  }
  checkReady(code = '') {
    return true;
  }
  onGroupSelect() {
    this.options = this.grouplines.filter(line => {
      return line.linename.substring(0, 17) == this.fundingForm.value.cipgroup.substring(0, 17);
    })
  }
  onCodeSelect() {
    let line = this.apiserv.cipcodes.find(liner => {
      return liner.code === this.fundingForm.value.cipcode;
    })
    let txt = ( line && line.RESULT && line.RESULT.text )? line.RESULT.text : this.fundingForm.value.cipcode;
    this.fundingForm.get('cipname').setValue(txt, { emitEvent: false });
  }
showHelp(){
  this.help = !this.help;
  this.helptext = this.help? "Hide Help": "Show Help";
}

sendTask() {
  let lclobj = {
    LINKEDTYPE: 'BT',
    SENTBY: this.authserv.currentUserValue.EMAIL.toLocaleUpperCase(),
    LINKEDOBJNR: this.apiserv.lclstate.currentreq['ABSAREQNO']
  }
  this.apiserv.postGEN(lclobj, 'NEW_TASKREQUEST').subscribe(reply => {
    const lctask = JSON.parse(JSON.stringify(reply.RESULT));
    this.task = lctask;
    this.emitEventToChild();
    this.modalServicejw.open('taskedit')
  })

}
taskClose(){
  this.modalServicejw.close('taskedit')
}
emitEventToChild() {
  this.eventsSubject.next();
}

}
