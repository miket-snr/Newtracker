import { Component, OnInit } from '@angular/core';
import { ApidataService } from 'src/app/_services/apidata.service';
import { AuthService } from 'src/app/_services/auth.service';

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
ohscontacts = this.apiserv.pmlist.filter(line=>{
  return true;
})
  constructor(public apiserv:ApidataService, public authserv: AuthService) { }

  ngOnInit(): void {
  }
canEdit(): boolean{
return this.authserv.currentUserValue.PASSWORD.includes('OHS')
}
}
