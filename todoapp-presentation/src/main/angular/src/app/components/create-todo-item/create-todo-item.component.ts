import { Component, OnInit } from '@angular/core';
import { TodoItem } from 'src/app/entities/todo-item';

@Component({
  selector: 'wt2-create-todo-item',
  templateUrl: './create-todo-item.component.html',
  styleUrls: ['./create-todo-item.component.sass']
})
export class CreateTodoItemComponent implements OnInit {

  public todoItem: TodoItem = new TodoItem();

  constructor() { }

  ngOnInit(): void {
  }

}
