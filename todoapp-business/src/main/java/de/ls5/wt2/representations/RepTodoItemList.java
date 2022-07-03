package de.ls5.wt2.representations;

import de.ls5.wt2.entity.DBTodoItem;
import de.ls5.wt2.entity.DBTodoItemList;
import de.ls5.wt2.entity.DBUserAccount;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class RepTodoItemList {
    public final long id;
    public final String title;
    public final String description;
    public final Date lastEdited;
    public final Date deadLine;
    public final List<RepTodoItem> todoItems;
    public final RepUserAccount creator;
    public final Date created;

    public RepTodoItemList(DBTodoItemList dbTodoItemList) {
        this.id = dbTodoItemList.getId();
        this.title = dbTodoItemList.getTitle();
        this.description = dbTodoItemList.getDescription();
        this.lastEdited = dbTodoItemList.getLastEdited();
        this.deadLine = dbTodoItemList.getDeadLine();
        this.todoItems = new ArrayList<>();
        this.creator = new RepUserAccount(dbTodoItemList.getCreator());
        this.created = dbTodoItemList.getCreated();

        for(DBTodoItem dbTodoItem : dbTodoItemList.getTodoItems()) {
            this.todoItems.add(new RepTodoItem(dbTodoItem));
        }
    }
}
