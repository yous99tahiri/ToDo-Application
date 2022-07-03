import { TodoItemList } from "./todo-item-list";
import { UserAccount } from "./user-account";

export class TodoItem{
    id:number = 0;
    title: string = "";
    description: string = "";
    lastEdited: Date = null;
    deadLine: Date =null;
    creator: UserAccount = null;
    assignee: UserAccount = null;
    list:number = null;
    state:string = ITEM_STATE.OPEN.toString()
    
    static fromObject(object: any): TodoItem {
      console.log(`TodoItem: fromObject called for ${JSON.stringify(object)}`)
      const n = new TodoItem();
      n.id = object.id;
      n.list = object.list;
      n.title = object.title;
      n.description = object.description;
      n.lastEdited = new Date(object.lastEdited);
      n.deadLine = new Date(object.deadLine);
      n.creator = UserAccount.fromObject(object.creator);
      n.assignee = UserAccount.fromObject(object.assignee);
      n.state = object.state
      return n;
    }

    toObject() : any {
      const obj = {
        "list": this.list,
        "title" : this.title,
        "description" : this.description,
        "lastEdited" : this.lastEdited != null ? this.lastEdited.toISOString() : new Date().toISOString(),
        "deadLine" : this.deadLine != null ? this.deadLine.toISOString() : new Date().toISOString(),
        "creator" : this.creator != null ? this.creator.id : -1,
        "assignee" : this.assignee != null ? this.assignee.id : -1,
        "state":this.state
      }
      console.log(`TodoItem: toObject called for ${JSON.stringify(obj)}`);
      return obj;
    }
  }
  
  export const enum ITEM_STATE{
    OPEN = "open",
    IN_PROGRESS = "in_progress",
    FEEDBACK = "done"
  }