import { Component, OnInit } from '@angular/core';
import { TodoItemList } from 'src/app/entities/todo-item-list';

@Component({
  selector: 'wt2-create-todo-item-list',
  templateUrl: './create-todo-item-list.component.html',
  styleUrls: ['./create-todo-item-list.component.sass']
})
export class CreateTodoItemListComponent implements OnInit {

  public todoItemList: TodoItemList = new TodoItemList();

  constructor() { }

  ngOnInit(): void {
  }

  public createTodoItemList(e: Event): void { 
    e.preventDefault();
    this.todoItemList.lastEdited = new Date()
    //TODO...
  }

  canCreateTodoItemList(): boolean {
    return true;
  }

}
