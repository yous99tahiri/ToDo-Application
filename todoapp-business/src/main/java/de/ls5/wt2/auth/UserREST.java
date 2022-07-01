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
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Order;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Transactional
@RestController
@RequestMapping(path = {"rest/auth/profile"})
public class UserREST {
    @Autowired
    private EntityManager entityManager;

    @GetMapping(produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<?> getProfile() {

        final Subject subject = SecurityUtils.getSubject();

        if (!subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        return ResponseEntity.ok(subject.getPrincipal().toString());
    }

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

        if (users == null || users.size() != 0) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        final DBUserAccount acc = new DBUserAccount();
        acc.setUsername(param.getUsername());
        acc.setPassword(param.getPassword());
        acc.setRegistrationDate(new Date());
        acc.setUserRole(UserRole.REGULAR.toString());

        this.entityManager.persist(acc);

        acc.setPassword("x");

        return new ResponseEntity<>(acc, HttpStatus.CREATED);
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DBUserAccount> readUser() {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        final String userId = subject.getPrincipal().toString();
        List<DBUserAccount> users = this.entityManager
                .createQuery(
                        "SELECT u from DBUserAccount u WHERE u.username = :username",
                        DBUserAccount.class
                )
                .setParameter("username", userId)
                .getResultList();

        if (users == null || users.size() != 1) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        DBUserAccount account = users.get(0);
        account.setPassword("x");
        return ResponseEntity.ok(account);
    }

    @DeleteMapping(params = { "username" },
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DBUserAccount> deleteUser(@RequestParam final String username) {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        subject.checkRole(UserRole.ADMIN.toString());

//        subject.checkRole("admin");

        DBUserAccount user = this.entityManager.createQuery("SELECT u from DBUserAccount u WHERE u.username = :username ",DBUserAccount.class)
                .setParameter("username", username)
                .getSingleResult();
        if (user==null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        List<DBTodoItem> itemassi = this.entityManager.createQuery("SELECT u from DBTodoItem u WHERE u.assignee = :username ",DBTodoItem.class).
                setParameter("username", username).getResultList();
        for (int i=0 ; i<itemassi.size();i++) {
            itemassi.get(i).setAssignee("None");
        }
        List<DBTodoItem> itemcre = this.entityManager.createQuery("SELECT u from DBTodoItem u WHERE u.creator = :username ",DBTodoItem.class).
                setParameter("username", username).getResultList();
        for (int j=0 ; j<itemcre.size();j++) {
            itemcre.get(j).setCreator("None");
        }
        List<DBTodoItemList> itemlistcre = this.entityManager.createQuery("SELECT u from DBTodoItemList u WHERE u.creator = :username ",DBTodoItemList.class).
                setParameter("username", username).getResultList();
        for (int z=0 ; z<itemlistcre.size();z++) {
            itemlistcre.get(z).setCreator("None");
        }
        this.entityManager.remove(user);
        return new ResponseEntity<>(user,HttpStatus.ACCEPTED);
    }

    @GetMapping(path = "items",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<DBTodoItem>> readAssignedItems() {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        final String userId = subject.getPrincipal().toString();

        DBUserAccount account = this.entityManager.createQuery("SELECT u from DBUserAccount u WHERE u.username = :userId ",DBUserAccount.class).
                setParameter("userId",userId ).getSingleResult();
        String username = account.getUsername();
        List <DBTodoItem> listItems = this.entityManager.createQuery("SELECT u from DBTodoItem u WHERE u.assignee = :username ",DBTodoItem.class).
                setParameter("username", username).getResultList();
        if (listItems == null){
            listItems = new ArrayList<DBTodoItem>();
        }

        //it is ok to return empty list, means: no items assigned
        return new ResponseEntity<>(listItems,HttpStatus.OK);

    }

    @GetMapping(path = "all",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<String>> readAllUsernames() {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        subject.checkRole(UserRole.ADMIN.toString());

        final CriteriaBuilder builder = this.entityManager.getCriteriaBuilder();
        final CriteriaQuery<DBUserAccount> query = builder.createQuery(DBUserAccount.class);

        final Root<DBUserAccount> from = query.from(DBUserAccount.class);

        final Order order = builder.desc(from.get(DBUserAccount_.username));

        query.select(from).orderBy(order);

        final List<String> result = this.entityManager
                .createQuery(query)
                .getResultList()
                .stream()
                .map(DBUserAccount::getUsername)
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}