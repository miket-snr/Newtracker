import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-showhelp',
  templateUrl: './showhelp.component.html',
  styleUrls: ['./showhelp.component.css']
})
export class ShowhelpComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    helptext: string,
    title: string
}, private shelpDialog: MatDialogRef<ShowhelpComponent>) { }

  ngOnInit(): void {
  }
public close(){
  this.shelpDialog.close();
}
}
