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
    private Date created;

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public String getUsername() {
        return this.username;
    }

    public String getPassword() {
        return this.password;
    }

    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(iso = ISO.DATE_TIME)
    public Date getCreated() {
        return this.created;
    }

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<DBRole> roles = new HashSet<>();
    public void addRole(DBRole role) {
        this.roles.add(role);
    }
    public Set<DBRole> getRoles (){
        return this.roles ;
    }
    public void setRoles (Set<DBRole> roles ){
        this.roles = roles ;
    }




}
