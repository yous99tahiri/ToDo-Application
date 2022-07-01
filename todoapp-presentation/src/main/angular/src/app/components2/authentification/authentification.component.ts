import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageBoxParent } from '../message-box/message-box-parent';

@Component({
  selector: 'wt2-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.sass']
})
export class AuthentificationComponent extends MessageBoxParent{
  loginForm = this.fb.group({
    username: [null, Validators.required],
    password: [null, Validators.required]
  });
  hidePassword:boolean=true;

  canLogin():boolean{
    return true;
  }
  login(): void {
    alert('Thanks!');
  }

  constructor(private fb: FormBuilder) {
    super()
  }
}
