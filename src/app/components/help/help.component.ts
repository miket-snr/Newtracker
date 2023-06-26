import { Component, Input, OnInit } from '@angular/core';
import { ApidataService } from 'src/app/_services/apidata.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {
  @Input() edit = true;
  @Input() helper = {CONTRACTCODE:'PSPT', KEYCODE:"PSFUNDING", TITLE:'',QUESTION:'',
  LINE1: ` <p>Simply fill the <strong>Initiative</strong> (Cipline) number into the Initiative field, </p>
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
  <li>Contact the Regional Manager or the Central Fund manager for assistance, as a new line may have to be created from other lines via savings, surrenders, or Reallocations.</li></ul>`
 , LINE2:''}
 texts = [
  {code:"PSFUNDING",TEXT:"Funding"},
  {code:"PSPROJDATES",TEXT:"Progress"},
  {code:"PSREQ",TEXT:"Requirement"},
  {code:"PSLOCATION",TEXT:"Location"},
  {code:"APPROVAL",TEXT:"Approval"},
  {code:"PSCOMMENT",TEXT:"Comments"},
  {code:"PSTASKS",TEXT:"Tasks"},
  {code:"PSDOCS",TEXT:"Documents"},
  {code:"PSVIDEOS",TEXT:"Videos"},
 ]


  constructor(private apiserv: ApidataService) { }

  ngOnInit(): void {
    if(this.apiserv.helptexts.length < 1){
    this.apiserv.getHelptexts();
    }
  }
  pushToSap(){
    let temp = { ...this.helper}
    temp.LINE1 = this.apiserv.xtdbtoa(temp.LINE1);
 this.apiserv.postGEN(temp, 'PUT_HELPTEXTS','PROJECTS').subscribe( lt=>{
    this.apiserv.messagesBS.next('SAP Updated')
 })
  }
  onChange(){
    this.helper = this.apiserv.getHelptexts(this.helper.KEYCODE)
    
  }
}
 