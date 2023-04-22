import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FLINE, FTRANSFER, IMLINE } from 'src/app/_classes/ftransfer';
import { ModalService } from 'src/app/_modal';
import { ApidataService } from 'src/app/_services/apidata.service';


@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.css']
})
export class TransfersComponent implements OnInit {
@Input() itemBS: BehaviorSubject<any> ;
ciplineadjs = [
  {
    DOCNO:'',CIPLINE_ID:'',BUDGETGROUP:'',
ENTRYCODE:'',
PARTNER_ID:'',
SHORTCOMMENT:'',NOTE:'',
POSTINGDATE:'',
ENTRYDATE:'',
VALUEOF:'',CAPTUREDYY:'',
APPROVEDBY:'',PROJLINK:''
  }
]
budgetview: any ;
  docheader = {
    INITIATIVE: ' ',
    PROJLINK: ' ',
    ENTRYCODE: ' ',
    VALUEOF: 0,
    ONEVIEW:'',
    REGION: '',
    SHORTCOMMENT:'',
    CIPCODE:'',
    NOTE: ' ',
    PARTNERID: ' ',
    POSTINGDATE: ' ',
    AGREEMENT: '',
    BUDGETGROUP:''
  }
  imForm = new FormGroup( {
    im: new FormControl('')
  })
   
 impositions = [];
 imtree = []
  positions = [];
  imsbudget = []
  imlist = [{A:'top',B:'ABCL'}]
  regions = [];
  parent = false;
  provregions = [];
  options = [];
  filteredOptions: Observable<FTRANSFER[]>;
  helpbtntext = 'Show Help';
  helptext = `<p>Information regarding usage of funds linked to an Initiative</p><p><br></p><p>The PSTracker Application has an objective to track the original budget</p>
  <p>provided by Absa. The budget consists of multiple lines of Initiatives that are</p><p>earmarked for specific regions, buildings and type of initiative.</p>
  <p><br></p><p>Each line has an allocated amount, and the total must be preserved and be</p><p>reconcilable.</p>
  <p><br></p><p>There are multiple actions that can be carried out with regard to the funds on</p>
  <p>an Initiative line. Many terms have been mentioned and it all has become</p>
  <p>confusing, so it is required that we clarify what each term means and what the</p><p>implications are.</p><p><br></p>
  <p>1. <strong>Allocate </strong>an amount to a Project for Board approval, this is the most</p><p>common.</p>
  <p class=\"ql-indent-1\">a. Projects are normally limited to one per Initiative.</p><p class=\"ql-indent-1\">b. Some initiatives like Headwinds, are allowed multiple projects</p>
  <p class=\"ql-indent-1\">against the line.</p><p>2. <strong>Underspend</strong> if the allocated amount is less than the budget line then</p><p>this difference cannot be reallocated or used. Governance principle except for </p><p> \"Headwinds\", however pending final clarity from Absa Finance.</p><p>3. <strong>Sacrifice</strong> a line and then the team will be able to use the funds</p><p>elsewhere. Absa Approval required before reuse. Correct, however it is</p><p>the same as reallocation of a project. We should perhaps stick to re-</p><p>allocation?</p><p>4.<strong> Reallocate </strong> this is when the budget line is reassigned to another line</p><p>and can assist when:</p><p class=\"ql-indent-1\">a. The Project is on another Cipcode or Cipgroup than what was</p><p class=\"ql-indent-1\">originally planned.</p><p class=\"ql-indent-1\">b. Multiple lines must be aggregated to create a larger total.</p><p class=\"ql-indent-1\">c. Approval from Absa is required before reallocation is made.</p><p class=\"ql-indent-1\">d. An initiative CIP allocation can change after approval</p><p>5. <strong>Surrender or Cancel </strong>indicates that the budget line is locked against</p><p>expenditure. Funds will be returned to client.</p><p>6. <strong>Deferrals</strong> - Budget will be carried over to the following year, budget line</p><p>to be locked against in year expenditure.</p><p>7. <strong>On Hold</strong>- It can be that a project be placed on hold- pending client</p><p>decision</p><p><br></p><h2>Notes:</h2><p>The terms <strong>Savings and Supplement</strong> are not used anymore. They refer to</p><p>underspend and overspend</p><p><br></p><p><strong>CIP Reallocations</strong>- An initiative CIP allocation can change after approval.</p><p><br></p><p><strong>Budget Transfers:</strong></p>
  <p class=\"ql-indent-1\">- Between CIP Lines within the same workstream. But not between retail</p><p class=\"ql-indent-1\">and corporate</p>
  <p class=\"ql-indent-1\">- A formal process to be followed where a budget transfer form is</p><p class=\"ql-indent-1\">completed and signed off by the relevant CRES Sponsor or noted at the</p>
  <p class=\"ql-indent-1\">relevant board forum Cost Board or BTB.</p>
`
  help = false;
  constructor(public apiserv: ApidataService , private modaljw: ModalService) { }

