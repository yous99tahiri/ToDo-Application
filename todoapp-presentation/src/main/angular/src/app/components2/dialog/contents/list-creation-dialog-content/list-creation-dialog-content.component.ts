import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageBoxParent } from 'src/app/components2/message-box/message-box-parent';

@Component({
  selector: 'wt2-list-creation-dialog-content',
  templateUrl: './list-creation-dialog-content.component.html',
  styleUrls: ['./list-creation-dialog-content.component.sass']
})
export class ListCreationDialogContentComponent extends MessageBoxParent{

  listForm = this.fb.group({
    title: [null, Validators.required],
    description: [null, Validators.required],
    deadLine: [null, Validators.required]
  });
  ret:ListCreationDialogOutputData =  {created:false}
  minDate:Date=new Date();
  deadLine:Date=new Date();
  @ViewChild(MatDatepicker) picker: MatDatepicker<Date>;

  constructor(public dialogRef: MatDialogRef<ListCreationDialogContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ListCreationDialogInputData,
    private fb: FormBuilder) { 
    super()
    console.log("ListCreationDialogContentComponent: created")
    console.log("Injected data: ",data)
  }

  createList():void{
    this.ret.created = true;
    //todo use service to create list
    console.log("ListCreationDialogContentComponent: createList called, TODO: implement")
    this.dialogRef.close(this.ret)
  }

  closeDialog():void{
    this.ret.created = false;
    this.dialogRef.close(this.ret)
  }
}

//<D>
export type ListCreationDialogInputData = {
  //...
}

//<R>
export type ListCreationDialogOutputData = {
  created:boolean
  //...
}
