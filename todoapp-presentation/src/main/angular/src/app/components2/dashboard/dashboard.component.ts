import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { TodoItem } from 'src/app/entities/todo-item';
import { TodoItemList } from 'src/app/entities/todo-item-list';
import { DialogParent } from '../dialog/dialog-parent';
import { MatDialog } from '@angular/material/dialog';
import { ListCreationDialogContentComponent, ListCreationDialogInputData, ListCreationDialogOutputData } from '../dialog/contents/list-creation-dialog-content/list-creation-dialog-content.component';
import { ItemCreationDialogContentComponent, ItemCreationDialogInputData, ItemCreationDialogOutputData } from '../dialog/contents/item-creation-dialog-content/item-creation-dialog-content.component';
import { ItemDetailsDialogContentComponent, ItemDetailsDialogInputData, ItemDetailsDialogOutputData } from '../dialog/contents/item-details-dialog-content/item-details-dialog-content.component';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'wt2-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent extends DialogParent{
  /** Based on the screen size, switch from standard to one column per row */
  todoItems:TodoItemList[] = []
  
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      return this.todoItems.map(list => {return {list:list,cols:1,rows:1}} );
    })
  );

  showItem(item:TodoItem):void{
    this.openItemDetailsDialog({item:item})
    .subscribe(
      ret => {
        if("changed" in ret && ret.changed){
          //reload all lists
          console.log("item changed")
          return
        }
        console.log("item not changed")
      }
    )
  }

  deleteItem(item:TodoItem):void{

  }

  createItem(list:TodoItemList){
    this.openItemCreationDialog({list:list})
    .subscribe(
      ret => {
        if(ret && "created" in ret && ret.created){
          console.log("item created")
          return
          //reload all lists
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
          //reload all lists
          console.log("list created")
          return
        }
        console.log("list not created")
      }
    )
  }

  deleteList(list:TodoItemList):void{

  }
  getAllLists():void{

  }
  constructor(private breakpointObserver: BreakpointObserver,
    public d:MatDialog,
    private itemService:ItemService) { 
    super(d)
  }
}
