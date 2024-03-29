package de.ls5.wt2.conf.auth;

import java.util.*;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;

import de.ls5.wt2.conf.auth.permission.ReadTodoItemListPermission;
import de.ls5.wt2.entity.DBTodoItemList;
import de.ls5.wt2.entity.DBUserAccount;
import de.ls5.wt2.entity.UserRole;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAccount;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.Permission;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.realm.Realm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.SimplePrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;

public class WT2Realm extends AuthorizingRealm implements Realm {

    final static String REALM = "WT2";

    @Autowired
    private EntityManager entityManager;

    public DBUserAccount getByUserByName(String username) {

        DBUserAccount user = this.entityManager
                .createQuery("SELECT u from DBUserAccount u WHERE  u.username =: username", DBUserAccount.class)
                .setParameter("username", username)
                .getSingleResult();

        if(user == null) {
            throw new NoResultException("There is no user with the name " + username);
        }

        return user;
    }


    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        final String username = token.getPrincipal().toString();

        if(username.isEmpty()) {
            throw new AuthenticationException();
        }

        DBUserAccount user = getByUserByName(username);

        System.out.println(username);

        SimplePrincipalCollection principalCollection = new SimplePrincipalCollection();

        principalCollection.add(username, WT2Realm.REALM);
        principalCollection.add("role:" + user.getUserRole(), WT2Realm.REALM);

        return new SimpleAccount(principalCollection, user.getPassword(), WT2Realm.REALM);
    }

    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        return new AuthorizationInfo() {
            @Override
            public Collection<String> getRoles() {
                if (("role:" + UserRole.ADMIN).equals(principals.asList().get(1).toString())) {
                    System.out.println("Getting Roles");
                    return Collections.singleton(UserRole.ADMIN);
                }

                return Collections.emptyList();
            }

            @Override
            public Collection<String> getStringPermissions() {
                return Collections.emptyList();
            }

            @Override
            public Collection<Permission> getObjectPermissions() {
                return Collections.singleton(new ReadTodoItemListPermission());
            }
        };
    }
}
