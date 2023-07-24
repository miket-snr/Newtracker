import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ohs',
  templateUrl: './ohs.component.html',
  styleUrls: ['./ohs.component.css']
})
export class OhsComponent implements OnInit {
ohsitem = {
  DATE00:'',
  DATE01:'',
  DATE03:'',
  DATE02:'',
  notapp: false
}
  constructor() { }

  ngOnInit(): void {
  }

}
