package de.ls5.wt2.auth;

import de.ls5.wt2.entity.*;
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
import java.util.List;


@Transactional
@RestController
@RequestMapping(path = {"rest/profile"})
public class UserREST {
    @Autowired
    private EntityManager entityManager;

    @PostMapping(
            //path = "create",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<DBUserAccount> createUser(@RequestBody final DBUserAccount param) {
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

        return new ResponseEntity<>(acc, HttpStatus.CREATED);
    }

    @GetMapping(
        path = "auth",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<DBUserAccount> readUser() {
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

        // ToDo: Allow this for the user themselves or for admin

        DBUserAccount account = users.get(0);
        return ResponseEntity.ok(account);
    }

    @DeleteMapping( path = "auth", params = {"username"}, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DBUserAccount> deleteUser(@RequestParam final String username) {
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

        return new ResponseEntity<>(user, HttpStatus.ACCEPTED);
    }

    @GetMapping(path = "auth/items", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<DBTodoItem>> readAssignedItems() {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        final String userId = subject.getPrincipal().toString();

        DBUserAccount account = this.entityManager
                .createQuery("SELECT u from DBUserAccount u WHERE u.username = :userId ", DBUserAccount.class)
                .setParameter("userId", userId)
                .getSingleResult();

        String username = account.getUsername();

        List<DBTodoItem> listItems = this.entityManager
                .createQuery("SELECT u from DBTodoItem u WHERE u.assignee = :username ", DBTodoItem.class)
                .setParameter("username", username)
                .getResultList();

        if (listItems == null) {
            listItems = new ArrayList<DBTodoItem>();
        }

        //it is ok to return empty list, means: no items assigned
        return new ResponseEntity<>(listItems, HttpStatus.OK);
    }

    @GetMapping(path = "auth/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List> readAllUsernames() {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        subject.checkRole(UserRole.ADMIN);

        List<DBUserAccount> result = this.entityManager
                .createQuery("SELECT u.id, u.username from DBUserAccount u")
                .getResultList();

        if (result == null) {
            result = new ArrayList<DBUserAccount>();
        }

        return new ResponseEntity<>(result, HttpStatus.OK);
    }
}
