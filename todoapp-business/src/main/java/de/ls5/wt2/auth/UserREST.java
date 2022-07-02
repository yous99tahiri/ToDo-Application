package de.ls5.wt2.auth;

import de.ls5.wt2.entity.*;
import de.ls5.wt2.representations.RepTodoItem;
import de.ls5.wt2.representations.RepUserAccount;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;


@Transactional
@RestController
@RequestMapping(path = {"rest/profile"})
public class UserREST {
    @Autowired
    private EntityManager entityManager;

    @GetMapping(path = "auth/items", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<RepTodoItem>> readAssignedItems() {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        final String userId = subject.getPrincipal().toString();

        DBUserAccount account = this.entityManager
                .createQuery("SELECT u from DBUserAccount u WHERE u.username = :userId ", DBUserAccount.class)
                .setParameter("userId", userId)
                .getSingleResult();

        List<DBTodoItem> listItems = this.entityManager
                .createQuery("SELECT u from DBTodoItem u WHERE u.assignee = :account ", DBTodoItem.class)
                .setParameter("account", account)
                .getResultList();

        if (listItems == null) {
            listItems = new ArrayList<>();
        }

        ArrayList<RepTodoItem> result = new ArrayList<>();

        for (DBTodoItem item : listItems) {
            result.add(new RepTodoItem(item));
        }

        //it is ok to return empty list, means: no items assigned
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping(path = "auth/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List> readAllUsernames() {
        final Subject subject = SecurityUtils.getSubject();

        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        subject.checkRole(UserRole.ADMIN);

        List accounts = this.entityManager
                .createQuery("SELECT u.id, u.username from DBUserAccount u")
                .getResultList();

        if (accounts == null) {
            accounts = new ArrayList<>();
        }

        return new ResponseEntity<>(accounts, HttpStatus.OK);
    }

    @PostMapping(
            //path = "create",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<RepUserAccount> createUser(@RequestBody final DBUserAccount param) {
        String username = param.getUsername();

        List<DBUserAccount> users = this.entityManager
                .createQuery("SELECT u FROM DBUserAccount u WHERE u.username = :username", DBUserAccount.class)
                .setParameter("username", username)
                .getResultList();

        if (users == null || users.size() != 0) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        final DBUserAccount acc = new DBUserAccount();
        acc.setUsername(param.getUsername());
        acc.setPassword(param.getPassword());
        acc.setRegistrationDate(new Date());
        acc.setUserRole(UserRole.REGULAR);

        this.entityManager.persist(acc);

        acc.setPassword("REDACTED");

        return new ResponseEntity<>(new RepUserAccount(acc), HttpStatus.CREATED);
    }

    @GetMapping(
        path = "auth",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<RepUserAccount> readUser() {
        final Subject subject = SecurityUtils.getSubject();

        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        final String userId = subject.getPrincipal().toString();
        List<DBUserAccount> users = this.entityManager
                .createQuery("SELECT u from DBUserAccount u WHERE u.username = :username", DBUserAccount.class)
                .setParameter("username", userId)
                .getResultList();

        if (users == null || users.size() != 1) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        DBUserAccount account = users.get(0);

        account.setPassword("REDACTED");

        return ResponseEntity.ok(new RepUserAccount(account));
    }

    @DeleteMapping( path = "auth", params = {"username"}, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RepUserAccount> deleteUser(@RequestParam final String username) {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        subject.checkRole(UserRole.ADMIN);

        DBUserAccount user = this.entityManager
                .createQuery("SELECT u from DBUserAccount u WHERE u.username = :username ", DBUserAccount.class)
                .setParameter("username", username)
                .getSingleResult();

        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        List<DBTodoItem> itemassi = this.entityManager
                .createQuery("SELECT u from DBTodoItem u WHERE u.assignee = :username ", DBTodoItem.class)
                .setParameter("username", username)
                .getResultList();

        for (DBTodoItem dbTodoItem : itemassi) {
            dbTodoItem.setAssignee(null);
        }

        List<DBTodoItem> itemcre = this.entityManager
                .createQuery("SELECT u from DBTodoItem u WHERE u.creator = :username ", DBTodoItem.class)
                .setParameter("username", username)
                .getResultList();

        List<DBTodoItemList> itemlistcre = this.entityManager
                .createQuery("SELECT u from DBTodoItemList u WHERE u.creator = :username ", DBTodoItemList.class)
                .setParameter("username", username)
                .getResultList();

        this.entityManager.remove(user);
        this.entityManager.remove(itemcre);
        this.entityManager.remove(itemlistcre);

        return new ResponseEntity<>(new RepUserAccount(user), HttpStatus.ACCEPTED);
    }
}
