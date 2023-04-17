import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LoginComponent } from './components/login/login.component';
import { ApidataService } from './_services/apidata.service';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Newtracker';
  subscriptions: Subscription[] = [];
  opened = true;
  showpanel= "0";
  showtext='';
  sectionName = 'home';
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  sapuser = 'Unknown';

  constructor( 
    public apiserv: ApidataService,
    public dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    public authserv: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private activatedroute: ActivatedRoute) { }
  ngOnInit(): void {
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          let str = event['url'];
          let str1 = '';
          if (str) {
            str1 = str.slice(1);
          }
          if (str1) {
            str1 = str1.replace(/\//g, ' ');
            this.sectionName = ' ' + str1.charAt(0).toUpperCase() + str1.slice(1);
            this.sectionName = this.sectionName.split('?')[0];
          } else {
            this.sectionName = 'Home';
          }
         
        }
      });
      this.apiserv.getProgLookups();
    // this.apiserv.getSearchList(); // THis will download Projects and then Absa Requests
    if (this.authserv.currentUserValue.SAPUSER.length < 2) {
      // this.dialog.open(LoginComponent);
      this.router.navigate(['login'])
    }

    this.subscriptions.push(this.authserv.currentUser$.subscribe(user => {
      if (user.SAPUSER.length > 2 || this.authserv.loggedin) {
        this.dialog.closeAll();
        this.sapuser = user.SAPUSER.length > 3 ? user.SAPUSER : user.NAME_FIRST;
        this.apiserv.lclstate.pmanager = (this.authserv.currentUserValue.VERNA?.length > 3 )? this.authserv.currentUserValue.VERNA :'*'
        this.apiserv.lclstate.region = (this.authserv.currentUserValue.REGION?.length > 3 )? this.authserv.currentUserValue.REGION :'*'
      }
    }))
    this.subscriptions.push(
      this.apiserv.currentprojBS.subscribe ( wbs => {
        this.sectionName = 'Project ' + wbs['PROJLINK'];
      }
    ))
    this.subscriptions.push(
      this.apiserv.messages$.subscribe(item => {
        if (item.length > 6) {
          this.openSnackBar(item);
        }
      })
      );
    setTimeout(() => {
      this.opened = false;
    }, 50);
    let temp = this.findGetParameter('r');
    if (temp) {
      this.router.navigate(['/requestedit/' + temp])
    }
  }
  login(){
    this.router.navigate(['login']);
  }
  findGetParameter(parameterName: string) {
    let result = '';
    let tmp = [];
    tmp = location.href.split('?');
    if (tmp && tmp.length > 1) {
      let tempparams = tmp[1].split('&');

      tempparams.forEach((item) => {
        tmp = item.split('=');
        if (tmp[0] === parameterName) {
          result = decodeURIComponent(tmp[1]);
        }
      });
    }
    return result;
  }
  openSnackBar(message: string) {
    let snackbarRef = this.snackBar.open(message, 'Ignore', { duration: 2000 });
  }
  logout() {
    this.authserv.logOut();
    this.router.navigate(['login']);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
  showPanel(index){
    this.showpanel = index
    switch (index) {
      case 0: {
        this.router.navigate(['reqlines'])
        this.showtext = 'Requests not yet registered on SAP'
        break;
      }
      case 1: {
        this.router.navigate(['projlines'])
        this.showtext = 'Projects registered on SAP'
        break;
      }
      case 2: {
        this.router.navigate(['ciplines'])
        this.showtext = 'Ciplines loaded at start of year'
        break;
      }
      case 3: {
        this.router.navigate(['progress'])
        this.showtext = 'Update Project Progress here'
        break;
      }
    }
  }
}
