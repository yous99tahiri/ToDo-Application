import { Component, OnInit } from '@angular/core';
import { TodoItem } from 'src/app/entities/todo-item';

@Component({
  selector: 'wt2-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {

  constructor() { }
  username:string = "abc"
  registrationDate:Date = new Date()
  role:string = "abc"
  todoItems:TodoItem[] = []
  isAdmin:boolean = true
  deleteUsername = ""
  ngOnInit(): void {
    this.load()
  }

  load():void {
    //TODO: trigger from html code?
  }

  seeItemDetails(e: Event,item:TodoItem): void {
    e.preventDefault();
  }

  public deleteUser(e: Event): void { 
    e.preventDefault();
  }
}
