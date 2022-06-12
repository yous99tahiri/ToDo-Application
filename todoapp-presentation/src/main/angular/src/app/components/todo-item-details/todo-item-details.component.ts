import { Component, OnInit, Input } from '@angular/core';
import { TodoItem } from 'src/app/entities/todo-item';

@Component({
  selector: 'wt2-todo-item-details',
  templateUrl: './todo-item-details.component.html',
  styleUrls: ['./todo-item-details.component.sass']
})
export class TodoItemDetailsComponent implements OnInit {

  @Input()
  public todoItem: TodoItem;

  constructor() { }

  ngOnInit(): void {
  }

}
