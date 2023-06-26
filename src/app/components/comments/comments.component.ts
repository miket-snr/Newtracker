import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApidataService } from 'src/app/_services/apidata.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, OnDestroy {
  @Input() reference = '';
  @Input() level_2 = '';
  @Input() level_3 = '';
  @Output() newcommenttxt = new EventEmitter<string>();
  subs: Subscription;
  listheading = 'Comments for Project';
  newcomment = false;
  username = 'Mike Thomson';
  comments = [ ]
  commentForm = '';
  constructor(private apiserv: ApidataService) { }

  ngOnInit(): void {
    this.apiserv.getCommentList(this.reference,this.level_2,this.level_3);
 this.subs = this.apiserv.commentlist$.subscribe( datain =>{
    this.comments = datain.map(linein => {
      return {
        REFERENCE: linein.REFERENCE,
        LEVEL_2:linein.LEVEL_2,
        LEVEL_3:linein.LEVEL_3,
        DATEOF: linein.DATEOF, 
        COMMENTBY: linein.COMMENTBY,
        COMMENT_TEXT: this.apiserv.xtdatob(linein.COMMENT_TEXT),
        COMMENTNO: linein.COMMENTNO
      }
    })
    this.comments.sort((a,b) => b.COMMENTNO - a.COMMENTNO);
  })
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
addComment() {
this.newcomment = true;
}
cancelComment(){
  this.newcomment = false;
  this.commentForm = '';
}
saveComment(reference = this.reference,level_2 = this.level_2,level_3 = this.level_3){
const nc =  {REFERENCE: reference , 
  LEVEL_2: level_2,
  LEVEL_3: level_3,
  DATEOF: new Date().toLocaleDateString('sv').replace( /\./g, ''),
COMMENTBY: this.username,
COMMENT_TEXT: this.commentForm,COMMENTNO:0}
this.comments.unshift({ ...nc});
this.newcommenttxt.emit(nc.COMMENT_TEXT);
nc.COMMENT_TEXT = this.apiserv.xtdbtoa(nc.COMMENT_TEXT);
this.apiserv.putComment(nc);
this.newcomment = false;
this.commentForm = '';
}
reply(commentnoin){
  
}

}
