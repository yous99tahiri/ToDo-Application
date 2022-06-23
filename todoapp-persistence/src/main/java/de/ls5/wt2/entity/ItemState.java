package de.ls5.wt2.entity;

public enum ItemState 
{
    OPEN("OPEN"), 
    IN_PROGRESS("IN_PROGRESS"), 
    FEEDBACK("FEEDBACK"), 
    DONE("DONE");
 
    private String stateStr;
 
    ItemState(String stateStr) {
        this.stateStr = stateStr;
    }
 
    public String toString() {
        return this.stateStr;
    }
}
