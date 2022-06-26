import { Component, OnDestroy, OnInit } from '@angular/core';
import { TodoItemList } from 'src/app/entities/todo-item-list';
import { MatDialogRef } from '@angular/material/dialog';
import { ItemService } from 'src/app/services/item.service';
@Component({
  selector: 'wt2-create-todo-item-list',
  templateUrl: './create-todo-item-list.component.html',
  styleUrls: ['./create-todo-item-list.component.sass']
})
//TODO use textfield html object for descirption field!
export class CreateTodoItemListComponent implements OnInit {

  public todoItemList: TodoItemList = new TodoItemList();
  public deadLine:string = "";
  public errorMessage:string = '';  //TODO add error messaging in component
  private listCreated:boolean = false;
  
  constructor(
    private matDialogRef:MatDialogRef<CreateTodoItemListComponent>,
    private itemService:ItemService) {
    console.log("CreateTodoItemListComponent: created")
    this.deadLine = new Date().toISOString().split('T')[0]
  }

  ngOnInit(): void {
    console.log("CreateTodoItemListComponent: ngOnInit")
  }

  public createTodoItemList(e: Event): void { 
    console.log("CreateTodoItemListComponent: Create List Button clicked")
    e.preventDefault();
    this.errorMessage = ""
    if(!this.canCreateTodoItemList()){
      //TODO errormsg
      this.errorMessage = "Could not create list."
      return
    }
    this.todoItemList.lastEdited = new Date()
    this.todoItemList.deadLine = new Date(this.deadLine);
    this.itemService.createTodoItemList(this.todoItemList).subscribe({
      next: () => { 
        this.listCreated = true;
        this.closeDialog()
      },
      error: (err) => { 
        this.errorMessage = `Could not create list: ${err}`
      }
    })
  }

  //TODO: improve checks
  canCreateTodoItemList(): boolean {
    return this.todoItemList.title && this.todoItemList.title.length > 0 && this.todoItemList.description && this.todoItemList.description.length > 0;
  }

  closeDialog(): void{
    this.matDialogRef.close(this.listCreated)
  }
}
