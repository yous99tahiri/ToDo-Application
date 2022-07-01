package de.ls5.wt2.entity;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.*;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;

@Entity
public class DBUserAccount extends DBIdentified{
    private String username;
    private String password;
    private Date registrationDate;
    private String userRole;

    @OneToMany(targetEntity = DBTodoItemList.class, fetch = FetchType.EAGER, mappedBy = "creator")
    private Set<DBTodoItemList> lists;

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRegistrationDate(Date registrationDate) {
        this.registrationDate = registrationDate;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    public String getUsername() {
        return this.username;
    }

    public String getPassword() {
        return this.password;
    }

    public String getUserRole() {
        return this.userRole;
    }

    public Set<DBTodoItemList> getLists() {
        return this.lists;
    }

    public void setLists(Set<DBTodoItemList> lists) {
        this.lists = lists;
    }

    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(iso = ISO.DATE_TIME)
    public Date getRegistrationDate() {
        return this.registrationDate;
    }
}
