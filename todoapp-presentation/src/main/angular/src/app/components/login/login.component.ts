import { Component } from '@angular/core';
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

  constructor(authService:SessionAuthService){
    console.log("LoginComponent: created")
    this.authService = authService;
  }

  login(e: Event) {
    console.log("LoginComponent: Login Button clicked")
    e.preventDefault();
    this.errorMessage = '';
    if (this.canLogin) {
      this.authService.login(this.userAccount).subscribe({
        error: () => this.errorMessage = 'Failed to login'
      });
    }
  }

  get canLogin(): boolean {
    return this.userAccount.username.trim() !== '' && this.userAccount.password.trim() !== '';
  }
}
