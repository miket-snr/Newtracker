import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { ApidataService } from 'src/app/_services/apidata.service';
import { OutputFileType } from 'typescript';

@Component({
  selector: 'app-multi-sites',
  templateUrl: './multi-sites.component.html',
  styleUrls: ['./multi-sites.component.css']
})
export class MultiSitesComponent implements OnInit {
@Input() sites = '';
form!: FormGroup ;
multisites = [this.newSite()];
importsitearea = '';
Helpimport = false;

  constructor(private rootFormGroup: FormGroupDirective, public apiserv: ApidataService) {
    this.form = this.rootFormGroup.control as FormGroup
   }

  ngOnInit(): void {
   if (this.form.value.sites){
    this.multisites = JSON.parse(this.form.value.sites);
   }
  }

  copyAndPaste(instring = ''){
    const newsitesArray = instring.split('\n').map((line) => line.split('\t'))
   newsitesArray.forEach(newsite=>{
     let newsiteone = this.newSite();
     newsiteone.oneview = (newsite.length > 0 )? newsite[0]:'?';
     newsiteone.budget = (newsite.length > 1 )? newsite[1]:'?';
     newsiteone.knownas = (newsite.length > 2 )? newsite[2]:'?';
     newsiteone.startdate = (newsite.length > 3 )? this.formatDate(newsite[3]):'?';
     newsiteone.enddate = (newsite.length > 4 )? this.formatDate(newsite[4]):'?';
     
     this.multisites.push(JSON.parse(JSON.stringify(newsiteone)));
   })
   this.importsitearea = '';
   this.multisites = this.multisites.filter(obj=>{
    return obj.oneview && obj.oneview.length > 5
   })
   this.form.controls.sites.patchValue(JSON.stringify(this.multisites));
  }
  newSite() {
    return {
      oneview: '',
      knownas: '',
      startdate: this.form?.value.propstartdate,
      enddate: this.form?.value.propenddate,
      budget:'0', 
    }
  }
  addaSite() {
      this.multisites.push(this.newSite());

  }
  removeSite(index = -1) {
    if (index >= 0) {
      this.multisites.splice(index,1);

    }
  }
  updateSap(){
    let lclsites = JSON.stringify(this.multisites);
    let statemachine = this.apiserv.lclstate ;
    this.apiserv.postGEN({REFERENCE:this.apiserv.lclstate.currentreq,SITES:lclsites},'UPDATEMULTISITES').subscribe(a=> {
        statemachine.sites = lclsites;
      }
    )
  }
  newValue($event,i, item){
    this.form.controls.sites.patchValue(JSON.stringify(this.multisites));
  }
  importSites(){
    this.copyAndPaste(this.importsitearea)
  }
  formatDate(datein): string {
    datein = new Date(datein);
    datein.setHours(0, 0, 0, 0);
    let dd = ''; let mm = ''; let yyyy = 0;
    try {
      // console.log(datein);
      dd = String(datein.getDate()).padStart(2, '0');
      mm = String(datein.getMonth() + 1).padStart(2, '0'); //January is 0!
      yyyy = datein.getFullYear();
    } catch (e) {
      alert(datein)
    }
    return yyyy + '-' + mm + '-' + dd;
  }
}
