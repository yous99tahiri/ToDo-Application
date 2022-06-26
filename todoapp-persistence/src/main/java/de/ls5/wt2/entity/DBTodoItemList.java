package de.ls5.wt2.entity;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Entity
public class DBTodoItemList extends DBIdentified{
    String title = "";
    String description = "";
    Date lastEdited;
    Date deadLine ;
    Set<DBTodoItem> dbtodoItems;
    String creator= "";
    
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

    public String getCreator(){
        return this.creator;
    }

    public void setCreator(String creator){
        this.creator = creator;
    }

    public void setDBTodoItems(Set<DBTodoItem> dbtodoItems){
        this.dbtodoItems = dbtodoItems;
    }

    @OneToMany(targetEntity = DBTodoItem.class,fetch = FetchType.EAGER)
    public Set<DBTodoItem> getDBTodoItems(){
        return this.dbtodoItems;
    }
}
