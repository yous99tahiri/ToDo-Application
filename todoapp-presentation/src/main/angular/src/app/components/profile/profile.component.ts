import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wt2-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {

  constructor() { }
  username:string = "abc"
  registrationDate:string = "abc"
  ngOnInit(): void {
  }

}
