import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CommentInterface } from '../types/comment.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class CommentsService {
  loading: boolean = false;
  loadingBS: any;
  http: any;
  messagesBS: any;
  constructor(private httpClient: HttpClient) {}

  // getComments(): Observable<CommentInterface[]> {
  //   return this.httpClient.get<CommentInterface[]>(
  //     'http://localhost:3000/comments'
  //   );
  // }
  getComments(filter:any): Observable<CommentInterface[]> {
    // return this.httpClient.get<CommentInterface[]>(
    //   'http://localhost:3000/comments'
    // );
  let  commentListBS = new BehaviorSubject<CommentInterface[]>([]);
  let commentList$ = commentListBS.asObservable();
   
   this.PostGen(filter,"GET_COMMENT","COMMENTS").subscribe((data) => {
    let outarray: any[] = [];
    data.forEach((temp: any) => {
    let out = {id:('00'+temp['ID'].toLocaleString()).slice(-3) ,body: this.xtdatob(temp.COMMENT_TEXT), username:temp.DISPLAYNAME , 
    parentId:temp.PARENT_ID == 0? '0': ('00'+temp['PARENT_ID'].toLocaleString()).slice(-3), createdAt: temp.DATEOF , userId:temp.COMMENTBY}
   outarray.push(out);
    });
     
    commentListBS.next(outarray);
  })
  return commentList$;
}
    PostGen(lclobj: any, methodname: string, classname: string = 'COMMENTS'): Observable<any> {
      this.loading = true;
     // this.loadingBS.next(true);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        token: JSON.parse(localStorage.getItem('BFMUser')).TOKEN,
      })
    };
    const call2 = {
      context: {
        CLASS: classname,
        TOKEN: JSON.parse(localStorage.getItem('BFMUser')).TOKEN,
        METHOD: methodname
      },
      data: lclobj

    };
    let mypost = this.httpClient.post<any>('https://io.bidvestfm.co.za/BIDVESTFM_API_ZRFC3/request?sys=prod',
    call2, httpOptions);
    return  mypost.pipe(
      map(data => {
        return JSON.parse(data['RESULT']);
      
        // this.loading = false;
        // this.loadingBS.next(false);
        // try {
        //   let represult = (data && data['d'] && data['d'].exResult) ? JSON.parse(JSON.parse(data['d'].exResult.replace(/[^\x00-\x7F]/g,""))) : data
        //   if (!represult || !represult.RESULT) {
        //     throw 'Error unknown '
        //   } else {
        //      if ( represult.RESULT.toUpperCase().includes('ERROR')) {
        //        this.messagesBS.next(represult.RESULT);
        //       }        
        //     return represult.RESULT;
        //   }
        // } catch (e) {
        //   this.messagesBS.next('Bad Json Reply');
        //   // console.log(JSON.parse(data['d'].exResult.replace(/[^\x00-\x7F]/g,"")))
        //   throw 'Bad Json reply'
        // }

      }),take(1)
    )
  }
  createComment(
    apikey: string,reference: string, comment_area: string, 
    text: string,
    parentId: string | null = null, userid = 'Anonymous'
  ): Observable<CommentInterface> {

  let  commentBS = new BehaviorSubject<CommentInterface>({id:'',body:'',username:'',parentId:'',createdAt:'',userId:''});
  let comment$ = commentBS.asObservable();
  let lclobj = {id:0,COMMENT_TEXT:this.xtdbtoa(text),APIKEY: apikey, REFERENCE:reference,COMMENT_AREA:comment_area,
    PARENT_ID:parentId == null? 0: parseInt(parentId.toLocaleString())}
   this.PostGen(lclobj,"PUT_COMMENT","COMMENTS").subscribe((data) => {

    let temp = data
    let out = {id:temp['id'].toLocaleString() ,body: this.xtdatob(temp.comment_text) , username:temp.displayname , 
    parentId:temp.parent_id == 0? '0': temp.parent_id.toLocaleString(), createdAt: temp.dateof , userId:temp.commentby}
    commentBS.next(out);
  })
  return comment$;
    //   return this.httpClient.post<CommentInterface>(
    //   'http://localhost:3000/comments',
    //   {
    //     body: this.xtdbtoa(text),
    //    ,
    //     // Should not be set here
    //     createdAt: new Date().toISOString(),
    //     userId: '1',
    //     username: 'John',
    //   }
    // );
  }

  updateComment(id: string, text: string): Observable<CommentInterface> {
    return this.httpClient.patch<CommentInterface>(
      `http://localhost:3000/comments/${id}`,
      {
        body: text,
      }
    );
  }

  deleteComment(id: string): Observable<{}> {
    return this.httpClient.delete(`http://localhost:3000/comments/${id}`);
  }
  xtdbtoa(instring: string) {
    if (instring){
    try {
      return btoa(encodeURIComponent(instring))
    } catch (err) {
      this.messagesBS.next('Conversion Failed')
    }
    return '';
  } else {
    return '';
  }
  }

  xtdatob(instring: string) {
    if (instring) {
    try {
      return atob(decodeURIComponent(instring))
    } catch (err) {
      this.messagesBS.next('Conversion Failed')
    }
    return '';
  } else {
    return '';
  }
  }
}
