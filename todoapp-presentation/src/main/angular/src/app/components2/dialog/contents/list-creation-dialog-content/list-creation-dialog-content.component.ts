import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageBoxParent } from 'src/app/components2/message-box/message-box-parent';
import { TodoItemList } from 'src/app/entities/todo-item-list';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'wt2-list-creation-dialog-content',
  templateUrl: './list-creation-dialog-content.component.html',
  styleUrls: ['./list-creation-dialog-content.component.sass']
})
export class ListCreationDialogContentComponent extends MessageBoxParent{

  listForm = this.fb.group({
    title: [null, Validators.required],
    description: [null, Validators.required]
  });
  ret:ListCreationDialogOutputData =  {created:false}
  minDate:Date=new Date();
  deadLine:Date=new Date();
  @ViewChild(MatDatepicker) picker: MatDatepicker<Date>;

  constructor(public dialogRef: MatDialogRef<ListCreationDialogContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ListCreationDialogInputData,
    private fb: FormBuilder,
    private itemService:ItemService) { 
    super()
    console.log("ListCreationDialogContentComponent: created")
    console.log("Injected data: ",data)
  }

  createList():void{
    if(this.canCreateList() == false){
      this.showDangerMessage(`Failed to create list: form is not valid`)
      return;
    }
    let list = new TodoItemList()
    list.deadLine = this.deadLine;
    list.title = this.listForm.get("title").value
    list.description = this.listForm.get("description").value
    list.lastEdited = new Date()

    this.itemService.createTodoItemList(list).subscribe({
      next:(list)=>{
        console.log("ListCreationDialogContentComponent: createList success:",list)
        this.ret.created = true;
        this.dialogRef.close(this.ret)
      },
      error:(err)=>{
        this.showDangerMessage(`Failed to create list`)
        console.log("ListCreationDialogContentComponent: createList failed: ",err)
      }
    })
    
  }

  canCreateList():boolean{
    return this.listForm.valid && this.deadLine != null && this.deadLine > new Date();
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