  ngOnInit(): void {
    this.apiserv.ciplineadjBS.subscribe(item=> {
     this.ciplineadjs = JSON.parse(item[0].MOVEMENTS)
     this.ciplineadjs.forEach(liner=>{
      liner.SHORTCOMMENT = this.apiserv.xtdatob(liner.SHORTCOMMENT)
      liner.NOTE = this.apiserv.xtdatob(liner.NOTE);
     })
     this.budgetview = item[0]
     this.docheader.ONEVIEW = this.budgetview.ONEVIEW;
     this.docheader.REGION = this.budgetview.REGION;
     this.docheader.SHORTCOMMENT = this.budgetview.SHORTCOMMENT;
     this.docheader.CIPCODE = this.budgetview.CIPCODE;

    })
    
    this.imForm.valueChanges.subscribe(value=> {
      // this.apiserv.getPositionFunds(this.imForm.value.im ); 
    })
    this. initLists() ;
  }
  private _filter(value: string) {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.tag.toLowerCase().includes(filterValue));
  }
  toggle(tag = false) {
    tag = !tag
  }
  closejw(item: any){
    this.modaljw.close(item)
  }
  checkValue(doc:any){
    return ( doc.VALUEOF != 0 &&
    doc.POSTINGDATE.length > 2 &&
    doc.ENTRYCODE.length > 1 )
  }
  onSubmit() {
    // const modeltosap = {
    //   REGION: this.docheader.region,
    //   PROVREGION: this.docheader.provregion,
    //   ONEVIEW: this.docheader.oneview,
    //   KNOWNAS: this.docheader.knownas,
    //   DETAILS: this.apiserv.xtdbtoa(this.docheader.details),
    //   PROPSTARTDATE: this.docheader.propstartdate.split('-').join(''),
    //   AMOUNT: this.docheader.propenddate.split('-').join(''),
    //   CIPNAME: this.docheader.cipname,
    //   CIPCODEFROM: this.docheader.cipcodefrom,
    //   CIPCODETO: this.docheader.cipcodeto,
    //   CREATEDBY: "Webuser"
    // }
    // this.apiserv.postGEN(modeltosap, 'NEW_PROJREQUEST').subscribe(reply => {
    //   console.log(reply);
    // })

    console.log(this.docheader);
  }
  initLists() {
    let ims = [];
   

    // this.filteredOptions = this.cipForm.controls.cipparent.valueChanges.pipe(
    //   startWith(''),
    //   map((value: any) => this._filter(value || '')),
    // );
    this.options = this.apiserv.cipcodes ;
    this.regions = this.apiserv.regions;
 
  }
  buildChildren(imline: IMLINE){
   imline.children = this.impositions.filter( imposit=>{
  return imposit.parent === imline.posnr
    })
   imline.children.forEach( line=> {
    this.buildChildren(line)
   })
  }
  buildFundingChildren(fline:FLINE){
    fline.children = this.imsbudget.filter( imposit=>{
      return imposit.name.includes(fline.name) && imposit.level == fline.level + 1
        })
       fline.children.forEach( line=> {
        this.buildFundingChildren(line)
       })
  }
  onGroupSelect(){
    
  }
  showHelp(){
    this.help = !this.help;
    this.helpbtntext = this.help? 'Hide Help':'Show Help'
  }
}



