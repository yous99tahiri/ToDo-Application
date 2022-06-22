package de.ls5.wt2.entity;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;
import java.util.List;

@Entity
public class DBTodoItemList extends DBIdentified{
    String title = "";
    String description = "";
    Date lastEdited;
    Date deadLine ;
    List<DBTodoItem> todoItems;
    String creator= "";
    
    public String getTitle(){
        return this.description;
    }

    public void setTitle(String description){
        this.description = description;
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

    public void setDBTodoItems(List<DBTodoItem> todoItems){
        this.todoItems = todoItems;
    }

    @ManyToOne
    public List<DBTodoItem> getDBTodoItems(){
        return this.todoItems;
    }
}
