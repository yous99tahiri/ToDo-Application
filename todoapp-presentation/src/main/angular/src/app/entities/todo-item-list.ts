import { TodoItem } from "./todo-item";
import { UserAccount } from "./user-account";

export class TodoItemList{
    id:number = 0;
    title: string = "";
    description: string= "";
    lastEdited: Date = null;
    deadLine: Date = null;
    todoItems: TodoItem[] = [];
    creator: UserAccount = null;
    
    static fromObject(object: any): TodoItemList {
      console.log(`TodoItemList: fromObject called for ${JSON.stringify(object)}`)
      const n = new TodoItemList();
      n.id = object.id;
      n.title = object.title;
      n.description = object.description;
      n.lastEdited = new Date(object.lastEdited);
      n.todoItems = Array.from(object.todoItems).map(obj => TodoItem.fromObject(obj));
      n.deadLine = new Date(object.deadLine);
      n.creator = UserAccount.fromObject(object.creator);
      return n;
    }

    toObject() : any {
      const obj = {
        "id":this.id,
        "title" : this.title,
        "description" : this.description,
        "lastEdited" : this.lastEdited != null ? this.lastEdited.toISOString() : new Date().toISOString(),
        "deadLine" : this.deadLine != null ? this.deadLine.toISOString() : new Date().toISOString(),
        "todoItems" : this.todoItems.map(item => { return item.toObject()} ),
        "creator" : this.creator == null ? null : this.creator.toObject()
      }
      console.log(`TodoItemList: toObject called for ${JSON.stringify(obj)}`);
      return obj;
    }
  }

