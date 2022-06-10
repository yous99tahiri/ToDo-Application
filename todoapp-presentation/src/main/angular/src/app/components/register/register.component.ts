import { Component, OnInit/*, EventEmitter, Output*/ } from '@angular/core';
import { RegisterService } from '../../services/register.service';

@Component({
  selector: 'wt2-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
  providers: [RegisterService]
})
export class RegisterComponent implements OnInit{

  //@Output()
  //public created = new EventEmitter();

  public username: string = '';
  private usernameHelp: string = 'The username must have atleast 4 characters. ';
  public password: string = '';
  private passwordHelp: string = 'The password must have atleast 4 characters. ';
  public passwordRepeat: string = '';
  private passwordRepeatHelp: string = 'The repeated password must equal the password.';
  public errorMessage: string = '';
  public successMessage: string = '';
  
  constructor(private registerService: RegisterService) { }

  ngOnInit() {
  }

  checkUsername(): boolean {
    return this.username.length > 3;
  }

  checkPassword(): boolean {
    return this.password.length > 3;
  }

  checkPasswordRepeat(): boolean {
    return this.passwordRepeat===this.password;
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
    e.preventDefault();
    if (this.canCreateAccount()) {
      this.registerService.create(this.username, this.password).subscribe({
        next: () => {
          //this.created.emit();
          this.errorMessage = ''
          this.successMessage = 'Account successfully created!'
          this.username = '';
          this.password = '';
          this.passwordRepeat = ''
        },
        error: () => this.errorMessage = 'Could not create account'
      });
    }
    else{
      this.successMessage = ''
      this.errorMessage = this.formErrorMessage()
    }
  }
}
