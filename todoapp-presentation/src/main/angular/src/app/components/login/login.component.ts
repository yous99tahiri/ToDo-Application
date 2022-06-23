import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserAccount } from 'src/app/entities/user-account';
import { SessionAuthService } from 'src/app/services/session-auth.service';
@Component({
  selector: 'wt2-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {

  private authService: SessionAuthService;

  userAccount: UserAccount = new UserAccount()
  public errorMessage: string = '';

  constructor(authService:SessionAuthService,
    private router:Router){
    console.log("LoginComponent: created")
    this.authService = authService;
  }

  login(e: Event) {
    console.log("LoginComponent: Login Button clicked")
    e.preventDefault();
    this.errorMessage = '';
    if (this.canLogin) {
      this.authService.login(this.userAccount).subscribe({
        next : () => { 
          this.router.navigate(["/dashboard"]);
        },
        error: () => {
          console.error
          this.errorMessage = 'Failed to login'
      }
      });
    }
  }

  get canLogin(): boolean {
    return this.userAccount.username.trim() !== '' && this.userAccount.password.trim() !== '';
  }
}
