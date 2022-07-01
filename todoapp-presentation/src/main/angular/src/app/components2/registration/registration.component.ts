import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageBoxParent } from '../message-box/message-box-parent';

@Component({
  selector: 'wt2-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.sass']
})
export class RegistrationComponent extends MessageBoxParent{
  hidePassword:boolean=true;

  registrationForm = this.fb.group({
    username: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(16)])],
    password: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(16)])],
    passwordRep: [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(16)])]
  });

  canRegister():boolean{
    return true;
  }
  register(): void {
    alert('Thanks!');
  }

  constructor(private fb: FormBuilder) {
    super()
  }
}
