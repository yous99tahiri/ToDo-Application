import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserAccount } from 'src/app/entities/user-account';
import { RegisterService } from 'src/app/services/register.service';
import { MessageBoxParent } from '../message-box/message-box-parent';

@Component({
  selector: 'wt2-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.sass'],
  providers: [RegisterService]
})
export class RegistrationComponent extends MessageBoxParent{
  hidePassword:boolean=true;

  registrationForm = this.fb.group({
    username: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(16)])],
    password: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(16)])],
    passwordRep: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(16)])]
  });
  

  canRegister():boolean{
    return this.registrationForm.valid && this.registrationForm.get("password").value == this.registrationForm.get("passwordRep").value;
  }
  register(): void {
    let account = new UserAccount()
    account.username = this.registrationForm.get("username").value;
    account.password = this.registrationForm.get("password").value;
    this.registerService.createAccount(account).subscribe({
      next:(acc)=>{
        this.showSuccessMessage("Registration succeeded!")
      },
      error:(err)=>{
        this.showDangerMessage(`Registration failed. Error: ${err}`)
      }
    })
  }

  constructor(private fb: FormBuilder,private registerService:RegisterService) {
    super()
    console.log("RegistrationComponent: created")
    console.log("RegistrationComponent: registerService null | undefined?", this.registerService == null || this.registerService == undefined)
  }
}
