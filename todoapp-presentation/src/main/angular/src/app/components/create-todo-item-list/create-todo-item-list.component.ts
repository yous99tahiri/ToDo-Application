import { Component, OnInit } from '@angular/core';
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
  public errorMessage:string = '';  //TODO add error messaging in component
  private listCreated:boolean = false;
  
  constructor(
    private matDialogRef:MatDialogRef<CreateTodoItemListComponent>,
    private itemService:ItemService) {
    console.log("CreateTodoItemListComponent: created")
  }

  ngOnInit(): void {
    console.log("CreateTodoItemListComponent: ngOnInit")
  }
  ngOnDestroy() :void {
    console.log("CreateTodoItemListComponent: ngOnDestroy")
    this.matDialogRef.close(this.listCreated)
  }

  public createTodoItemList(e: Event): void { 
    console.log("CreateTodoItemListComponent: Create List Button clicked")
    e.preventDefault();
    this.errorMessage = ""
    if(!this.canCreateTodoItemList()){
      //TODO errormsg
      this.errorMessage = "Can not create list"
      return
    }
    this.todoItemList.creator = this.itemService.authService.getUsername()
    this.todoItemList.lastEdited = new Date()
    this.itemService.createTodoItemList(this.todoItemList).subscribe({
      next: () => { 
        this.listCreated = true; 
      },
      error: () => { 
        console.error 
        //TODO errormsg
      }
    })
    if(!this.listCreated) {
      return;
    }
    this.ngOnDestroy()
  }

  //TODO: improve checks
  canCreateTodoItemList(): boolean {
    return this.todoItemList.title && this.todoItemList.title.length > 0 && this.todoItemList.description && this.todoItemList.description.length > 0;
  }

  closeDialog(): void{
    this.ngOnDestroy()
  }
}
