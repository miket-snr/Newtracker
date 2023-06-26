import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { absareq } from 'src/app/_classes/absareq';
import { ModalService } from 'src/app/_modal';
import { ApidataService } from 'src/app/_services/apidata.service';
import { AuthService } from 'src/app/_services/auth.service';
import { DialogService } from 'src/app/_services/dialog.service';

@Component({
  selector: 'app-fundingeditor',
  templateUrl: './fundingeditor.component.html',
  styleUrls: ['./fundingeditor.component.css']
})
export class FundingeditorComponent implements OnInit, OnDestroy {
  @Input() formGroupName!: string
  @Input() vm: absareq
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
  fundingForm = this.fb.group({
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
    budgetgroup: '',
    budgetprogram: '',
    funding: this.fb.array([])
  })
  subs: Subscription;
	helpline = this.apiserv.getHelptexts('PSFUNDING');
  mytext = ` <p>Simply fill the <strong>Initiative</strong> (Cipline) number into the Initiative field, </p>
  <p> the other fields will get populated when you save as they are read off the Cipline table.</p>
  <h4><strong>What is a Cipline number?</strong></h4>
  <p>A certain number of budget lines are provided by ABSA each year and this is called the Ciplist. </p>
  <p>Each line is called an <strong><u>initiative</u></strong>.</p>
  <p> These lines are loaded into SAP and each allocated a number. The first 2 digits are the year, and this number is the Initiative number</p>
  <p>The line amount can be allocated to a Project and any money left over between Initiative Amount </p>
  <p> and the Approved Purchase order Amount can be transferred to a new line.</p>
  <ul><li>Things that can happen to amounts on an Initiative:</li>
  <li><strong>Allocated</strong> to a Project</li>
  <li>Transferred to an existing Initiative via a <strong>ReAllocation</strong></li>
  <li>Transferred to a new Initiative and this can be a <strong>Pooled</strong> line</li>
  <li>Given back as <strong>Underspend</strong></li><li>A line can be <strong>cancelled </strong>and this money cannot be used for anything else</li>
  <li>A line can be <strong>surrendered</strong> and this can be reused for other projects in the same Cipgroup</li>
  </ul>
  <h4><strong>Where do you find the Initiative number?</strong></h4>
  <p>Look at the Budget Report and find the relevant line using filters.</p>
  <h4><strong>What if no Initiative (Cipline) is found</strong>?</h4>
  <ul><li>If no obvious Initiative number is found then you must provide information in the other Fields</li>
  <li>Select the relevant Cip-Group, Cipcode(*important), Workstream, and Amount(*important)</li>
  <li>Contact the Regional Manager or the Central Fund manager for assistance, as a new line may have to be created from other lines via savings, surrenders, or Reallocations.</li></ul>`;

  constructor(public apiserv: ApidataService, public fb: FormBuilder,
    private rootFormGroup: FormGroupDirective,
    public modalServicejw: ModalService,
    private authserv: AuthService, 
    private helper2: DialogService) { }

  ngOnInit(): void {
    //this.parentForm = this.rootFormGroup.control as FormGroup
    this.subs = this.apiserv.postGEN({ REFERENCE: this.vm.ABSAREQNO }, 'GET_FUNDING').subscribe(line => {
      for (let prop in this.fundingForm.value) {
        if (this.vm[prop.toUpperCase()]) {
          this.fundingForm.get(prop).setValue(this.vm[prop.toUpperCase()], { emitEvent: false })
        }
      }

      this.fundingForm.get('fund_comment').setValue(atob(this.fundingForm.value.fund_comment))
    })
    this.onChanges();
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  onChanges(): void {
    this.fundingForm.valueChanges.subscribe(val => {
      this.onCodeSelect();
    });
  }
  onSubmit() {
    let tobj = {};
    for (const key in this.fundingForm.value) {
      tobj[key.toUpperCase()] = (key == 'funding') ? JSON.stringify(this.fundingForm.value[key]) : this.fundingForm.value[key];
    }
    // tobj['INITIATIVE'] = tobj['INITIATIVE'].replace(/\s/g, '')
    tobj['FUND_COMMENT'] = this.apiserv.xtdbtoa(tobj['FUND_COMMENT']);
    tobj['FUNDING_SOURCES'] = this.apiserv.xtdbtoa(tobj['FUNDING_SOURCES']);
    tobj['REFERENCE'] = this.vm.ABSAREQNO;
    this.apiserv.postGEN(tobj, 'UPDATE_FUNDING').subscribe(ans => {
      this.apiserv.messagesBS.next(ans.RESULT.MESSAGE);
    })

    this.resource = JSON.stringify(tobj);
  }
  fundLocator() {
    if (this.vm['region'] && this.fundingForm.value['cipgroup'] && !this.fundingForm.value['initiative']) {
      this.apiserv.locateFunds(this.vm['region'], this.fundingForm.value['cipgroup'], this.fundingForm.value['cipgroup'])
      this.modalServicejw.open('helpfund');
    }
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
    let txt = (line && line.RESULT && line.RESULT.text) ? line.RESULT.text : this.fundingForm.value.cipcode;
    this.fundingForm.get('cipname').setValue(txt, { emitEvent: false });
  }
  showHelp(){
    this.helper2.helpopen({title:'Funding', helptext:this.helpline.LINE1}) 
    // = !this.helper;
    // this.hlptxt = this.helper? 'Hide Help' : "Show Help";
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
  taskClose() {
    this.modalServicejw.close('taskedit')
  }
  emitEventToChild() {
    this.eventsSubject.next();
  }

}
