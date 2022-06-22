package de.ls5.wt2.rest;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Order;
import javax.persistence.criteria.Root;

import de.ls5.wt2.conf.auth.permission.ViewFirstFiveNewsItemsPermission;
import de.ls5.wt2.entity.DBTodoItem;
import de.ls5.wt2.entity.DBTodoItem_;
import de.ls5.wt2.entity.DBUserAccount;
import de.ls5.wt2.entity.DBUserAccount_;
import de.ls5.wt2.entity.UserRole;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.Permission;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Transactional
@RestController
@RequestMapping(path = {"rest/user2"})
public class UserREST2 {

    @Autowired
    private EntityManager entityManager;

    @PostMapping(consumes=MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DBUserAccount> createUser(@RequestBody final DBUserAccount param) {
        String username = param.getUsername();
        List<DBUserAccount> users = this.entityManager
            .createQuery(
            "SELECT u from DBUserAccount u WHERE u.username = :username",
                DBUserAccount.class
            )
            .setParameter("username", username)
            .getResultList();

        if (users.size() != 0) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        param.setRegistrationDate(new Date());
        param.setUserRole(UserRole.REGULAR);

        this.entityManager.persist(param);

        param.setPassword("x");

        return new ResponseEntity<>(param, HttpStatus.CREATED);
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DBUserAccount> readUser() {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        final String userId = subject.getPrincipal().toString();
        DBUserAccount account = this.entityManager.find(DBUserAccount.class, userId);
        if (account == null) { 
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        account.setPassword("x");
        return ResponseEntity.ok(account);
    }

    @DeleteMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DBUserAccount> deleteUser(/*TODO get param "username"*/) {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        subject.checkRole(UserRole.ADMIN.toString()); //"admin" ?
        //TODO...implement 
        /*TODO get param "username"*/
        //set attribute "assignee" of items, that are assigned to given username, to "None"
        //same for attribute "creator" of items and item lists, where creator equals given username
        //delete user with given username
        //...
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
    }

    @GetMapping(path = "items",
    produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<DBTodoItem>> readAssignedItems() {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        final String userId = subject.getPrincipal().toString();
        //TODO...implement, see AuthNewsREST.java in example06  
        //get all items that have "assignee" = userId/username <-get by id
        //...
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
    }

    @GetMapping(path = "all",
    produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<String>> readAllUsernames() {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        //TODO...implement, see AuthNewsREST.java in example06  
        //get names of all users
        //...
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
    }
}
