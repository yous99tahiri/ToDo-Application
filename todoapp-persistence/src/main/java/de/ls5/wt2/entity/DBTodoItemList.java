package de.ls5.wt2.entity;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

import javax.persistence.*;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Entity
public class DBTodoItemList extends DBIdentified {
    private String title = "";
    private String description = "";
    private Date lastEdited;
    private Date deadLine;
    private List<DBTodoItem> todoItems;
    private DBUserAccount creator;

    public String getTitle(){
        return this.title;
    }

    public void setTitle(String title){
        this.title = title;
    }

    @Column(length=255)
    public String getDescription(){
        return this.description;
    }

    public void setDescription(String description){
        this.description = description;
    }

    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(iso = ISO.DATE_TIME)
    public Date getLastEdited() {
        return this.lastEdited;
    }

    public void setLastEdited(Date lastEdited) {
        this.lastEdited = lastEdited;
    }

    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(iso = ISO.DATE_TIME)
    public Date getDeadLine() {
        return this.deadLine;
    }

    public void setDeadLine(Date deadLine) {
        this.deadLine = deadLine;
    }

    @ManyToOne(targetEntity = DBUserAccount.class, fetch = FetchType.EAGER)
    public DBUserAccount getCreator(){
        return this.creator;
    }

    public void setCreator(DBUserAccount creator){
        this.creator = creator;
    }

    public void setTodoItems(List<DBTodoItem> todoItems){
        this.todoItems = todoItems;
    }

    @OneToMany(targetEntity = DBTodoItem.class, fetch = FetchType.EAGER, mappedBy = "list")
    public List<DBTodoItem> getTodoItems(){
        return this.todoItems;
    }
}
