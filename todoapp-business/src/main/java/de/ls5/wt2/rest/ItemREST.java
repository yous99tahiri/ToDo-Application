package de.ls5.wt2.rest;

import java.util.*;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Order;
import javax.persistence.criteria.Root;

import de.ls5.wt2.Exception.ResourceAlreadyExistsException;
import de.ls5.wt2.Exception.ResourceNotFoundException;
import de.ls5.wt2.entity.DBTodoItem;
import de.ls5.wt2.entity.DBTodoItemList;
import de.ls5.wt2.entity.DBTodoItemList_;
import de.ls5.wt2.entity.DBTodoItem_;
import de.ls5.wt2.entity.ItemState;

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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Transactional
@RestController
@RequestMapping(path = {"rest/item"})
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

        String title = param.getTitle();
        List <DBTodoItem> list = this.entityManager.createQuery("SELECT u from DBTodoItem u WHERE  u.title=: title",DBTodoItem.class ).setParameter("title", title).getResultList();
        if(list.size()>0 ){
            for (int i=0; i< list.size();i++){
                if(list.get(i).getListTitle().equals(param.getListTitle())){
                    throw new ResourceAlreadyExistsException("Item with the  Title : "+title
                            +" is already Exists in the List : "+ param.getListTitle() );
                }
            }

        }

        final DBTodoItem item = new DBTodoItem();
        item.setCreator(userId);
        item.setTitle(param.getTitle());
        item.setListTitle(param.getListTitle());
        item.setDescription(param.getDescription());
        item.setLastEdited(param.getLastEdited());
        item.setDeadLine(param.getDeadLine());
        item.setAssignee(param.getAssignee());
        item.setState(ItemState.OPEN.toString());
        // add the item in the  ItemList with the listTitel
        String listTitel= param.getListTitle();
        DBTodoItemList itemlist = this.entityManager.createQuery("SELECT u from DBTodoItemList u WHERE  u.title=: title",DBTodoItemList.class )
                .setParameter("title", listTitel).getSingleResult();
        if (itemlist == null){
            return new ResponseEntity<>(param,HttpStatus.NOT_ACCEPTABLE);
        }
        Set<DBTodoItem> neuitemList = new HashSet<>(itemlist.getDBTodoItems());
        neuitemList.add(item);
        itemlist.setDBTodoItems(neuitemList);
        this.entityManager.refresh(itemlist);
        this.entityManager.persist(item); //TODO maybe first persist item?

        return new ResponseEntity<>(item, HttpStatus.CREATED);
    }

    @PutMapping(consumes=MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DBTodoItem> updateItem(@RequestBody final DBTodoItem param) {
        
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        this.entityManager.refresh(param);
        return ResponseEntity.ok(param);
    }

    @DeleteMapping(params = {"listTitle","itemTitle"},
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DBTodoItem> deleteItem(@RequestParam final String listTitle,
    @RequestParam final String itemTitle) {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List <DBTodoItem >itemlist = this.entityManager.createQuery("SELECT u from DBTodoItem u WHERE  u.title =: itemTitle",DBTodoItem.class )
                .setParameter("itemTitle",itemTitle).getResultList();
        for (int i=0 ; i< itemlist.size();i++) {
            if (itemlist.get(i).getListTitle().equals(listTitle)) {
                DBTodoItemList listitems = this.entityManager.createQuery("SELECT u from DBTodoItemList u WHERE  u.title =: listTitle", DBTodoItemList.class).
                        setParameter("listTitle", listTitle).getSingleResult();
                Set<DBTodoItem> list = new HashSet<>(listitems.getDBTodoItems());
                list.remove(itemlist.get(i));
                listitems.setDBTodoItems(list);
                this.entityManager.refresh(listitems);
                this.entityManager.remove(itemlist.get(i));
                return new ResponseEntity<>(itemlist.get(i), HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
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

        String listTitle = param.getTitle();
        List <DBTodoItemList> listitems = this.entityManager.createQuery("SELECT u from DBTodoItemList u WHERE  u.title =: listTitle",DBTodoItemList.class)
                .setParameter("listTitle",listTitle).getResultList();
        if(listitems.size()>0){
            return new ResponseEntity<>(param,HttpStatus.CONFLICT);
        }
        DBTodoItemList result = new DBTodoItemList();
        result.setTitle(param.getTitle());
        result.setDescription(param.getDescription());
        result.setDBTodoItems(param.getDBTodoItems());
        result.setDeadLine(param.getDeadLine());
        result.setLastEdited(param.getLastEdited());
        result.setCreator(userId);
        this.entityManager.persist(result);
        return new ResponseEntity<>(result,HttpStatus.CREATED);
    }

    @GetMapping(path = "list",
    params = { "listTitle" }, 
    produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DBTodoItemList> readList(@RequestParam final String listTitle) {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        DBTodoItemList list =  this.entityManager.createQuery("SELECT u from DBTodoItemList u WHERE  u.title =: listTitle",DBTodoItemList.class)
                .setParameter("listTitle", listTitle).getSingleResult();
        if (list == null) { 
            throw  new ResourceNotFoundException(" The list with the Titel : "+ listTitle+" is  dont exist");
        }
        return ResponseEntity.ok(list);
    }

    //TODO
    @DeleteMapping(path = "list",
    params = { "listTitle" }, 
    produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DBTodoItemList> deleteList(@RequestParam final String listTitle) {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        DBTodoItemList liste =  this.entityManager.createQuery("SELECT u from DBTodoItemList u WHERE  u.title =: listTitle",DBTodoItemList.class).
                setParameter("listTitle", listTitle).getSingleResult();
        if (liste == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Set <DBTodoItem> itemlist = liste.getDBTodoItems();
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
        final CriteriaBuilder builder = this.entityManager.getCriteriaBuilder();
        final CriteriaQuery<DBTodoItemList> query = builder.createQuery(DBTodoItemList.class);

        final Root<DBTodoItemList> from = query.from(DBTodoItemList.class);

        final Order order = builder.desc(from.get(DBTodoItemList_.lastEdited));

        query.select(from).orderBy(order);

        final List<DBTodoItemList> result = this.entityManager.createQuery(query).getResultList();
        return ResponseEntity.ok(result);
    }
}
