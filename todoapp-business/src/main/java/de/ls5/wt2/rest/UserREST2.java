package de.ls5.wt2.rest;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Order;
import javax.persistence.criteria.Root;

import de.ls5.wt2.conf.auth.permission.ViewFirstFiveNewsItemsPermission;
import de.ls5.wt2.entity.DBTodoItem;
//import de.ls5.wt2.entity.DBTodoItem_;
import de.ls5.wt2.entity.DBTodoItemList;
import de.ls5.wt2.entity.DBUserAccount;
//import de.ls5.wt2.entity.DBUserAccount_;
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
import org.springframework.web.bind.annotation.RequestParam;
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

        if (users == null || users.size() != 0) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        final DBUserAccount acc = new DBUserAccount();
        acc.setUsername(param.getUsername());
        acc.setPassword(param.getPassword());
        acc.setRegistrationDate(new Date());
        acc.setUserRole(UserRole.REGULAR);

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
        DBUserAccount account = this.entityManager.find(DBUserAccount.class, userId);
        if (account == null) { 
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
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
        subject.checkRole(UserRole.ADMIN.toString()); //"admin" ?
        //TODO...implement 
        //set attribute "assignee" of items, that are assigned to given username, to "None"
        //same for attribute "creator" of items and item lists, where creator equals given username
        //delete user with given username
        //...
        DBUserAccount user = this.entityManager.createQuery("SELECT u from DBUserAccount u WHERE u.username = :username ",DBUserAccount.class).
                setParameter("username", username).getSingleResult();
        if (user==null){
            System.out.println("!!!!!!");
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
        //TODO...implement, see AuthNewsREST.java in example06  
        //get all items that have "assignee" = userId/username <-get by id
        //...
        DBUserAccount account = this.entityManager.find(DBUserAccount.class, userId);
        String username = account.getUsername();
        List <DBTodoItem> listItems = this.entityManager.createQuery("SELECT u from DBTodoItem u WHERE u.assignee = :username ",DBTodoItem.class).
                setParameter("username", username).getResultList();
        if (listItems.size()==0){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(listItems,HttpStatus.OK);
    }

    @GetMapping(path = "all",
    produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<String>> readAllUsernames() {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        final CriteriaBuilder builder = this.entityManager.getCriteriaBuilder();
        final CriteriaQuery<DBUserAccount> query = builder.createQuery(DBUserAccount.class);

        final Root<DBUserAccount> from = query.from(DBUserAccount.class);
       // sorry ich muss das nochmal kommentieren bis ich den fehler behoben haben DBUserAccount_ wird nicht erkannt
       // final Order order = builder.desc(from.get(DBUserAccount_.username));

       // query.select(from).orderBy(order);

        final List<String> result = this.entityManager
        .createQuery(query)
        .getResultList()
        .stream()
        .map(DBUserAccount::getUsername)
        .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
