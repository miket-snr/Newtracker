import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-relink',
  templateUrl: './relink.component.html',
  styleUrls: ['./relink.component.css']
})
export class RelinkComponent implements OnInit {
rlink = '';
  constructor(private route:ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.rlink = this.route.snapshot.paramMap.get('newpath');
    this.rlink = this.rlink.replace('~','/');
    this.router.navigate(['/'+this.rlink]);

  }

}