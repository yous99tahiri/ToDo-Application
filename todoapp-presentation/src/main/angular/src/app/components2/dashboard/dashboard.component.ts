import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { TodoItem } from 'src/app/entities/todo-item';
import { TodoItemList } from 'src/app/entities/todo-item-list';
import { DialogParent } from '../dialog/dialog-parent';
import { MatDialog } from '@angular/material/dialog';
import { ItemService } from 'src/app/services/item.service';
import { UserAccount } from 'src/app/entities/user-account';

@Component({
  selector: 'wt2-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent extends DialogParent implements OnInit{
  /** Based on the screen size, switch from standard to one column per row */
  todoItemLists:TodoItemList[] = []
  
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      //if(matches){ return ...}
      return this.todoItemLists.map(list => {return {list:list,cols:1,rows:1}} );
    })
  );

  ngOnInit():void{
    this.getAllLists()
  }

  showItem(item:TodoItem):void{
    if(item == null || item == undefined){
      this.showDangerMessage(`Failed to show item: item is null`)
      return;
    }
    let copy = new TodoItem();
    copy.id = item.id
    copy.title = item.title
    copy.description = item.description
    copy.lastEdited = new Date(item.lastEdited)
    copy.deadLine = new Date(item.deadLine)
    copy.assignee = UserAccount.fromObject(item.assignee.toObject())
    copy.creator = UserAccount.fromObject(item.creator.toObject())
    copy.list = item.list
    copy.state = item.state
    this.openItemDetailsDialog({item:copy})
    .subscribe(
      ret => {
        if(ret && "changed" in ret && ret.changed){
          console.log("item changed")
          this.getAllLists()
          this.showSuccessMessage(`Successfully edited item!`)
          return;
        }
        console.log("item not changed")
      }
    )
  }

  deleteItem(item:TodoItem):void{
    if(item == null || item == undefined){
      this.showDangerMessage(`Failed to delete item: item is null`)
      return;
    }
    if(item.id == null || item.id  == undefined){
      this.showDangerMessage(`Failed to delete item: item.id is null/undefined`)
      return;
    }
    if(item.list == null || item.list  == undefined){
      this.showDangerMessage(`Failed to delete item: item.list is null/undefined`)
      return;
    }
    this.itemService.deleteTodoItem(item.list.toString(),item.id.toString()).subscribe({
      next:(item)=>{
        console.log("Dashboard: deleteItem success:",item)
        this.getAllLists();
        this.showSuccessMessage(`Successfully deleted item!`)
      },
      error:(err)=>{
        this.showDangerMessage(`Failed to delete item`)
        console.log("Dashboard: deleteItem failed: ",err)
      }
    })
  }

  createItem(list:TodoItemList){
    if(list == null || list == undefined){
      this.showDangerMessage(`Failed to create item: list (parent) is null`)
      return;
    }
    this.openItemCreationDialog({list:list})
    .subscribe(
      ret => {
        if(ret && "created" in ret && ret.created){
          console.log("item created")
          this.getAllLists()
          this.showSuccessMessage(`Successfully created item!`)
          return;
        }
        console.log("item not created")
      }
    )
  }

  createList():void{
    console.log("my lists: ",this.todoItemLists)
    this.openListCreationDialog({})
    .subscribe(
      ret => {
        if(ret && "created" in ret && ret.created){
          console.log("list created")
          this.getAllLists()
          this.showSuccessMessage(`Successfully created list!`)
          return
        }
        console.log("list not created")
      }
    )
  }

  deleteList(list:TodoItemList):void{
    if(list == null || list == undefined){
      this.showDangerMessage(`Failed to delete list: list is null`)
      return;
    }
    if(list.id == null || list.id  == undefined){
      this.showDangerMessage(`Failed to delete item: item.id is null/undefined`)
      return;
    }
    console.log("try to delete list", list)
    this.itemService.deleteTodoItemList(list.id.toString()).subscribe({
      next:(list)=>{
        console.log("Dashboard: deleteList success:",list)
        this.getAllLists();
        this.showSuccessMessage(`Successfully deleted list!`)
      },
      error:(err)=>{
        this.showDangerMessage(`Failed to delete list`)
        console.log("Dashboard: deleteList failed: ",err)
      }
    })
  }
  
  getAllLists():void{
    this.itemService.readAllTodoItemLists().subscribe({
      next:(lists)=>{
        console.log("Dashboard: getAllLists success:",lists)
        this.todoItemLists = lists;
      },
      error:(err)=>{
        this.showDangerMessage(`Failed to load lists`)
        console.log("Dashboard: getAllLists failed: ",err)
      }
    })
  }

  constructor(private breakpointObserver: BreakpointObserver,
    public d:MatDialog,
    private itemService:ItemService) { 
    super(d)
  }
}
