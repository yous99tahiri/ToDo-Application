package de.ls5.wt2.entity;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

import javax.persistence.*;
import java.util.Date;

@Entity
public class DBTodoItem extends DBIdentified {
    private String title;
    private String description;
    private Date lastEdited;
    private Date deadLine;
    private DBUserAccount creator;
    private DBUserAccount assignee;
    private DBTodoItemList list;
    private String state = ItemState.OPEN;

    @ManyToOne(targetEntity = DBTodoItemList.class, fetch = FetchType.EAGER)
    public DBTodoItemList getList(){
        return this.list;
    }

    public void setList(DBTodoItemList list){
        this.list = list;
    }

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

    @ManyToOne(targetEntity = DBUserAccount.class, fetch = FetchType.EAGER, optional = true)
    public DBUserAccount getAssignee(){
        return this.assignee;
    }

    public void setAssignee(DBUserAccount assignee){
        this.assignee = assignee;
    }

    public String getState(){
        return this.state;
    }

    public void setState(String state){
        this.state = state;
    }
}
