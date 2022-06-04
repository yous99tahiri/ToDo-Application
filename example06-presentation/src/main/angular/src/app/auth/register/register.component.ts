import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wt2-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {

  public username: string = "MyUsername";
  public password: string = "MyPassword$$$$";
  public passwordRepeat: string = "MyPassword$$$$";
  public errorMessage: string = null;
  
  constructor() { }

  ngOnInit(): void {
  }

  checkUsername(): boolean {
    const usernameOk = this.username.length > 3;
    if(!usernameOk){
      this.errorMessage="Username must have at least 4 characters."
    }
    return usernameOk;
  }

  checkPassword(): boolean {
    const pwdOk = this.password.length > 3;
    if(!pwdOk){
      this.errorMessage="Password must have at least 4 characters."
    }
    return pwdOk;
  }

  checkPasswordRepeat(): boolean {
    const pwdRepOk = this.passwordRepeat===this.password;
    if(!pwdRepOk){
      this.errorMessage="Repeated password must equal given password."
    }
    return pwdRepOk;
  }

  get canCreateAccount(): boolean {
    return this.checkUsername() && this.checkPassword() &&this.checkPasswordRepeat();
  }

  public createAccount(): void { 
    console.log("Implement me. See 'create-news.component.ts' for example...")
  }
}
