import { Component, OnInit/*, EventEmitter, Output*/ } from '@angular/core';
import { UserAccount, USER_ROLE } from 'src/app/entities/user-account';
import { RegisterService } from '../../services/register.service';

@Component({
  selector: 'wt2-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
  providers: [RegisterService]
})
export class RegisterComponent implements OnInit{

  public newUserAccount: UserAccount = new UserAccount()
  private usernameHelp: string = 'The must have atleast 4 characters. ';
  private passwordHelp: string = 'The password must have atleast 4 characters. ';

  public passwordRepeat: string = '';
  private passwordRepeatHelp: string = 'The repeated password must equal the password.';

  public errorMessage: string = '';
  public successMessage: string = '';
  
  constructor(private registerService: RegisterService) { }

  ngOnInit() {
    console.log("RegisterComponent: created") 
  }

  checkUsername(): boolean {
    return this.newUserAccount.username.length > 3;
  }

  checkPassword(): boolean {
    return this.newUserAccount.password.length > 3;
  }

  checkPasswordRepeat(): boolean {
    return this.passwordRepeat===this.newUserAccount.password;
  }

  formErrorMessage() : string {
    let msg:string = !this.checkUsername() ? this.usernameHelp : '';
    msg = `${msg}${!this.checkPassword() ? this.passwordHelp : ''}`;
    msg = `${msg}${!this.checkPasswordRepeat() ? this.passwordRepeatHelp : ''}`;
    return msg
  }

  canCreateAccount(): boolean {
    this.successMessage = ''
    return this.checkUsername() && this.checkPassword() && this.checkPasswordRepeat();
  }

  public createAccount(e: Event): void { 
    console.log("RegisterComponent: Create Account Button clicked") 
    e.preventDefault();
    if (this.canCreateAccount()) {
      this.newUserAccount.registrationDate = new Date()
      this.registerService.createAccount(this.newUserAccount).subscribe({
        next: () => {
          this.errorMessage = ''
          this.successMessage = 'Account successfully created!'
          this.newUserAccount = new UserAccount();
          this.passwordRepeat = ''
        },
        error: () => this.errorMessage = 'Could not create account: Service Error'
      });
    }
    else{
      this.successMessage = ''
      this.errorMessage = this.formErrorMessage()
    }
  }
}
