import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { TodoItem } from 'src/app/entities/todo-item';
import { TodoItemList } from 'src/app/entities/todo-item-list';
import { DialogParent } from '../dialog/dialog-parent';
import { MatDialog } from '@angular/material/dialog';
import { ItemService } from 'src/app/services/item.service';

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
    if(item == null){
      this.showDangerMessage(`Failed to show item: item is null`)
      return;
    }
    this.openItemDetailsDialog({item:item})
    .subscribe(
      ret => {
        if("changed" in ret && ret.changed){
          console.log("item changed")
          this.getAllLists()
        }
        console.log("item not changed")
      }
    )
  }

  deleteItem(item:TodoItem):void{
    if(item == null){
      this.showDangerMessage(`Failed to delete item: item is null`)
      return;
    }
    this.itemService.deleteTodoItem(item.list.id.toString(),item.id.toString()).subscribe({
      next:(item)=>{
        console.log("Dashboard: deleteItem success:",item)
        this.getAllLists();
      },
      error:(err)=>{
        this.showDangerMessage(`Failed to delete item`)
        console.log("Dashboard: deleteItem failed: ",err)
      }
    })
  }

  createItem(list:TodoItemList){
    if(list == null){
      this.showDangerMessage(`Failed to create item: list (parent) is null`)
      return;
    }
    this.openItemCreationDialog({list:list})
    .subscribe(
      ret => {
        if(ret && "created" in ret && ret.created){
          console.log("item created")
          this.getAllLists()
        }
        console.log("item not created")
      }
    )
  }

  createList():void{
    this.openListCreationDialog({})
    .subscribe(
      ret => {
        if("created" in ret && ret.created){
          console.log("list created")
          this.getAllLists()
          return
        }
        console.log("list not created")
      }
    )
  }

  deleteList(list:TodoItemList):void{
    if(list == null){
      this.showDangerMessage(`Failed to delete list: list is null`)
      return;
    }
    this.itemService.deleteTodoItemList(list.id.toString()).subscribe({
      next:(list)=>{
        console.log("Dashboard: deleteList success:",list)
        this.getAllLists();
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
