import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageBoxParent } from 'src/app/components2/message-box/message-box-parent';
import { ItemService } from 'src/app/services/item.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'wt2-item-creation-dialog-content',
  templateUrl: './item-creation-dialog-content.component.html',
  styleUrls: ['./item-creation-dialog-content.component.sass']
})
//<T>
export class ItemCreationDialogContentComponent extends MessageBoxParent {
  itemForm = this.fb.group({
    title: [null, Validators.required],
    description: [null, Validators.required]
  });
  selectedUsername:string="";
  usernames:string[]=[]

  ret:ItemCreationDialogOutputData =  {created:false}

  minDate:Date=new Date();
  deadLine:Date=new Date();
  
  @ViewChild(MatDatepicker) picker: MatDatepicker<Date>;

  constructor(public dialogRef: MatDialogRef<ItemCreationDialogContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ItemCreationDialogInputData,
    private fb: FormBuilder,
    private itemService:ItemService, 
    private userService:UserService) { 
    super()
    console.log("ItemCreationDialogContentComponent: created")
    console.log("Injected data: ",data)
  }

  createItem():void{
    this.ret.created = true;
    //todo use service to create item
    console.log("ItemCreationDialogContentComponent: createItem called, TODO: implement")
    this.dialogRef.close(this.ret)
  }

  getUsernames():void{
    console.log("ItemCreationDialogContentComponent: getUsernames called, TODO: implement")
  }

  closeDialog():void{
    this.ret.created = false;
    this.dialogRef.close(this.ret)
  }
}


//<D>
export type ItemCreationDialogInputData = {
  listTitle:string
  //...
}

//<R>
export type ItemCreationDialogOutputData = {
  created:boolean
  //...
}