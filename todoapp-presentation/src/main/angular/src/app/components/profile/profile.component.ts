import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ITEM_STATE, TodoItem } from 'src/app/entities/todo-item';
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

    this.userService.readUserAccount().subscribe({
      next: (userAccount) => { 
        this.userAccount = userAccount; 
        this.loadAssignedItems()
        this.loadUsernames()
      },
      error: () => { 
        console.error 
        console.log("TODO fix UserRest2.readUser")
      }
    })
  }

  loadUsernames():void {
    console.log("ProfileComponent: load usernames")
    if(this.isAdmin == false){
      console.log("no admin, not loading usernames for admin area!")
      //no errormsg necessary, this is just to be more secure, Admin Area should not be rendered, if user is not admin
      return;
    }
    this.adminAreaErrorMessage = ""
    this.userService.readAllUserNames().subscribe({
      next: (usernames) => { 
        this.usernames = usernames; 
        this.filteredUsernames = this.myControl.valueChanges
        .pipe(
        startWith(''),
        map(val => this.filter(val))
    );
      },
      error: () => { 
        console.error 
        this.adminAreaErrorMessage = "Beim Anzeigen der Benutzernamen ist leider ein Fehler aufgetreten. Versuch es morgen noch mal!"
        //TODO errormsg admin area
      }
    })

  }

  loadAssignedItems():void {
    console.log("ProfileComponent: load assigned items")
    this.itemsAreaErrorMessage = ""
    this.userService.readUserAssignedTodoItems().subscribe({
      next: (todoItems) => { 
        this.todoItems = todoItems; 
      },
      error: () => { 
        console.error 
        this.itemsAreaErrorMessage = "Beim laden der dir zugewiesenen Items ist leider ein Fehler aufgetreten. Versuche es später erneut!"
        //TODO errormsg item area
      }
    })
  }

  seeItemDetails(e: Event,item:TodoItem): void {
    console.log("ProfileComponent: Item Details Button clicked")
    e.preventDefault();
    let dialogRef = this.matDialog.open(TodoItemDetailsComponent, {data : item}) 
    dialogRef.afterClosed().subscribe(
      itemUpdated => {
        if(!itemUpdated){
          console.log("Profile: Item details dialog closed. No changes.")
          return;
        }
        console.log("Profile: Item details dialog closed. Item changed.")
        this.loadAssignedItems();
      }
    );
  }

  public deleteUser(e: Event): void {
    console.log("ProfileComponent: Delete User Button clicked") 
    e.preventDefault();
    this.adminAreaErrorMessage = ""
    if(this.isAdmin == false){
      //no errormsg necessary, this is just to be more secure, Admin Area should not be rendered, if user is not admin
      //NOTE: to enhance security we can also require the password for deletion
      return;
    }
    if(this.userAccount.username == this.deleteUsername){
      this.adminAreaErrorMessage = "Wenn ein Administrator sich selbst löschen könnte, wäre das schon iwo blöd. Vor allem, wenn da am Ende niemand mit Admin-Rechten übrig bleibt."
      return
    }
    //we could check if the deleteUsername is in the list of usernames, but we can also skip that, lets make use of status codes :D
    this.userService.deleteUserAccount(this.deleteUsername).subscribe({
      next: () => { 
        this.loadUsernames()
      },
      error: () => { 
        console.error 
        this.adminAreaErrorMessage = "Oops. Da ist was schief gegangen."
      }
    }) 
  }

  filter(val: string): string[] {
    console.log("ProfileComponent: Filtering usernames") 
    return this.usernames.filter(username =>
      username.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  get isAdmin (){
    return this.userAccount.userRole == USER_ROLE.ADMIN.toString();
  }
}
