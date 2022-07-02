package de.ls5.wt2.representations;

import de.ls5.wt2.entity.DBTodoItemList;
import de.ls5.wt2.entity.DBUserAccount;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class RepUserAccount {
    public final long id;
    public final String username;
    public final Date registrationDate;
    public final String userRole;
    public final List<Long> lists;

    public RepUserAccount(DBUserAccount dbUserAccount) {
        this.id = dbUserAccount.getId();
        this.username = dbUserAccount.getUsername();
        this.registrationDate = dbUserAccount.getRegistrationDate();
        this.userRole = dbUserAccount.getUserRole();
        this.lists = new ArrayList<>();

        for(DBTodoItemList dbTodoItemList : dbUserAccount.getLists()) {
            this.lists.add(dbTodoItemList.getId());
        }
    }
}
