package de.ls5.wt2.conf.auth.permission;

import org.apache.shiro.authz.Permission;

public class ReadTodoItemListPermission implements Permission {

    @Override
    public boolean implies(Permission p) {

        if (p instanceof ViewFirstFiveTodoItemListsPermission) {
            final ViewFirstFiveTodoItemListsPermission fnip = (ViewFirstFiveTodoItemListsPermission) p;
            return fnip.check();
        }

        return false;
    }
}
