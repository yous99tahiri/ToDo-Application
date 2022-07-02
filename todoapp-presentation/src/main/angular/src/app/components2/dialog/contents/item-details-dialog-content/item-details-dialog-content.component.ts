import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageBoxParent } from 'src/app/components2/message-box/message-box-parent';
import { TodoItem } from 'src/app/entities/todo-item';
import { UserAccount } from 'src/app/entities/user-account';
import { ItemService } from 'src/app/services/item.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'wt2-item-details-dialog-content',
  templateUrl: './item-details-dialog-content.component.html',
  styleUrls: ['./item-details-dialog-content.component.sass']
})
export class ItemDetailsDialogContentComponent extends MessageBoxParent implements OnInit {

  ngOnInit(): void {
    this.getUsernames()
  }

  itemForm = this.fb.group({
    title: [this.data.item.title, Validators.required],
    description: [this.data.item.description, Validators.required]
  });
  selectedUsername:string=this.data.item.assignee.username;
  usernames:string[][]=[]
  ret:ItemDetailsDialogOutputData =  {changed:false}
  minDate:Date=new Date();
  @ViewChild(MatDatepicker) picker: MatDatepicker<Date>;

  constructor(public dialogRef: MatDialogRef<ItemDetailsDialogContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ItemDetailsDialogInputData,
    private fb: FormBuilder,
    private itemService:ItemService, 
    private userService:UserService) { 
    super()
    console.log("ItemDetailsDialogContentComponent: created")
    console.log("Injected data: ",data)
  }
  canUpdateItem():boolean{
    return this.itemForm.valid && this.usernames.map(id_name_Pair => id_name_Pair[1]).includes(this.selectedUsername) && this.data.item.deadLine > new Date();
  }
  updateItem():void{
    if(this.canUpdateItem() == false){
      this.showDangerMessage(`Failed to update item: form is not valid`)
      return;
    }
    this.data.item.title = this.itemForm.get("title").value
    this.data.item.description = this.itemForm.get("description").value
    this.data.item.lastEdited = new Date()
    if(this.selectedUsername != this.data.item.assignee.username){
      let newAssignee = new UserAccount()
      newAssignee.username = this.selectedUsername
      this.data.item.assignee = newAssignee;
    }

    this.itemService.updateTodoItem(this.data.item).subscribe({
      next:(item)=>{
        console.log("ItemDetailsDialogContentComponent: updateItem success:",item)
        this.ret.changed = true;
        this.dialogRef.close(this.ret)
      },
      error:(err)=>{
        this.showDangerMessage(`Failed to update item`)
        console.log("ItemDetailsDialogContentComponent: updateItem failed: ",err)
      }
    });
    
  }

  

  getUsernames():void{
    this.userService.readAllUserNames().subscribe({
      next:(usernames)=>{
        console.log("ItemDetailsDialogContentComponent: getUsernames success:",usernames)
        this.usernames = usernames;
      },
      error:(err)=>{
        this.showDangerMessage(`Failed to load usernames`)
        console.log("ItemDetailsDialogContentComponent: getUsernames failed: ",err)
      }
    })
  }

  closeDialog():void{
    this.ret.changed = false;
    this.dialogRef.close(this.ret)
  }
}


//<D>
export type ItemDetailsDialogInputData = {
  item:TodoItem
  //...
}

//<R>
export type ItemDetailsDialogOutputData = {
  changed:boolean
  //...
}