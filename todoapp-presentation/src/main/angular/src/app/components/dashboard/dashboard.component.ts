import { Component, OnInit } from '@angular/core';
import { TodoItemList } from 'src/app/entities/todo-item-list';
import { MatDialog } from '@angular/material/dialog'; 
import { CreateTodoItemListComponent } from '../create-todo-item-list/create-todo-item-list.component';
import { ItemService } from 'src/app/services/item.service';
import { ITEM_STATE, TodoItem } from 'src/app/entities/todo-item';
@Component({
  selector: 'wt2-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
//TODO:
//show item lists in a grid (html!)
export class DashboardComponent implements OnInit {

  public todoItemLists: TodoItemList[] = []
  public errorMessage = ''; //TODO add error messaging in component
  public successMessage: string = '';

  constructor(
    private matDialog:MatDialog,
    private itemService:ItemService) {
  }

  ngOnInit(): void {
    console.log("Dashboard: created")
    let item1:any =  {
        "title": "Item1 Title",
        "description": "Item1 Description",
        "lastEdited": new Date().toString(), 
        "deadLine":new Date().toString(),
        "creator":"Niklas",
        "assignee":"Manu",
        "state":ITEM_STATE.OPEN
    }
  
    let item2:any =  {
        "title": "Item2 Title",
        "description": "Item2 Description",
        "lastEdited": new Date().toString(), 
        "deadLine":new Date().toString(),
        "creator":"Youssef",
        "assignee":"Alex",
        "state":ITEM_STATE.IN_PROGRESS
    }
  
    let item3:any = {
        "title": "Item3 Title",
        "description": "Item3 Description",
        "lastEdited": new Date().toString(), 
        "deadLine":new Date().toString(),
        "creator":"Alex",
        "assignee":"Manu",
        "state":ITEM_STATE.DONE
    }
  
    let item4:any = {
        "title": "Item4 Title",
        "description": "Item4 Description",
        "lastEdited": new Date().toString(), 
        "deadLine":new Date().toString(),
        "creator":"Manu",
        "assignee":"Alex",
        "state":ITEM_STATE.FEEDBACK
    }
  

  let itemList1:TodoItemList = TodoItemList.fromObject({
      "title": "Itemlist1 Title",
      "description": "Itemlist1 Description",
      "lastEdited": new Date().toString(), 
      "deadLine":new Date().toString(),
      "creator":"Niklas",
      "todoItems" : [item1,item2]
  })
  let itemList2 = TodoItemList.fromObject({
      "title": "Itemlist2 Title",
      "description": "Itemlist2 Description",
      "lastEdited": new Date().toString(), 
      "deadLine":new Date().toString(),
      "creator":"Youssef",
      "todoItems" : [item3,item4]
  })
  this.todoItemLists = [itemList1,itemList2]
  //this.loadItemLists(); reaktivieren!
}

  loadItemLists():void {
    console.log("Dashboard: load item lists")
    
    this.itemService.readAllTodoItemLists().subscribe({
        next: (todoItemLists) => {
          this.todoItemLists = todoItemLists
        },
        error: () => { 
          console.error 
          //TODO errormsg
        }
      }
    )
  }

  addList(e: Event): void {
    console.log("Dashboard: Add list button clicked")
    e.preventDefault();
    let dialogRef = this.matDialog.open(CreateTodoItemListComponent)
    dialogRef.afterClosed().subscribe(
      createdList => {
        if(!createdList){
          console.log("Dashboard: Create item list dialog closed. No list created.")
          return;
        }
        console.log("Dashboard: Create item list dialog closed. List created.")
        this.successMessage = "Successfully created list!";
        this.loadItemLists();
      }
    );
  }

  onListDeleted(e: Event): void {
    console.log("Dashboard: onListDeleted event triggered");
    this.loadItemLists();
  }
}
