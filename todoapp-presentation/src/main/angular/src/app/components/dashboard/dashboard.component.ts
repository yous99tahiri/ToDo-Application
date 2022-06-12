import { Component, OnInit } from '@angular/core';
import { TodoItemList } from 'src/app/entities/todo-item-list';

@Component({
  selector: 'wt2-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  public todoItemLists: TodoItemList[] = []
  constructor() { }

  ngOnInit(): void {
    this.load()
  }

  load():void {
    //TODO: trigger from html code?
  }
  
  addList(e: Event): void {
    e.preventDefault();
  }

  

}
