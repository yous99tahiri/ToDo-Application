import { Component, OnInit, Input } from '@angular/core';
import { TodoItem } from 'src/app/entities/todo-item';
import { TodoItemList } from 'src/app/entities/todo-item-list';


@Component({
  selector: 'wt2-todo-item-list',
  templateUrl: './todo-item-list.component.html',
  styleUrls: ['./todo-item-list.component.sass']
})
export class TodoItemListComponent implements OnInit {

  @Input()
  public todoItemList: TodoItemList;

  constructor() { }

  ngOnInit(): void {
    this.load()
  }

  load():void {
    //TODO: trigger from html code?
  }

  seeItemDetails(e: Event,item:TodoItem): void {
    e.preventDefault();
  }

  addItem(e: Event): void { 
    e.preventDefault();
  }

  deleteList(e: Event): void { 
    e.preventDefault();
  }

  deleteItem(e: Event,item:TodoItem): void {
    e.preventDefault();
  }

}
