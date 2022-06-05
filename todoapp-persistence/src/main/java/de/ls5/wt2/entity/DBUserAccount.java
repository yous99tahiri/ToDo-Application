package de.ls5.wt2.entity;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

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
}
