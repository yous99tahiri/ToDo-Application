package de.ls5.wt2.rest;

import java.util.*;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;

import de.ls5.wt2.Exception.ResourceNotFoundException;
import de.ls5.wt2.entity.*;

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

    public DBUserAccount getByUserById(String userId) {
        DBUserAccount user = this.entityManager.find(DBUserAccount.class, userId);
        //List<DBUserAccount> list = this.entityManager.createQuery("SELECT u from DBUserAccount WHERE u.username=:userId",DBUserAccount.class ).setParameter("userId", userId).getResultList();
        //if(list == null || list.size() != 1) {throw new NoResultException("There is no user with the id " + userId);}
        if(user == null) {
            throw new NoResultException("There is no user with the id " + userId);
        }
        //return list.get(0);
        return user;
    }

    @PostMapping(
        consumes=MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<DBTodoItem> createItem(@RequestBody final ParamTodoItem param) {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        final String userId = subject.getPrincipal().toString();

        final DBTodoItem item = new DBTodoItem();
        item.setCreator(this.getByUserById(userId));
        item.setTitle(param.getTitle());
        item.setList(this.entityManager.find(DBTodoItemList.class, param.getList())); // ToDo: Test this
        item.setDescription(param.getDescription());
        item.setLastEdited(param.getLastEdited());
        item.setDeadLine(param.getDeadLine());
        item.setAssignee(this.entityManager.find(DBUserAccount.class, param.getAssignee()));
        item.setState(ItemState.OPEN);

        this.entityManager.persist(item);

        return new ResponseEntity<>(item, HttpStatus.CREATED);
    }

    @PutMapping(
        consumes=MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<DBTodoItem> updateItem(@RequestBody final DBTodoItem param) {

        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        //falls assignee in param ungleich als assignee in alten item, neu setzen
        //<= dazu assignees account aus db laden, nicht dne aus param nutzen!!
        this.entityManager.refresh(param);
        return ResponseEntity.ok(param);
    }

    @DeleteMapping(
        params = {"listId","itemId"},
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<DBTodoItem> deleteItem(
        @RequestParam final String listId,
        @RequestParam final String itemId
    ) {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List <DBTodoItem> itemlist = this.entityManager
                .createQuery("SELECT u from DBTodoItem u WHERE u.id =: itemId", DBTodoItem.class)
                .setParameter("itemId", itemId)
                .getResultList();

        for (DBTodoItem dbTodoItem : itemlist) {
            if (dbTodoItem.getList().getId() == Long.parseLong(listId)) {
                DBTodoItemList listitems = this.entityManager
                        .createQuery("SELECT u from DBTodoItemList u WHERE u.id =: listId", DBTodoItemList.class)
                        .setParameter("listId", listId)
                        .getSingleResult();

                ArrayList<DBTodoItem> list = new ArrayList<>(listitems.getTodoItems());
                list.remove(dbTodoItem);
                listitems.setTodoItems(list);

                this.entityManager.refresh(listitems);
                this.entityManager.remove(dbTodoItem);

                return new ResponseEntity<>(dbTodoItem, HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping(
        path = "list",
        consumes=MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<DBTodoItemList> createList(@RequestBody final DBTodoItemList param) {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        final String userId = subject.getPrincipal().toString();
        param.setCreator(this.getByUserById(userId));

        String listTitle = param.getTitle();

        List <DBTodoItemList> listitems = this.entityManager
                .createQuery("SELECT u from DBTodoItemList u WHERE u.title =: listTitle",DBTodoItemList.class)
                .setParameter("listTitle",listTitle)
                .getResultList();

        if(listitems.size() > 0){
            return new ResponseEntity<>(param,HttpStatus.CONFLICT);
        }

        DBTodoItemList result = new DBTodoItemList();
        result.setTitle(param.getTitle());
        result.setDescription(param.getDescription());
        result.setTodoItems(new ArrayList<>());
        result.setDeadLine(param.getDeadLine());
        result.setLastEdited(param.getLastEdited());
        result.setCreator(this.getByUserById(userId));
        result.setCreated(new Date());

        this.entityManager.persist(result);

        return new ResponseEntity<>(result,HttpStatus.CREATED);
    }

    @GetMapping(path = "list",
    params = { "listId" },
    produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DBTodoItemList> readList(@RequestParam final String listId) {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        DBTodoItemList list =  this.entityManager.createQuery("SELECT u from DBTodoItemList u WHERE u.id =: listId",DBTodoItemList.class)
                .setParameter("listId", listId).getSingleResult();
        if (list == null) {
            throw  new ResourceNotFoundException(" The list with the id : "+ listId+" is  dont exist");
        }
        return ResponseEntity.ok(list);
    }

    //TODO
    @DeleteMapping(path = "list",
    params = { "listId" },
    produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DBTodoItemList> deleteList(@RequestParam final String listId) {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        DBTodoItemList liste =  this.entityManager.createQuery("SELECT u from DBTodoItemList u WHERE u.id =: listId",DBTodoItemList.class).
                setParameter("listId", listId).getSingleResult();
        if (liste == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        List<DBTodoItem> itemlist = liste.getTodoItems();
        Iterator<DBTodoItem> it = itemlist.iterator();
        while(it.hasNext()) {
                this.entityManager.remove(it.next());
        }

        this.entityManager.remove(liste);
        return new ResponseEntity<>(liste,HttpStatus.OK);
    }

    @GetMapping(path = "list/all",
    produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<DBTodoItemList>> readAllLists() {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        List<DBTodoItemList> lists =  this.entityManager.createQuery("SELECT l FROM DBTodoItemList AS l",DBTodoItemList.class).getResultList();
        if (lists == null){
            lists = new ArrayList<>();
        }

        lists.sort(Comparator.comparing(DBTodoItemList::getCreated));

        return ResponseEntity.ok(lists);
    }
}
