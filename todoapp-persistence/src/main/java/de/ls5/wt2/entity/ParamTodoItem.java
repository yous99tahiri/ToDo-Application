package de.ls5.wt2.entity;

import java.util.Date;

public class ParamTodoItem extends DBIdentified {
    private String title;
    private String description;
    private Date lastEdited;
    private Date deadLine;
    private long creator;
    private long assignee;
    private long list;
    private String state = ItemState.OPEN;

    public long getList(){
        return this.list;
    }

    public void setList(long list){
        this.list = list;
    }

    public String getTitle(){
        return this.title;
    }

    public void setTitle(String title){
        this.title = title;
    }

    public String getDescription(){
        return this.description;
    }

    public void setDescription(String description){
        this.description = description;
    }

    public Date getLastEdited() {
        return this.lastEdited;
    }

    public void setLastEdited(Date lastEdited) {
        this.lastEdited = lastEdited;
    }

    public Date getDeadLine() {
        return this.deadLine;
    }

    public void setDeadLine(Date deadLine) {
        this.deadLine = deadLine;
    }

    public long getCreator(){
        return this.creator;
    }

    public void setCreator(long creator){
        this.creator = creator;
    }

    public long getAssignee(){
        return this.assignee;
    }

    public void setAssignee(long assignee){
        this.assignee = assignee;
    }

    public String getState(){
        return this.state;
    }

    public void setState(String state){
        this.state = state;
    }
}
