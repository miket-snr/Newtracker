import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.method === 'POST' && request.body.chContext.CLASS !== "USER") {
      // allow the generic token when calling USER class
   let mytoken = JSON.parse(localStorage.getItem('BFMUser')).TOKEN
   let mynewcontext = {... request.body.chContext}
   mynewcontext.TOKEN = mytoken;
  let alteredtoken = {chContext:mynewcontext}
      request = request.clone({ 
        body: {...request.body , ...alteredtoken}});


      return next.handle(request);
    } else {
      return next.handle(request);
    }
  }
}
