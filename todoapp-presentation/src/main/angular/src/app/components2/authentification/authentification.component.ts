import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAccount } from 'src/app/entities/user-account';
import { SessionAuthService } from 'src/app/services/session-auth.service';
import { MessageBoxParent } from '../message-box/message-box-parent';

@Component({
  selector: 'wt2-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.sass']
})
export class AuthentificationComponent extends MessageBoxParent{
  loginForm = this.fb.group({
    username: [null, Validators.required],
    password: [null, Validators.required]
  });
  hidePassword:boolean=true;

  canLogin():boolean{
    return this.loginForm.valid
  }
  login(): void {
    this.authService.getIsLoggedIn().subscribe({
      next: (loggedIn) => {
        if(loggedIn){
          this.showDangerMessage("Login failed. Already logged in. Illegal State!")
          return
        }
        let acc = new UserAccount()
        acc.username = this.loginForm.get("username").value
        acc.password = this.loginForm.get("password").value
        this.authService.login(acc).subscribe( {
          next:()=>{
            console.log("Login succeeded. Navigation to /dashboard")
            this.router.navigate(["/dashboard"])
          },
          error:(err)=>{
            this.showDangerMessage(`Login failed.`)
            console.log("Login failed: ", JSON.stringify(err))
          }
        });
      }
    })
  }

  constructor(private fb: FormBuilder,private router:Router,private authService:SessionAuthService) {
    super()
    console.log("AuthentificationComponent: crreated")
    console.log("AuthentificationComponent: authService null | undefined?", this.authService == null || this.authService == undefined)
  }
}
