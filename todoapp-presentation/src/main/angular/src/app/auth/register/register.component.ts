import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { RegisterService } from '../register.service';

@Component({
  selector: 'wt2-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
  providers: [RegisterService]
})
export class RegisterComponent implements OnInit{

  @Output()
  public created = new EventEmitter();

  public username: string = "MyUsername";
  public password: string = "MyPassword$$$$";
  public passwordRepeat: string = "MyPassword$$$$";
  public errorMessage: string = '';
  
  constructor(private registerService: RegisterService) { }

  ngOnInit() {
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
    return this.checkUsername() && this.checkPassword() && this.checkPasswordRepeat();
  }

  public createAccount(e: Event): void { 
    e.preventDefault();
    this.errorMessage = '';

    if (this.checkUsername() && this.checkPassword() &&this.checkPasswordRepeat()) {
      this.registerService.create(this.username, this.password).subscribe({
        next: () => {
          this.created.emit();
          this.username = 'MyUsername';
          this.password = 'MyPassword$$$$';
          this.passwordRepeat = 'MyPassword$$$$'
        },
        error: () => this.errorMessage = 'Could not create account'
      });
    }
  }
}
