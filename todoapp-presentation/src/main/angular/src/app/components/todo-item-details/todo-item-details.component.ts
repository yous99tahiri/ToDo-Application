import { Component, OnInit, Inject } from '@angular/core';
import { TodoItem } from 'src/app/entities/todo-item';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'wt2-todo-item-details',
  templateUrl: './todo-item-details.component.html',
  styleUrls: ['./todo-item-details.component.sass']
})
//TODO: display state of item in html, in a selection drop down menu with ITEM_STATE strings as options, make it updateable, inject itemservice, addmethod to itemservice
//make item attributes updateable
//add error messaging...
export class TodoItemDetailsComponent implements OnInit {

  public todoItem: TodoItem = new TodoItem();

  constructor( 
    @Inject(MAT_DIALOG_DATA) data:TodoItem,
      private matDialogRef:MatDialogRef<TodoItemDetailsComponent>) { 
    this.todoItem = data;
    console.log("TodoItemDetailsComponent: created") 
  }

  ngOnInit(): void {
    console.log("TodoItemDetailsComponent: ngOnInit")
  }

  closeDialog(): void{
    this.matDialogRef.close()
  }
}
