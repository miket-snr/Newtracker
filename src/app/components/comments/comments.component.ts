import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApidataService } from 'src/app/_services/apidata.service';
import { AuthService } from 'src/app/_services/auth.service';

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
  newcommentreply = -1;
  username = this.authserv.currentUserValue.EMAIL;
  comments = [ ]
  commentForm = '';
  commentDelegate = '';
  commentreplyForm = '';
  constructor(private apiserv: ApidataService, private authserv:AuthService) { }

  ngOnInit(): void {
    this.apiserv.getCommentList(this.reference,this.level_2,this.level_3);
 this.subs = this.apiserv.commentlist$.subscribe( datain =>{
  let rootcomments = [];
  let childcomments = [];  
  let basecomments = datain.map(linein => {
      return {
        REFERENCE: linein.REFERENCE,
        LEVEL_2:linein.LEVEL_2,
        LEVEL_3:linein.LEVEL_3,
        DATEOF: linein.DATEOF, 
        COMMENTBY: linein.COMMENTBY,
        COMMENT_TEXT: this.apiserv.xtdatob(linein.COMMENT_TEXT),
        COMMENTNO: linein.COMMENTNO,
        REPLYTO: linein.REPLYTO,
        REPLIES: []
      }
    })
    basecomments.forEach(linein => {
      if (linein.REPLYTO != 0) {
       childcomments.push(linein);
      } else {
        rootcomments.push(linein);
      }
      
    })
    this.nestComments(rootcomments, childcomments);
    this.comments = rootcomments;
    this.comments.sort((a,b) => b.COMMENTNO - a.COMMENTNO);
  })
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  nestComments(rootcomments, childcomments) {

  childcomments.forEach(childcomment => {
    rootcomments.forEach(rootcomment => {
      if (childcomment.REPLYTO === rootcomment.COMMENTNO) {
        rootcomment.REPLIES.push(childcomment);
      }
    })
  })
}

addComment() {
this.newcomment = true;
}
cancelComment(){
  this.newcomment = false;
  this.commentForm = '';
}
saveComment(reference = this.reference,level_2 = this.level_2,level_3 = this.level_3){
  if (this.commentDelegate.length > 0 ){
    this.commentForm = this.commentForm + "  Sent to: " + this.commentDelegate;
  }
const nc =  {REFERENCE: reference , 
  LEVEL_2: level_2,
  LEVEL_3: level_3,
  DATEOF: new Date().toLocaleDateString('sv').replace( /\./g, ''),
COMMENTBY: this.username,
COMMENT_TEXT: (this.commentForm.length > 5)?this.commentForm : this.commentreplyForm,COMMENTNO:0
, REPLYTO: this.newcommentreply < 0 ? 0 : this.newcommentreply,}
if (this.newcommentreply > 0) {
  let idx = this.comments.findIndex(linein => linein.COMMENTNO === this.newcommentreply);
  this.comments[idx].REPLIES.unshift({ ...nc});
} else {
this.comments.unshift({ ...nc});
}
//this.newcommenttxt.emit(nc.COMMENT_TEXT);
nc.COMMENT_TEXT = this.apiserv.xtdbtoa(nc.COMMENT_TEXT);
this.apiserv.putComment(nc);
this.newcomment = false;
this.commentForm = '';
this.newcommentreply = -1;
this.commentreplyForm = '';
this.commentDelegate = '';
}
reply(commentnoin){
  this.newcommentreply = commentnoin;
}
cancelReply(){
  this.newcommentreply = -1;
  this.commentreplyForm = '';
}
saveReply(reference = this.reference,level_2 = this.level_2,level_3 = this.level_3){
  this.saveComment(reference,level_2,level_3);
}
sendEmail(){
  let emailtxt = '';
 
}
}
