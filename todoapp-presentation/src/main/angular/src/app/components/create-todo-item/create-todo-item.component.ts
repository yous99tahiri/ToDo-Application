import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { TodoItem } from 'src/app/entities/todo-item';
import {FormControl} from '@angular/forms';
import { Observable,startWith,map } from 'rxjs';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
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
  public deadLine:string = "";

  public errorMessage = ''; //TODO add error messaging in component
  private itemCreated:boolean = false;
  
  constructor(@Inject(MAT_DIALOG_DATA) data:string,
    private matDialogRef:MatDialogRef<CreateTodoItemComponent>,
    private itemService:ItemService,
    private userService:UserService) {
      console.log("CreateTodoItemComponent: created")
      this.todoItem.listTitle = data;
      this.deadLine = new Date().toISOString().split('T')[0]
   }

  ngOnInit(): void {
    console.log("CreateTodoItemComponent: ngOnInit")
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
    this.todoItem.lastEdited = new Date();
    console.log("CreateTodoItemComponent: value of deadLine: ", this.deadLine)
    this.todoItem.deadLine = new Date(this.deadLine);
    this.itemService.createTodoItem(this.todoItem).subscribe({
      next: () => { 
        this.itemCreated = true; 
        this.ngOnDestroy()
      },
      error: () => { 
        console.error 
        //TODO errormsg
      }
    })
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
