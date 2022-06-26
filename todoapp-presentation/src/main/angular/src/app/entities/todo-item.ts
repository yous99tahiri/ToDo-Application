export class TodoItem{
    id:number = 0;
    listTitle:string = "";
    title: string = "";
    description: string = "";
    lastEdited: Date = null;
    deadLine: Date =null;
    creator: string = "";
    assignee: string = "None";
    //comments
    state:string = ITEM_STATE.OPEN.toString()
    
    static fromObject(object: any): TodoItem {
      console.log(`TodoItem: fromObject called for ${JSON.stringify(object)}`)
      const n = new TodoItem();
      n.id = object.id;
      n.listTitle = object.listTitle;
      n.title = object.title;
      n.description = object.description;
      n.lastEdited = new Date(object.lastEdited);
      n.deadLine = new Date(object.deadLine);
      n.creator = object.creator;
      n.assignee = object.assignee;
      //comments
      n.state = object.state
      return n;
    }

    toObject() : any {
      const obj = {
        "id":this.id,
        "listTitle":this.listTitle,
        "title" : this.title,
        "description" : this.description,
        "lastEdited" : this.lastEdited != null ? this.lastEdited.toISOString() : new Date().toISOString(),
        "deadLine" : this.deadLine != null ? this.deadLine.toISOString() : new Date().toISOString(),
        "creator" : this.creator,
        "assignee" : this.assignee,
        "state":this.state
      }
      console.log(`TodoItem: toObject called for ${JSON.stringify(obj)}`);
      return obj;
    }
  }
  
  export const enum ITEM_STATE{
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    FEEDBACK = "FEEDBACK",
    DONE = "DONE"
  }