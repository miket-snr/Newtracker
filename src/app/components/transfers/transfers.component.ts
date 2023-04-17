import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FLINE, FTRANSFER, IMLINE } from 'src/app/_classes/ftransfer';
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
    DOCNO:'',CIPLINE_ID:'',PROGRAM_NAME:'',APPROVAL_YEAR:'',
ENTRYCODE:'',
PARTNER_ID:'',
SHORTCOMMENT:'',
POSTINGDATE:'',
ENTRYDATE:'',
VALUEOF:'',CAPTUREDYY:'',
APPROVEDBY:'',PROJLINK:''
  }
]
budgetview: any ;
  docheader = {
    cipgroup: ' ',
    cipcode: ' ',
    entrycode: ' ',
    valueof: ' ',
    program: ' ',
    year: ' ',
    movement: ' ',
    comment: ' ',
    impositionof: ' ',
    impositionto: ' ',
    postingdate: ' ',
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
  constructor(public apiserv: ApidataService) { }

  ngOnInit(): void {
    this.apiserv.ciplineadjBS.subscribe(item=> {
     this.ciplineadjs = JSON.parse(item[0].MOVEMENTS)
     this.ciplineadjs.forEach(liner=>{
      liner.SHORTCOMMENT = atob(liner.SHORTCOMMENT)
     })
     this.budgetview = item[0]
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
    
  }
  onSubmit() {
    // const modeltosap = {
    //   REGION: this.docheader.region,
    //   PROVREGION: this.docheader.provregion,
    //   ONEVIEW: this.docheader.oneview,
    //   KNOWNAS: this.docheader.knownas,
    //   DETAILS: btoa(this.docheader.details),
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
    // this.apiserv.getIMPositions();
    // this.apiserv.impositions$.subscribe(postab =>{
    //   this.impositions = postab
    //   this.imtree = this.impositions.filter(fil=>  {
    //     return fil.parent <= '00000001'
    //   })
    //   this.imtree.forEach( list1 => {
    //     this.buildChildren(list1)
    //   }
    //   )})
    // this.apiserv.fundsview$.subscribe(fundstable => {
    //   ims = fundstable.filter(line=> {
    //     return line.FISCAL_YEAR === 0;
    //    })
    //   this.imsbudget = ims.map(liner => {
    //     return {
    //       name: liner.POSITION, children:[], showme: false,
    //       value: liner.VALUE, valuedistributed: liner.VALUE_DISTRIBUTED,
    //       budgetcat: liner.BUDGET_CATEGORY, level: liner.LEVEL
    //     }
    //   }); 
    //   this.positions = this.imsbudget.filter( filline => {
    //     return filline.level == 1;
    //   })
      
    //   this.positions.forEach(outline =>{
    //     this.buildFundingChildren(outline);
    //   } ) 

      // this.positions = this.positions.map(liner => {
      //   return {
      //     name: liner.POSITION, children: [], showme: true,
      //     value: liner.VALUE, valuedistributed: liner.VALUE_DISTRIBUTED,
      //     budgetcat: liner.BUDGET_CATEGORY, level: liner.LEVEL
      //   }
      // })
      // this.positions.forEach(entry => {
      //   entry.children = ims.filter(reach => {
      //     return reach.LEVEL == 2 && reach.POSITION.includes(entry.name);
      //   })

      //   entry.children = entry.children.map(liner => {
      //     return {
      //       name: liner.POSITION, children: [], showme: true,
      //       value: liner.VALUE, valuedistributed: liner.VALUE_DISTRIBUTED,
      //       budgetcat: liner.BUDGET_CATEGORY, level: liner.LEVEL
      //     }
      //   })
      //   entry.children.forEach(entry2 => {
      //     entry2.children = ims.filter(reach => {
      //       return reach.LEVEL == 3 && reach.POSITION.includes(entry2.name);
      //     })
      //     entry2.children = entry2.children.map(liner => {
      //       return {
      //         name: liner.POSITION, children: [], showme: true,
      //         value: liner.VALUE, valuedistributed: liner.VALUE_DISTRIBUTED,
      //         budgetcat: liner.BUDGET_CATEGORY, level: liner.LEVEL
      //       }
      //     })

      //   })
      // })
  //  })

    // this.filteredOptions = this.cipForm.controls.cipparent.valueChanges.pipe(
    //   startWith(''),
    //   map((value: any) => this._filter(value || '')),
    // );
    this.options = this.apiserv.cipcodes ;
    this.regions = this.apiserv.regions;
    // this.apiserv.ciplookups$.subscribe(reply => {
    //   reply.forEach(line => {
    //     if (line.A === 'cipline') {
    //       const linex = { linename: line.B, tag: line.C }
    //       this.options.push(linex)
    //     }
    //     if (line.A === 'region') {
    //       const linex = { linename: line.B, tag: line.B }
    //       this.regions.push(linex)
    //     }
    //     if (line.A === 'provregion') {
    //       const linex = { linename: line.B, tag: line.B }
    //       this.provregions.push(linex)
    //     }
    //   })
    // })
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
}



