import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto'
import { Subscription } from 'rxjs';
import { ApidataService } from 'src/app/_services/apidata.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements  OnInit, OnDestroy {
  chart: any;
  chart2: any ;
   labels = ['Region 1','Region 2','Region 3','National', 'Energy'];
   ciplines = ['100','100','100','100', '100'];
   projects = ['100','100','100','100', '100'];
   linked = ['100','100','100','100', '100'];
   tracklines = ['100','100','100','100', '100'];
   trackprojects = ['100','100','100','100', '100'];
   trackapproved = ['100','100','100','100', '100'];
   unlinked = ['100','100','100','100', '100'];
  @ViewChild('MyChart') MyChart!: ElementRef;
  @ViewChild('MyChart') MyChart2!: ElementRef;
  subs : Subscription[] = [] ;
  constructor(public router: Router,private apiserv : ApidataService) { }

  ngOnInit(): void {
    this.subs.push(this.apiserv.postGEN({REGION:'ALL'}, 'GET_STATISTICS','PROJECTS').subscribe( list=> {
      this.ciplines = [];
      this.projects = [];
      this.linked = [];
      this.unlinked = [];
      this.labels.forEach(reg=>{
        let cp = list.RESULT.filter(reglist=> {
          return reglist.REGION == reg;
        }) ;
        this.ciplines.push(cp[0].COUNTER1);
        this.projects.push(cp[0].COUNTER2);
        this.linked.push(cp[0].COUNTER3);
        this.unlinked.push((cp[0].COUNTER2 - cp[0].COUNTER3).toString())
        cp=[];
      })
      this.createChart()
    }))
    this.subs.push(this.apiserv.postGEN({TITLE:'Tracked'}, 'GET_STATISTICS','PROJECTS').subscribe( list=> {
      this.tracklines = [];
      this.trackprojects = [];
      this.trackapproved = [];
      this.labels.forEach(reg=>{
        let cp = list.RESULT.filter(reglist=> {
          return reglist.REGION == reg;
        }) ;
        this.tracklines.push(cp[0].COUNTER1);
        this.trackprojects.push(cp[0].COUNTER2);
        this.trackapproved.push(cp[0].COUNTER3);
        this.unlinked.push((cp[0].COUNTER2 - cp[0].COUNTER3).toString())
        cp=[];
      })
      this.createChart2()
    }))
   
  }
  ngOnDestroy(): void {
    this.subs.forEach(sub=> {
      sub.unsubscribe();
    })
  }
  worker(){
    this.router.navigate(['worklist']) 
  }
  createChart(){
    this.chart = new Chart("MyChart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: this.labels, 
	       datasets: [
          {
            label: "Ciplines",
            data: this.ciplines,
            backgroundColor: 'lightblue'
          },
          {
            label: "Projects",
            data: this.projects,
            backgroundColor: 'yellow'
          }  ,
          {
            label: "Linked",
            data: this.linked,
            backgroundColor: 'lightgreen'
          }  ,
          {
            label: "Not Linked",
            data: this.unlinked,
            backgroundColor: 'red'
          }  
        ]
      },
      options: {
        aspectRatio:2
      }
      
    });
  // this.chart2 = new Chart("MyChart2", {
  //   type: 'bar', //this denotes tha type of chart

  //   data: {// values on X-Axis
  //     labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
  //              '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17', ], 
  //      datasets: [
  //       {
  //         label: "Sales",
  //         data: ['467','576', '572', '79', '92',
  //              '574', '573', '576'],
  //         backgroundColor: 'blue'
  //       },
  //       {
  //         label: "Profit",
  //         data: ['542', '542', '536', '327', '17',
  //                '0.00', '538', '541'],
  //         backgroundColor: 'limegreen'
  //       }  
  //     ]
  //   },
  //   options: {
  //     aspectRatio:2.5
  //   }
    
  // });
}
createChart2(){
  this.chart = new Chart("MyChart2", {
    type: 'bar', //this denotes tha type of chart

    data: {// values on X-Axis
      labels: this.labels, 
       datasets: [
        {
          label: "Tracked Lines",
          data: this.tracklines,
          backgroundColor: 'lightblue'
        },
        {
          label: "Projects",
          data: this.trackprojects,
          backgroundColor: 'yellow'
        }  ,
        {
          label: "Approved",
          data: this.trackapproved,
          backgroundColor: 'lightgreen'
        }  ,
        ]
    },
    options: {
      aspectRatio:2
    }
    
  });

}
}
