import { Component, OnInit, Input } from '@angular/core';
import { TodoItemList } from 'src/app/entities/todo-item-list';


@Component({
  selector: 'wt2-todo-item-list',
  templateUrl: './todo-item-list.component.html',
  styleUrls: ['./todo-item-list.component.sass']
})
export class TodoItemListComponent implements OnInit {

  @Input()
  public todoItemList: TodoItemList = null;

  constructor() { }

  ngOnInit(): void {
  }

}
