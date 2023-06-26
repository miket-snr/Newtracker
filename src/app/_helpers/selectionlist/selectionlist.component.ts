import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'app-selectionlist',
  templateUrl: './selectionlist.component.html',
  styleUrls: ['./selectionlist.component.css']
})
export class SelectionlistComponent implements OnInit {



  isSelected = true;
  onListSelectionChange(ob: MatSelectionListChange) {
     console.log("Selected Item: " + ob.source.selectedOptions.selected.length);
  }
  techList = [
    {id: 101, lang: 'Java'},
    {id: 102, lang: 'Angular'},
    {id: 103, lang: 'Hibernate'}
  ];
  constructor(private formBuilder: FormBuilder) { }
  ngOnInit(): void {
    
  }
  techForm = this.formBuilder.group({
    selectedTech: ''
  });
  onFormSubmit() {
    console.log(this.techForm.get('selectedTech').value);
  }
} 