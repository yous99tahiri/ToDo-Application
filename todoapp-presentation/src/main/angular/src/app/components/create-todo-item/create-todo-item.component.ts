import { Component, OnDestroy, OnInit } from '@angular/core';
import { TodoItem } from 'src/app/entities/todo-item';
import {FormControl} from '@angular/forms';
import { Observable,startWith,map } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { ItemService } from 'src/app/services/item.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'wt2-create-todo-item',
  templateUrl: './create-todo-item.component.html',
  styleUrls: ['./create-todo-item.component.sass']
})
//TODO use textfield html object for descirption field!
export class CreateTodoItemComponent implements OnInit,OnDestroy {

  myControl: FormControl = new FormControl();
  public usernames:string[] =[] 
  public filteredUsernames: Observable<string[]>;

  public todoItem: TodoItem = new TodoItem();
  public errorMessage = ''; //TODO add error messaging in component
  private itemCreated:boolean = false;
  
  constructor(
    private matDialogRef:MatDialogRef<CreateTodoItemComponent>,
    private itemService:ItemService,
    private userService:UserService) {
      console.log("CreateTodoItemComponent: created")
   }

  ngOnInit(): void {
    console.log("CreateTodoItemComponent: ngOnInit")
    this.filteredUsernames = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val))
      );
      
      this.userService.readAllUserNames().subscribe({
        next: (usernames) => { 
          this.usernames = usernames; 
        },
        error: () => { 
          console.error 
          //TODO errormsg
        }
      })
      this.usernames.push("None")
  }

  ngOnDestroy() :void {
    console.log("CreateTodoItemComponent: ngOnDestroy")
    this.matDialogRef.close(this.itemCreated)
  }

  public createTodoItem(e: Event): void { 
    console.log("CreateTodoItemComponent: Create item button clicked")
    e.preventDefault();
    this.errorMessage = ""
    if(!this.canCreateTodoItem()){
      //TODO errormsg
      this.errorMessage = "Can not create item"
      return
    }
    this.todoItem.creator = this.itemService.authService.getUsername();
    this.todoItem.lastEdited = new Date()
    
    this.itemService.createTodoItem(this.todoItem).subscribe({
      next: () => { 
        this.itemCreated = true; 
      },
      error: () => { 
        console.error 
        //TODO errormsg
      }
    })
    if(!this.itemCreated) {
      return;
    }
    this.ngOnDestroy()
  }

  //TODO improve checks
  canCreateTodoItem(): boolean {
    return this.todoItem.title && this.todoItem.title.length > 0 && this.todoItem.description && this.todoItem.description.length > 0;;
  }

  filter(val: string): string[] {
    return this.usernames.filter(username =>
      username.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  closeDialog(): void{
    this.ngOnDestroy()
  }
}
