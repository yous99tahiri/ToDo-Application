import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wt2-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {

  public username: string = "";
  public password: string = "";
  public passwordRepeat: string = "";
  public errorMessage: string = null;
  
  constructor() { }

  ngOnInit(): void {
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

  formErrorMessage(usernameOk: boolean,passwordOk: boolean,passwordRepeatOk: boolean): string {
    let message = usernameOk ? "" : "Username must have at least 4 characters! ";
    message = `${message}${passwordOk ? "" : "Password must have at least 4 characters! "}`;
    message = `${message}${passwordRepeatOk ? "" : "Repeated password must match password!"}`;
    return message;
  }

  get canCreateAccount(): boolean {
    const usernameOk = this.checkUsername()
    const passwordOk = this.checkPassword()
    const passwordRepeatOk = this.checkPasswordRepeat()
    const canCreate = usernameOk && passwordOk && passwordRepeatOk;
    if(canCreate == false){
      this.errorMessage = this.formErrorMessage(usernameOk,passwordOk,passwordRepeatOk)
    }
    return canCreate;
  }

  public createAccount(): void { console.log("Implement me. See 'create-news.component.ts' for example...")}
}
