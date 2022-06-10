export class TodoItem{
    title: string;
    description: string;
    lastEdited: Date;
    deadLine: Date;
    //creator: any; //TODO
    //assignees: any; //TODO
    //comments
    //state (new,in progress, feedback)
    
    static fromObject(object: any): TodoItem {
      const n = new TodoItem();
      n.title = object.title;
      n.description = object.description;
      n.lastEdited = new Date(object.lastEdited);
      n.deadLine = new Date(object.deadLine);
      //n.creator = ... TODO;
      //n.assignees = ... TODO;
      return n;
    }
  }
  