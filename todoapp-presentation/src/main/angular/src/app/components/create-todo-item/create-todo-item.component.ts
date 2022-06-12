import { Component, OnInit } from '@angular/core';
import { TodoItem } from 'src/app/entities/todo-item';

@Component({
  selector: 'wt2-create-todo-item',
  templateUrl: './create-todo-item.component.html',
  styleUrls: ['./create-todo-item.component.sass']
})
export class CreateTodoItemComponent implements OnInit {

  public todoItem: TodoItem = new TodoItem();
  public usernames: string = ""
  constructor() { }

  ngOnInit(): void {
  }

  public createTodoItem(e: Event): void { 
    e.preventDefault();
    this.todoItem.creator = "TODO get name of actual user"
    this.todoItem.lastEdited = new Date()
    this.todoItem.assignees = this.usernames.split(",").map(name => { return name.trim()}) // => besser ein selection-model anhand der usrnamen aus der db
    //TODO...
  }

  canCreateTodoItem(): boolean {
    return true;
  }
}
