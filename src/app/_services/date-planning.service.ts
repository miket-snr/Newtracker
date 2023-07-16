import { Injectable } from '@angular/core';
import { dateset } from '../_classes/dateset';

@Injectable({
  providedIn: 'root'
})
export class DatePlanningService {

  constructor() { }
  updatePlans(blankdate: dateset) {

    let durations = blankdate.DATABAG.length > 10? blankdate.DATABAG.split(':') : [];
    while (durations.length < 9){
      durations.push('7');
    }
   blankdate.DATE05 = this.datediff(blankdate.DATE06, durations[4], 0)
   blankdate.DATE04 = this.datediff(blankdate.DATE05, durations[3], 0)
   blankdate.DATE03 = this.datediff(blankdate.DATE04, durations[2], 0)
   blankdate.DATE02 = this.datediff(blankdate.DATE03, durations[1], 0)
   blankdate.DATE01 = this.datediff(blankdate.DATE02, durations[0], 0)
   blankdate.DATE08 = this.datediff(blankdate.DATE07, durations[5], 1)
   blankdate.DATE09 = this.datediff(blankdate.DATE08, durations[6], 1)
   blankdate.DATE09 = this.lastdayofmonth(blankdate.DATE09);
   durations[7] = this.datecount(blankdate.DATE06,blankdate.DATE07).toString();
   durations[8] = this.datecount(blankdate.DATE01,blankdate.DATE09).toString();
   blankdate.DATABAG = durations.join(':');
    return { ...blankdate }
  }

  lastdayofmonth(dayinmonth = '') {
    if (dayinmonth.length > 5) {
      let d = new Date(dayinmonth);
      d.setHours(0, 0, 0, 0)
      if (d.getMonth() <= 10) {
        d.setFullYear(d.getFullYear(), d.getMonth() + 1, 0);
      } else {
        d.setFullYear(d.getFullYear() + 1, 0, 0);
      }
      return this.formatDate(d);
    } else {
      return '';
    }
  }


  datediff(a, b, c = 0) {
    let out = '';
    let adate = new Date(a);
    adate.setHours(0, 0, 0, 0)

    try {
      // const slicedArray = this.calcsstart.slice(0, b);
      // let  sum = slicedArray.reduce((sum, v) => sum + v);
      if (c == 0) {

        adate = new Date(adate.setDate(adate.getDate() - parseInt(b)));

      } else {
        adate = new Date(adate.setDate(adate.getDate() + parseInt(b)));
      }
    } catch (e) {
   
    }
    try {
      out = this.formatDate(adate);
    } catch (e) {
   
      out = '';
    }

    return out;
  }
  datecount(a, b) {
    let adate = new Date(a)
    adate.setHours(0, 0, 0, 0);
    let bdate = new Date(b);
    bdate.setHours(0, 0, 0, 0)
    let Difference_In_Time = bdate.getTime() - adate.getTime();

    // To calculate the no. of days between two dates
    return Math.round(Difference_In_Time / (1000 * 3600 * 24));
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
  getblankDates(datetype = 'PRABSAP') {
    let dateend = new Date()
    dateend.setDate(dateend.getDate() + 120 );
    let datestart = new Date()
    datestart.setDate(datestart.getDate() + 90 );
    
   let lcldate = {
     REFERENCE:'00000000', DATESET:datetype,  DATE01: '', DATE02: '', DATE03: '', DATE04: '', DATE05: '', 
     DATE06: this.formatDate(datestart ), 
        DATE07: this.formatDate(dateend ), DATE08: '', DATE09: '',DAY_A:'', DATABAG:'7:21:7:21:14:21:45'} 
        return this.updatePlans(lcldate);
  }

//   formatDate(datein):string{  
// let dd = String(datein. getDate()). padStart(2, '0');
// var mm = String(datein. getMonth() + 1). padStart(2, '0'); //January is 0!
// var yyyy = datein. getFullYear();
// ​
// return  yyyy + '-' + mm + '-' + dd ;
//   }
}
