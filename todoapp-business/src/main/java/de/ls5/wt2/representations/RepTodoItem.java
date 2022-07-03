package de.ls5.wt2.representations;

import de.ls5.wt2.entity.DBTodoItem;
import java.util.Date;

public class RepTodoItem {
    public final long id;
    public final String title;
    public final String description;
    public final Date lastEdited;
    public final Date deadLine;
    public final RepUserAccount creator;
    public final RepUserAccount assignee;
    public final long list;
    public final String state;

    public RepTodoItem(DBTodoItem dbTodoItem) {
        this.id = dbTodoItem.getId();
        this.title = dbTodoItem.getTitle();
        this.description = dbTodoItem.getDescription();
        this.lastEdited = dbTodoItem.getLastEdited();
        this.deadLine = dbTodoItem.getDeadLine();
        this.creator = new RepUserAccount(dbTodoItem.getCreator());
        if(dbTodoItem.getAssignee() != null) {
            this.assignee = new RepUserAccount(dbTodoItem.getAssignee());
        } else {
            this.assignee = null;
        }
        this.list = dbTodoItem.getList().getId();
        this.state = dbTodoItem.getState();
    }
}
