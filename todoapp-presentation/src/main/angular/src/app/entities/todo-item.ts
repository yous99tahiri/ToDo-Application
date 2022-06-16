export class TodoItem{
    title: string = "";
    description: string = "";
    lastEdited: Date;
    deadLine: Date;
    creator: string = ""; //TODO
    assignee: string = "None"; //TODO
    //comments
    state:ITEM_STATE = ITEM_STATE.OPEN
    
    static fromObject(object: any): TodoItem {
      console.log(`TodoItem: fromObject called for ${JSON.stringify(object)}`)
      const n = new TodoItem();
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
        "title" : this.title,
        "description" : this.description,
        "lastEdited" : this.lastEdited.toString(),
        "deadLine" : this.deadLine.toString(),
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
    IN_PROGRESS = "IN PROGRESS",
    FEEDBACK = "FEEDBACK",
    DONE = "DONE"
  }