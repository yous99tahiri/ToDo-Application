import { HttpClient } from '@angular/common/http';
import { Component, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { SessionAuthService } from './services/session-auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MessageBoxParent } from './components2/message-box/message-box-parent';
@Component({
  selector: 'wt2-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent extends MessageBoxParent /*implements OnChanges*/ {

  authService: SessionAuthService;
  isLoggedIn:boolean=true;
  errorMessage:string="";

  constructor(
    private http: HttpClient,
    authService:SessionAuthService, 
    private router:Router,
    private breakpointObserver: BreakpointObserver) {
      super()
      console.log("AppComponent created")
    //this.authService = authService;
  }

  logout() {
    this.isLoggedIn = false;
    this.router.navigate(["/auth"])
    /*this.authService.getIsLoggedIn().subscribe({
      next: (loggedIn) => {
        if(!loggedIn){
          //TODO errormsg
          this.errorMessage = 'Logout fehlgeschlagen. Nicht eingeloggt'
          return
        }
        this.authService.logout().subscribe( {
          next:()=>{
            this.router.navigate(["/auth"])
          }
        });
      }
    })*/
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
  );
}
