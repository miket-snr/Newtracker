import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import { ActiveCommentInterface } from '../../types/activeComment.interface';
import { CommentInterface } from '../../types/comment.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'comments',
  templateUrl: './comments.component.html',
})
export class CommentsComponent implements OnInit, OnDestroy {
  @Input() currentUserId!: string;
  @Input() username: string = 'Unknown';
  @Input() reference!: string;
  @Input() commentArea!: string ;
  @Input() apikey!: string;

  comments: CommentInterface[] = [];
  activeComment: ActiveCommentInterface | null = null;
  subs = new Subscription();
  constructor(private commentsService: CommentsService) {}

  ngOnInit(): void {
    let lsub =   this.commentsService.getComments({APIKEY:this.apikey, REFERENCE: this.reference,COMMENT_AREA:this.commentArea}).subscribe((comments) => {
      this.comments = comments;

    });
    this.subs.add(lsub);
  }
ngOnDestroy(): void {
  this.subs.unsubscribe();
}
  getRootComments(): CommentInterface[] {
    return this.comments.filter((comment) => comment.parentId == '0' );
  }

  updateComment({
    text,
    commentId,
  }: {
    text: string;
    commentId: string;
  }): void {
    this.commentsService
      .updateComment(commentId, text)
      .subscribe((updatedComment) => {
        this.comments = this.comments.map((comment) => {
          if (comment.id === commentId) {
            return updatedComment;
          }
          return comment;
        });

        this.activeComment = null;
      });
  }

  deleteComment(commentId: string): void {
    this.commentsService.deleteComment(commentId).subscribe(() => {
      this.comments = this.comments.filter(
        (comment) => comment.id !== commentId
      );
    });
  }

  setActiveComment(activeComment: ActiveCommentInterface | null): void {
    this.activeComment = activeComment;
  }

  addComment({
    text,
    parentId,
  }: {
    text: string;
    parentId: string ;
  }): void {
    this.commentsService
      .createComment(this.apikey, this.reference, this.commentArea, text, parentId)
      .subscribe((createdComment) => {
        this.comments = [...this.comments, createdComment];
        this.activeComment = null;
      });
  }

  getReplies(commentId: string): CommentInterface[] {
    return this.comments
      .filter((comment) => comment.parentId === commentId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  }
}
