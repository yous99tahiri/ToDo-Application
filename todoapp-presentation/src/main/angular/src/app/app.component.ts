import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionAuthService } from './services/session-auth.service';

@Component({
  selector: 'wt2-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {

  authService: SessionAuthService;
  _isLoggedIn:boolean=false;
  errorMessage:string=""
  constructor(private http: HttpClient,authService:SessionAuthService, private router:Router) {
    console.log("AppComponent created")
    this.authService = authService;
  }

  logout() {
    this.authService.getIsLoggedIn().subscribe({
      next: (loggedIn) => {
        if(!loggedIn){
          //TODO errormsg
          this.errorMessage = 'Logout fehlgeschlagen. Nicht eingeloggt'
          return
        }
        this.authService.logout().subscribe( {
          next:()=>{
            this.router.navigate(["/loginc"])
          }
        });
      }
    })
    
  }
}
