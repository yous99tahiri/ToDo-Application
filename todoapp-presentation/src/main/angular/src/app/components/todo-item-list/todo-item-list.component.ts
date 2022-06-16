import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TodoItem } from 'src/app/entities/todo-item';
import { TodoItemList } from 'src/app/entities/todo-item-list';
import { MatDialog } from '@angular/material/dialog'; 
import { CreateTodoItemComponent } from '../create-todo-item/create-todo-item.component';
import { TodoItemDetailsComponent } from '../todo-item-details/todo-item-details.component';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'wt2-todo-item-list',
  templateUrl: './todo-item-list.component.html',
  styleUrls: ['./todo-item-list.component.sass']
})
//TODO: display states of items(html), maybe make them updateable 
//make list attributes updateable
export class TodoItemListComponent implements OnInit {

  @Input()
  public todoItemList: TodoItemList;
  
  @Output() listDeletedEvent = new EventEmitter<any>();

  errorMessage:string = ""  //TODO add error messaging in component

  constructor(
    private matDialog:MatDialog,
    private itemService:ItemService) {
    console.log(`TodoItemListComponent '${this.todoItemList.title}': created`)
  }

  ngOnInit(): void {
    console.log(`TodoItemListComponent '${this.todoItemList.title}': ngOnInit`)
  }

  loadListItems():void {
    console.log(`TodoItemListComponent '${this.todoItemList.title}': load list items`)
    this.itemService.readTodoItemList(this.todoItemList.title).subscribe({
      next: (todoItemList) => { 
        this.todoItemList = todoItemList
      },
      error: () => { 
        console.error 
        //TODO errormsg
      }
    });
  }

  seeItemDetails(e: Event,item:TodoItem): void {
    console.log(`TodoItemListComponent '${this.todoItemList.title}': Item Details button clicked`)
    e.preventDefault();
    let dialogRef = this.matDialog.open(TodoItemDetailsComponent, {data : item})
  }

  addItem(e: Event): void {
    console.log(`TodoItemListComponent '${this.todoItemList.title}': Add item button clicked`) 
    e.preventDefault();
    let dialogRef = this.matDialog.open(CreateTodoItemComponent)
    dialogRef.afterClosed().subscribe(
      createdItem => {
        if(!createdItem){
          console.log(`TodoItemList '${this.todoItemList.title}': Create item dialog closed. No item created.`)
          return;
        }
        console.log(`TodoItemList '${this.todoItemList.title}': Create item dialog closed. Item created.`)
        this.loadListItems()
      }
    );
  }

  deleteList(e: Event): void { 
    console.log(`TodoItemList '${this.todoItemList.title}': Delete list button clicked`)
    e.preventDefault();
    this.itemService.deleteTodoItemList(this.todoItemList.title).subscribe({
      next: () => { 
        this.listDeletedEvent.emit()
      },
      error: () => { 
        console.error 
        //TODO errormsg
      }
    })
  }

  deleteItem(e: Event,item:TodoItem): void {
    console.log(`TodoItemList '${this.todoItemList.title}': Delete item button clicked`)
    e.preventDefault();
    this.itemService.deleteTodoItem(this.todoItemList.title,item.title).subscribe({
      next: () => { 
        this.loadListItems()
      },
      error: () => { 
        console.error 
        //TODO errormsg
      }
    })
  }
}
