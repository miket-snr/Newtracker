import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchpipe'
})
export class SearchpipePipe implements PipeTransform {
  
    transform(items: any[], args: string[]): any[] {
      if (!items) { return []; }
      if (!args[0]) { return items; }
      args[0] = args[0].toLowerCase();
      const filtarr = args[0].split(' ');
      return items.filter(it => {
        if (args[1] && it[args[1]] !== undefined) {
          for (let x = 0; x < filtarr.length; x++) {
            if (!it[args[1]].toLowerCase().includes(filtarr[x])) {
              return false;
            }
          } return true;
        } else {
          if (args[2] && it[args[2]] !== undefined) {
            if (it[args[2]].toLowerCase().includes(args[0])) {
              return true;
            }
          }
          return false; 
        }
      });
    }
  }