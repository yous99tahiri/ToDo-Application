package de.ls5.wt2.rest;

import java.util.*;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;

import de.ls5.wt2.Exception.ResourceNotFoundException;
import de.ls5.wt2.entity.*;

import de.ls5.wt2.representations.RepTodoItem;
import de.ls5.wt2.representations.RepTodoItemList;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Transactional
@RestController
@RequestMapping(path = {"rest/item/auth"})
public class ItemREST {
    @Autowired
    private EntityManager entityManager;

    public DBUserAccount getUserByName(String username) {
        DBUserAccount user = this.entityManager
            .createQuery("SELECT u from DBUserAccount u WHERE u.username =: username", DBUserAccount.class)
            .setParameter("username", username)
            .getSingleResult();

        if(user == null) {
            throw new NoResultException("There is no user with the name " + username);
        }

        return user;
    }

    @PostMapping(
        consumes=MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<RepTodoItem> createItem(@RequestBody final ParamTodoItem param) {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        final String username = subject.getPrincipal().toString();

        final DBTodoItem item = new DBTodoItem();
        item.setCreator(this.getUserByName(username));
        item.setTitle(param.getTitle());
        item.setList(this.entityManager.find(DBTodoItemList.class, param.getList())); // ToDo: Test this
        item.setDescription(param.getDescription());
        item.setLastEdited(param.getLastEdited());
        item.setDeadLine(param.getDeadLine());
        item.setAssignee(this.entityManager.find(DBUserAccount.class, param.getAssignee()));
        item.setState(ItemState.OPEN);

        this.entityManager.persist(item);

        return new ResponseEntity<>(new RepTodoItem(item), HttpStatus.CREATED);
    }

    @PutMapping(
        consumes=MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<RepTodoItem> updateItem(@RequestBody final ParamTodoItem param) {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        if(!subject.getPrincipals().asList().get(1).equals("role:admin")) {
            if(!subject.getPrincipals().getPrimaryPrincipal().equals(subject.getPrincipal())) {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
        }

        DBTodoItem oldItem = this.entityManager
                .createQuery("SELECT u from DBTodoItem u WHERE u.id =: id", DBTodoItem.class)
                .setParameter("id", param.getId())
                .getSingleResult();

        oldItem.setTitle(param.getTitle());
        oldItem.setDescription(param.getDescription());
        oldItem.setDeadLine(param.getDeadLine());
        oldItem.setAssignee(this.entityManager.find(DBUserAccount.class, param.getAssignee()));
        oldItem.setState(param.getState());
        oldItem.setLastEdited(new Date());

        //falls assignee in param ungleich als assignee in alten item, neu setzen
        //<= dazu assignees account aus db laden, nicht dne aus param nutzen!!
        this.entityManager.persist(oldItem);

        return ResponseEntity.ok(new RepTodoItem(oldItem));
    }

    @DeleteMapping(
        params = {"listId","itemId"},
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<RepTodoItem> deleteItem(
        @RequestParam final String listId,
        @RequestParam final String itemId
    ) {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List <DBTodoItem> itemlist = this.entityManager
                .createQuery("SELECT u from DBTodoItem u WHERE u.id =: itemId", DBTodoItem.class)
                .setParameter("itemId", Long.parseLong(itemId))
                .getResultList();

        for (DBTodoItem dbTodoItem : itemlist) {
            if (dbTodoItem.getList().getId() == Long.parseLong(listId)) {
                DBTodoItemList listitems = this.entityManager
                        .createQuery("SELECT u from DBTodoItemList u WHERE u.id =: listId", DBTodoItemList.class)
                        .setParameter("listId", Long.parseLong(listId))
                        .getSingleResult();

                ArrayList<DBTodoItem> list = new ArrayList<>(listitems.getTodoItems());
                list.remove(dbTodoItem);
                listitems.setTodoItems(list);

                this.entityManager.refresh(listitems);
                this.entityManager.remove(dbTodoItem);

                return new ResponseEntity<>(new RepTodoItem(dbTodoItem), HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping(
        path = "list",
        consumes=MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<RepTodoItemList> createList(@RequestBody final DBTodoItemList param) {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        final String username = subject.getPrincipal().toString();
        param.setCreator(this.getUserByName(username));

        String listTitle = param.getTitle();

        List <DBTodoItemList> listitems = this.entityManager
                .createQuery("SELECT u from DBTodoItemList u WHERE u.title =: listTitle",DBTodoItemList.class)
                .setParameter("listTitle",listTitle)
                .getResultList();

        if(listitems.size() > 0){
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        DBTodoItemList result = new DBTodoItemList();
        result.setTitle(param.getTitle());
        result.setDescription(param.getDescription());
        result.setTodoItems(new ArrayList<>());
        result.setDeadLine(param.getDeadLine());
        result.setLastEdited(param.getLastEdited());
        result.setCreator(this.getUserByName(username));
        result.setCreated(new Date());

        this.entityManager.persist(result);

        return new ResponseEntity<>(new RepTodoItemList(result), HttpStatus.CREATED);
    }

    @GetMapping(path = "list",
    params = { "listId" },
    produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RepTodoItemList> readList(@RequestParam final String listId) {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        DBTodoItemList list =  this.entityManager.createQuery("SELECT u from DBTodoItemList u WHERE u.id =: listId",DBTodoItemList.class)
                .setParameter("listId", listId).getSingleResult();
        if (list == null) {
            throw  new ResourceNotFoundException(" The list with the id : "+ listId+" is  dont exist");
        }
        return ResponseEntity.ok(new RepTodoItemList(list));
    }

    @DeleteMapping(path = "list",
    params = { "listId" },
    produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RepTodoItemList> deleteList(@RequestParam final String listId) {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        DBTodoItemList liste =  this.entityManager.createQuery("SELECT u from DBTodoItemList u WHERE u.id =: listId",DBTodoItemList.class).
                setParameter("listId", Long.parseLong(listId)).getSingleResult();
        if (liste == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        List<DBTodoItem> itemlist = liste.getTodoItems();

        for (DBTodoItem dbTodoItem : itemlist) {
            this.entityManager.remove(dbTodoItem);
        }

        this.entityManager.remove(liste);
        return new ResponseEntity<>(new RepTodoItemList(liste), HttpStatus.OK);
    }

    @GetMapping(path = "list/all",
    produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<RepTodoItemList>> readAllLists() {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        List<DBTodoItemList> lists =  this.entityManager.createQuery("SELECT l FROM DBTodoItemList AS l",DBTodoItemList.class).getResultList();
        if (lists == null){
            lists = new ArrayList<>();
        }

        lists.sort(Comparator.comparing(DBTodoItemList::getCreated));

        ArrayList<RepTodoItemList> results = new ArrayList<>();

        for(DBTodoItemList list : lists) {
            results.add(new RepTodoItemList(list));
        }

        return ResponseEntity.ok(results);
    }
}
