import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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

  password=null;
  registrationForm = this.fb.group({
    username: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(16)])],
    password: [this.password, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(16)])],
    passwordRep: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(16), Validators.pattern(this.password)])]
  });
  

  canRegister():boolean{
    return true;
  }
  register(): void {
    alert('Thanks!');
  }

  constructor(private fb: FormBuilder,private registerService:RegisterService) {
    super()
    console.log("RegistrationComponent: created")
    console.log("RegistrationComponent: registerService null | undefined?", this.registerService == null || this.registerService == undefined)
  }
}
