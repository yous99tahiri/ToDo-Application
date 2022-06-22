package de.ls5.wt2.rest;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Order;
import javax.persistence.criteria.Root;

import de.ls5.wt2.conf.auth.permission.ViewFirstFiveNewsItemsPermission;
import de.ls5.wt2.entity.DBTodoItem;
import de.ls5.wt2.entity.DBTodoItemList;
import de.ls5.wt2.entity.DBTodoItemList_;
import de.ls5.wt2.entity.DBTodoItem_;

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
@RequestMapping(path = {"rest/item2"})
public class ItemREST {

    @Autowired
    private EntityManager entityManager;

    //create,delete item:

    @PostMapping(consumes=MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DBTodoItem> createItem(@RequestBody final DBTodoItem param) {
        
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        final String userId = subject.getPrincipal().toString();
        param.setCreator(userId);
        //TODO...implement
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
    }

    @DeleteMapping(params = {"listTitle","itemTitle"},
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DBTodoItem> deleteItem(@RequestParam final String listTitle,
    @RequestParam final String itemTitle) {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        //TODO...implement
        //...
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
    }

    //create,get,delete itemlist path="/list":

    @PostMapping(path = "list",
    consumes=MediaType.APPLICATION_JSON_VALUE,
    produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DBTodoItemList> createList(@RequestBody final DBTodoItemList param) {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        final String userId = subject.getPrincipal().toString();
        param.setCreator(userId);
        //TODO...implement, see AuthNewsREST.java in example06
        /*TODO persist param*/
        //...
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
    }

    @GetMapping(path = "list",
    params = { "listTitle" }, 
    produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DBTodoItemList> readList(@RequestParam final String listTitle) {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        //TODO...implement, see AuthNewsREST.java in example06
        /*TODO read list with "listTitle"*/
        //...
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
    }

    @DeleteMapping(path = "list",
    params = { "listTitle" }, 
    produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DBTodoItemList> deleteList(@RequestParam final String listTitle) {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        //TODO...implement
        //...
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);
    }

    //get all itemlists path="/list/all"
    @GetMapping(path = "list/all",
    produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<DBTodoItemList>> readAllLists() {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        final CriteriaBuilder builder = this.entityManager.getCriteriaBuilder();
        final CriteriaQuery<DBTodoItemList> query = builder.createQuery(DBTodoItemList.class);

        final Root<DBTodoItemList> from = query.from(DBTodoItemList.class);

        query.select(from);

        final List<DBTodoItemList> result = this.entityManager.createQuery(query).getResultList();
        return ResponseEntity.ok(result);
    }
}
