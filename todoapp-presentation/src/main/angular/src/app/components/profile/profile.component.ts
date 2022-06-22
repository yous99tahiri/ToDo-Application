import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TodoItem } from 'src/app/entities/todo-item';
import { TodoItemDetailsComponent } from '../todo-item-details/todo-item-details.component';
import {FormControl} from '@angular/forms';
import { Observable,startWith,map } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { UserAccount, USER_ROLE } from 'src/app/entities/user-account';

@Component({
  selector: 'wt2-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {

  myControl: FormControl = new FormControl();
  itemsAreaErrorMessage:string = ""; //TODO add error messaging in component
  adminAreaErrorMessage:string = ""; //TODO add error messaging in component
  userAreaErrorMessage:string = ""; //TODO add error messaging in component
  constructor( 
    private matDialog:MatDialog,
    private userService:UserService ) {
    console.log("ProfileComponent: created")
  }

  public usernames:string[] =[] //TODO data-model for autocomplete
  public filteredUsernames: Observable<string[]>;
  public todoItems:TodoItem[] = []
  public deleteUsername = ""

  userAccount: UserAccount = new UserAccount()

  ngOnInit(): void {
    console.log("ProfileComponent: ngOnInit")
    this.loadUserAccount()
    this.loadAssignedItems()
    this.loadUsernames()
    this.filteredUsernames = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val))
    );
  }

  loadUserAccount():void {
    console.log("ProfileComponent: loadUserAccount")
    this.userService.readUserAccount(this.userService.authService.getUsername()).subscribe({
      next: (userAccount) => { 
        this.userAccount = userAccount; 
      },
      error: () => { 
        console.error 
      }
    })
  }

  loadUsernames():void {
    console.log("ProfileComponent: load usernames")
    if(this.isAdmin == false){
      //no errormsg necessary, this is just to be more secure, Admin Area should not be rendered, if user is not admin
      return;
    }
    this.userService.readAllUserNames().subscribe({
      next: (usernames) => { 
        this.usernames = usernames; 
      },
      error: () => { 
        console.error 
        //TODO errormsg admin area
      }
    })

  }

  loadAssignedItems():void {
    console.log("ProfileComponent: load assigned items")
    this.userService.readUserAssignedTodoItems(this.userService.authService.getUsername()).subscribe({
      next: (todoItems) => { 
        this.todoItems = todoItems; 
      },
      error: () => { 
        console.error 
        //TODO errormsg item area
      }
    })
  }

  seeItemDetails(e: Event,item:TodoItem): void {
    console.log("ProfileComponent: Item Details Button clicked")
    e.preventDefault();
    this.matDialog.open(TodoItemDetailsComponent, {data : item}) 
  }

  public deleteUser(e: Event): void {
    console.log("ProfileComponent: Delete User Button clicked") 
    e.preventDefault();
    if(this.isAdmin == false){
      //no errormsg necessary, this is just to be more secure, Admin Area should not be rendered, if user is not admin
      //NOTE: to enhance security we can also require the password for deletion
      return;
    }
    if(this.userAccount.username == this.deleteUsername){
      //TODO errormsg admin area "nice try but you can not delete yourself"

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //Wie genau bau ich an so einer Stelle hier eine Error-Message? Kannst mir da einmal nen Beispiel geben? Dann krieg ich das denke ich für den Rest hin
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      return
    }
    //we could check if the deleteUsername is in the list of usernames, but we can also skip that, lets make use of status codes :D
    this.userService.deleteUserAccount(this.deleteUsername).subscribe({
      next: () => { 
        this.loadUsernames()
      },
      error: () => { 
        console.error 
        //TODO errormsg admin area
      }
    }) 
  }

  filter(val: string): string[] {
    console.log("ProfileComponent: Filtering usernames") 
    return this.usernames.filter(username =>
      username.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  get isAdmin (){
    return this.userAccount.role === USER_ROLE.ADMIN;
  }
}
