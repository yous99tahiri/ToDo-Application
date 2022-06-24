import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { TodoItem } from 'src/app/entities/todo-item';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import { ItemService } from 'src/app/services/item.service';
import { UserService } from 'src/app/services/user.service';
import { Observable,startWith,map } from 'rxjs';

@Component({
  selector: 'wt2-todo-item-details',
  templateUrl: './todo-item-details.component.html',
  styleUrls: ['./todo-item-details.component.sass']
})
//TODO: display state of item in html, in a selection drop down menu with ITEM_STATE strings as options, make it updateable, inject itemservice, addmethod to itemservice
//make item attributes updateable
//add error messaging...
export class TodoItemDetailsComponent implements OnInit, OnDestroy {

  myControl: FormControl = new FormControl();
  public usernames:string[] =[] 
  public filteredUsernames: Observable<string[]>
  public errorMessage = ''; //TODO add error messaging in component
  public successMessage = ''; //TODO add error messaging in component
  private itemUpdated:boolean = false;

  public todoItem: TodoItem = new TodoItem();

  constructor( 
    @Inject(MAT_DIALOG_DATA) data:TodoItem,
      private matDialogRef:MatDialogRef<TodoItemDetailsComponent>,
      private itemService:ItemService,
      private userService:UserService) { 
    this.todoItem = data;
    console.log("TodoItemDetailsComponent: created") 
  }

  ngOnInit(): void {
    console.log("TodoItemDetailsComponent: ngOnInit")
    this.userService.readAllUserNames().subscribe({
      next: (usernames) => { 
        this.usernames = usernames; 
        this.usernames.push("None")
        this.filteredUsernames = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(val => this.filter(val))
        );
      },
      error: () => { 
        console.error 
        //TODO errormsg
      }
    })
  }
  ngOnDestroy() :void {
    console.log("TodoItemDetailsComponent: ngOnDestroy")
    this.matDialogRef.close(this.itemUpdated)
  }
  closeDialog(): void{
    this.ngOnDestroy()
  }

  updateTodoItem(e: Event):void{
    e.preventDefault();
    this.errorMessage = ""
    if(!this.canUpdateTodoItem()){
      //TODO errormsg
      this.errorMessage = "Can not create item"
      return
    }
    this.todoItem.lastEdited = new Date()
    
    this.itemService.updateTodoItem(this.todoItem).subscribe({
      next: () => { 
        this.itemUpdated = true; 
        this.successMessage = "Item updated!"
      },
      error: () => { 
        console.error 
        //TODO errormsg
      }
    })
  }

  //TODO improve checks
  canUpdateTodoItem(): boolean {
    return this.todoItem.title && this.todoItem.title.length > 0 && this.todoItem.description && this.todoItem.description.length > 0;;
  }

  filter(val: string): string[] {
    return this.usernames.filter(username =>
      username.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }
}
