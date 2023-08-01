import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto'
import { ApidataService } from 'src/app/_services/apidata.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
   
  constructor(public router: Router, public apiserv:ApidataService) { }
  importsitearea = '';
  arrayoflines = [];
  counter = 0;
  out = '';
  ngOnInit(): void {
    if(this.apiserv.progressBS.value.length == 0)
    {
    this.apiserv.getProgresslist(this.apiserv.lclstate.region, this.apiserv.lclstate.pmanager);
  
    }
    
    setTimeout(() => {
      this.worker();
    }, 5000);
  
   
  }
 
  worker(){
   this.router.navigate(['worklist']) 
  }

 async importSites() {
    const newsitesArray = this.importsitearea.split('\n')
    this.arrayoflines = newsitesArray;
     this.apiserv.getone (newsitesArray[0])
  }
}
