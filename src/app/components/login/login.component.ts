import { Component, createPlatform, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthService } from 'src/app/_services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
longtext = '';
register = false;
// awaiting = false;
// loading  = false;
otpgroup :FormGroup;
otpgroupin :FormGroup;
  constructor(
  //  public dialog: MatDialog, 
    public authserv: AuthService,private formBuilder: FormBuilder ) { }

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.otpgroup = this.formBuilder.group({
      email: [null, [ Validators.pattern(emailregex)]],
      sms: [null, [ Validators.pattern(/^\d+$/)]]
    })
    this.otpgroupin = this.formBuilder.group({
      otp: [null]
    });
  }
getOTP(){
let tf = this.otpgroup.value;
this.authserv.getOTP(tf.email, tf.sms) ;
}
confirmOTP() {
  let tf = this.otpgroup.value;
  this.authserv.confirmOTP(tf.email, tf.sms,this.otpgroupin.value.otp)
}
}
