import { Component, DoCheck, OnChanges } from '@angular/core';
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
export class AppComponent extends MessageBoxParent implements DoCheck {

  private _isLoggedIn: boolean = false;
  public get isLoggedIn(): boolean {
    this._isLoggedIn = this.authService.loggedIn
    return this._isLoggedIn;
  }

  constructor(private authService:SessionAuthService, 
    private router:Router,
    private breakpointObserver: BreakpointObserver) {
      super()
      console.log("AppComponent: created")
      console.log("AppComponent: authService null | undefined?", this.authService == null || this.authService == undefined)
      console.log("AppComponent: router null | undefined?", this.router == null || this.router == undefined)
  }

  logout() {
    this.authService.getIsLoggedIn().subscribe({
      next: (loggedIn) => {
        if(!loggedIn){
          this._isLoggedIn = false;
          this.showDangerMessage("Logout failed. Not logged in. Illegal State!")
          return
        }
        this.authService.logout().subscribe( {
          next:()=>{
            this._isLoggedIn = false;
            console.log("Logout succeeded. Navigation to /auth")
            this.router.navigate(["/auth"])
          },
          error:(err)=>{
            this.showDangerMessage(`Logout failed. Error: ${err}`)
          }
        });
      }
    })
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
  );

  ngDoCheck():void{
    this.authService.getIsLoggedIn().subscribe({
      next: (loggedIn) => { 
        this._isLoggedIn = loggedIn;
        console.log("AppComponent: ngDoCheck called, _isLoggedIn: ", this._isLoggedIn)
      } 
  })}
}
