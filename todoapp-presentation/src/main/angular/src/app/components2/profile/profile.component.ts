import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TodoItem } from 'src/app/entities/todo-item';
import { UserAccount } from 'src/app/entities/user-account';
import { ItemDetailsDialogContentComponent, ItemDetailsDialogInputData, ItemDetailsDialogOutputData } from '../dialog/contents/item-details-dialog-content/item-details-dialog-content.component';
import { DialogParent } from '../dialog/dialog-parent';

@Component({
  selector: 'wt2-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent extends DialogParent{

  userAccount:UserAccount = new UserAccount()

  assignedItems:TodoItem[] = []
  selectedItem:TodoItem = null;

  usernames:string[]=[]
  selectedUsername:string="";

  getUserAccount():void{
    console.log("ProfileComponent: getUserAccount called, TODO: implement")
  }

  getAssignedItems():void{
    console.log("ProfileComponent: getAssignedItems called, TODO: implement")
  }

  getUsernames():void{
    console.log("ProfileComponent: getUsernames called, TODO: implement")
  }

  canDeleteUser():boolean{
    return this.selectedUsername != '' && this.selectedUsername != this.userAccount.username;
  }
  deleteUser():void{
    console.log("ProfileComponent: deleteUser called, TODO: implement")
    //check selectedUsername
    //use service to deleter user
  }

  showSelectedItem():void{
    //check selectedItem
    this.openItemDetailsDialog({item:this.selectedItem})
    .subscribe(
      ret => {
        if(ret && "changed" in ret && ret.changed){
          //reload all assigned items
          console.log("item changed")
          return
        }
        console.log("item not changed")
      }
    )
  }

  constructor(public d:MatDialog) { 
    super(d)
  }

}
