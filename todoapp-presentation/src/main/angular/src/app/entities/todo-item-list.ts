import { TodoItem } from "./todo-item";

export class TodoItemList{
    title: string;
    description: string;
    lastEdited: Date;
    deadLine: Date;
    todoItems: TodoItem[] = [];
    creator: string; //TODO
    //comments
    //state (new,in progress, feedback)
    
    static fromObject(object: any): TodoItemList {
      const n = new TodoItemList();
      n.title = object.title;
      n.description = object.description;
      n.lastEdited = new Date(object.lastEdited);
      n.todoItems = new Array(object.todoItems)
      n.deadLine = new Date(object.deadLine);
      n.creator = object.creator;
      //comments
      //state (new,in progress, feedback)
      return n;
    }
  }
  