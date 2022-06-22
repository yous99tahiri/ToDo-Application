package de.ls5.wt2.entity;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

import javax.persistence.Entity;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;

@Entity
public class DBTodoItem extends DBIdentified {
    String listTitle= "";
    String title = "";
    String description = "";
    Date lastEdited;
    Date deadLine ;
    String creator= "";
    String assignee = "None";
    ItemState state = ItemState.OPEN;
    
    public String getListTitle(){
        return this.listTitle;
    }

    public void setListTitle(String listTitle){
        this.listTitle = listTitle;
    }

    public String getTitle(){
        return this.description;
    }

    public void setTitle(String description){
        this.description = description;
    }

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

    public String getAssignee(){
        return this.assignee;
    }

    public void setAssignee(String assignee){
        this.assignee = assignee;
    }
    
    public ItemState getState(){
        return this.state;
    }

    public void setState(ItemState state){
        this.state = state;
    }
}
