package de.ls5.wt2.conf.auth.permission;

import java.util.List;

import de.ls5.wt2.entity.DBTodoItemList;
import org.apache.shiro.authz.Permission;

public class ViewFirstFiveTodoItemListsPermission implements Permission {

    private final List<DBTodoItemList> lists;

    public ViewFirstFiveTodoItemListsPermission(final List<DBTodoItemList> lists) {
        this.lists = lists;
    }

    @Override
    public boolean implies(Permission p) {
        return false;
    }

    public boolean check() {
        return this.lists.size() < 5;
    }
}
