import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TodoItem } from 'src/app/entities/todo-item';
import { UserAccount, USER_ROLE } from 'src/app/entities/user-account';
import { UserService } from 'src/app/services/user.service';
import { DialogParent } from '../dialog/dialog-parent';

@Component({
  selector: 'wt2-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent extends DialogParent implements OnInit{

  userAccount:UserAccount = new UserAccount()

  assignedItems:TodoItem[] = []
  selectedItem:TodoItem = null;

  usernames:string[]=[]
  selectedUsername:string="";

  ngOnInit():void{
    this.getUserAccount()
  }

  getUserAccount():void{
    this.userService.readUserAccount().subscribe({
      next:(userAccount)=>{
        console.log("ProfileComponent: getAllLists success:",userAccount)
        this.userAccount = userAccount;
        this.getAssignedItems();
        if(this.isAdmin()){
          this.getUsernames()
        }
      },
      error:(err)=>{
        this.showDangerMessage(`Failed to load user account`)
        console.log("ProfileComponent: getAllLists failed: ",err)
      }
    })
  }

  getAssignedItems():void{
    this.userService.readUserAssignedTodoItems().subscribe({
      next:(assignedItems)=>{
        console.log("ProfileComponent: getAssignedItems success:",assignedItems)
        this.assignedItems = assignedItems;
      },
      error:(err)=>{
        this.showDangerMessage(`Failed to load assigned items`)
        console.log("ProfileComponent: getAssignedItems failed: ",err)
      }
    })
  }

  getUsernames():void{
    this.userService.readAllUserNames().subscribe({
      next:(usernames)=>{
        console.log("ProfileComponent: getUsernames success:",usernames)
        this.usernames = usernames;
      },
      error:(err)=>{
        this.showDangerMessage(`Failed to load usernames`)
        console.log("ProfileComponent: getUsernames failed: ",err)
      }
    })
  }

  isAdmin():boolean{
    return this.userAccount.userRole === USER_ROLE.ADMIN.toString();
  }

  deleteUser():void{
    if(this.selectedUsername == this.userAccount.username){
      this.showDangerMessage(`Failed to delete user: you can not delete yourself`)
      return;
    }
    if(!this.isAdmin()){
      this.showDangerMessage(`Failed to delete user: you are no admin`)
      return;
    }
    if(this.selectedUsername == ""){
      this.showDangerMessage(`Failed to delete user: selectedUsername is ''`)
      return;
    }
    this.userService.deleteUserAccount(this.selectedUsername).subscribe({
      next:(deletedAcc)=>{
        console.log("ProfileComponent: deleteUser success:",deletedAcc)
        this.getUsernames();
      },
      error:(err)=>{
        this.showDangerMessage(`Failed to delete user`)
        console.log("ProfileComponent: deleteUser failed: ",err)
      }
    })
  }

  canDeleteUser():boolean{
    return this.selectedUsername != '' && this.selectedUsername != this.userAccount.username;
  }

  showSelectedItem():void{
    if(this.selectedUsername == this.userAccount.username){
      this.showDangerMessage(`Failed to show selected item: item is null`)
      return;
    }
    this.openItemDetailsDialog({item:this.selectedItem})
    .subscribe(
      ret => {
        if(ret && "changed" in ret && ret.changed){
          console.log("item changed")
          this.getAssignedItems()
          return
        }
        console.log("item not changed")
      }
    )
  }

  constructor(public d:MatDialog, private userService:UserService) { 
    super(d)
  }

}
