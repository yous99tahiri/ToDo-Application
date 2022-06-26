import { ITEM_STATE, TodoItem } from "./todo-item";

export class TodoItemList{
    id:number = 0;
    title: string = "";
    description: string= "";
    lastEdited: Date = null;
    deadLine: Date = null;
    todoItems: TodoItem[] = [];
    creator: string = "";
    //comments
    //state (open, in progress, feedback, done)
    
    static fromObject(object: any): TodoItemList {
      console.log(`TodoItemList: fromObject called for ${JSON.stringify(object)}`)
      const n = new TodoItemList();
      n.id = object.id;
      n.title = object.title;
      n.description = object.description;
      n.lastEdited = new Date(object.lastEdited);
      n.todoItems = object.todoItems.map(obj => TodoItem.fromObject(obj));
      n.deadLine = new Date(object.deadLine);
      n.creator = object.creator;
      //comments
      //state (open, in progress, feedback, done)
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
        "creator" : this.creator
      }
      console.log(`TodoItemList: toObject called for ${JSON.stringify(obj)}`);
      return obj;
    }
  }

