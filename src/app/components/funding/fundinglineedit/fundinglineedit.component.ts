import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-fundinglineedit',
  templateUrl: './fundinglineedit.component.html',
  styleUrls: ['./fundinglineedit.component.css']
})
export class FundinglineeditComponent implements OnInit {
@Input() item: any

i = 0

  constructor() { }

  ngOnInit(): void {
  }
newValue() {
  
}
}
