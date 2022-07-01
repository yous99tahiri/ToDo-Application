import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageBoxParent } from 'src/app/components2/message-box/message-box-parent';
import { TodoItem } from 'src/app/entities/todo-item';
import { ItemService } from 'src/app/services/item.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'wt2-item-details-dialog-content',
  templateUrl: './item-details-dialog-content.component.html',
  styleUrls: ['./item-details-dialog-content.component.sass']
})
export class ItemDetailsDialogContentComponent extends MessageBoxParent{
  itemForm = this.fb.group({
    title: [this.data.item.title, Validators.required],
    description: [this.data.item.description, Validators.required]
  });
  selectedUsername:string=this.data.item.assignee.username;
  usernames:string[]=[]
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

  updateItem():void{
    this.ret.changed = true;
    //todo use service to update item
    console.log("ItemDetailsDialogContentComponent: updateItem called, TODO: implement")
    this.dialogRef.close(this.ret)
  }

  getUsernames():void{
    console.log("ItemDetailsDialogContentComponent: getUsernames called, TODO: implement")
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