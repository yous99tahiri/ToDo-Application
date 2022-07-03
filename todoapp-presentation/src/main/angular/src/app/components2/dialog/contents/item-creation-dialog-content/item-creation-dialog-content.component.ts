import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageBoxParent } from 'src/app/components2/message-box/message-box-parent';
import { TodoItem } from 'src/app/entities/todo-item';
import { TodoItemList } from 'src/app/entities/todo-item-list';
import { UserAccount } from 'src/app/entities/user-account';
import { ItemService } from 'src/app/services/item.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'wt2-item-creation-dialog-content',
  templateUrl: './item-creation-dialog-content.component.html',
  styleUrls: ['./item-creation-dialog-content.component.sass']
})
//<T>
export class ItemCreationDialogContentComponent extends MessageBoxParent implements OnInit {

  ngOnInit(): void {
    this.getUsernames()
  }

  itemForm = this.fb.group({
    title: [null, Validators.required],
    description: [null, Validators.required]
  });
  selectedUsername:string="";
  usernames:string[][]=[]

  ret:ItemCreationDialogOutputData =  {created:false}

  minDate:Date=new Date();
  deadLine:string=new Date().toISOString();
  
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

  

  canCreateItem():boolean{
    return this.itemForm.valid && this.usernames.map(id_name_Pair => id_name_Pair[1]).includes(this.selectedUsername) && new Date(this.deadLine) > new Date();
  }

  createItem():void{
    if(this.canCreateItem() == false){
      this.showDangerMessage(`Failed to create item: form is not valid`)
      return;
    }
    let item = new TodoItem()
    let assignee = new UserAccount()
    assignee.username = this.selectedUsername
    console.log("Assignee id is",this.usernames.filter(id_name_Pair => id_name_Pair[1]===this.selectedUsername)[0][0])
    assignee.id = Number(this.usernames.filter(id_name_Pair => id_name_Pair[1]===this.selectedUsername)[0][0])
    item.assignee = assignee
    item.title = this.itemForm.get("title").value
    item.description = this.itemForm.get("description").value
    item.lastEdited = new Date()
    item.deadLine = new Date(this.deadLine)
    item.list = this.data.list.id
    
    this.itemService.createTodoItem(item).subscribe({
      next:(item)=>{
        console.log("ItemCreationDialogContentComponent: createItem success:",item)
        this.ret.created = true;
        this.dialogRef.close(this.ret)
      },
      error:(err)=>{
        this.showDangerMessage(`Failed to create item`)
        console.log("ItemCreationDialogContentComponent: createItem failed: ",err)
      }
    });
    
  }

  getUsernames():void{
    this.userService.readAllUserNames().subscribe({
      next:(usernames)=>{
        console.log("ItemCreationDialogContentComponent: getUsernames success:",usernames)
        this.usernames = usernames;
      },
      error:(err)=>{
        this.showDangerMessage(`Failed to load usernames`)
        console.log("ItemCreationDialogContentComponent: getUsernames failed: ",err)
      }
    })
  }

  closeDialog():void{
    this.ret.created = false;
    this.dialogRef.close(this.ret)
  }
}


//<D>
export type ItemCreationDialogInputData = {
  list:TodoItemList
  //...
}

//<R>
export type ItemCreationDialogOutputData = {
  created:boolean
  //...
}