package de.ls5.wt2.rest;

import java.util.*;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Order;
import javax.persistence.criteria.Root;

import de.ls5.wt2.Exception.ResourceAlreadyExistsException;
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

        //TODO: check if in db an item with param.getTitle() in the SAME LIST (param.getListTitle() !) already exists, 
        //=>return ALREADY_EXISTS
        // muss nicht diese Item auch in der TitleList hinzugefügt werden ?

        String title = param.getTitle();
        List <DBTodoItem> list = this.entityManager.createQuery("SELECT u from DBTodoItem u WHERE  u.title=: title",DBTodoItem.class ).setParameter("title", title).getResultList();
        if(list.size()>0 ){
            for (int i=0; i< list.size();i++){
                if(list.get(i).getListTitle().equals(param.getListTitle())){
                    throw new ResourceAlreadyExistsException("Item with the  Title "+title + " and the ListTitle  "+
                            param.getListTitle()+" is already Exists" );
                }
            }

        }
        // TODO done
        final DBTodoItem item = new DBTodoItem();
        item.setCreator(userId);
        item.setTitle(param.getTitle());
        item.setListTitle(param.getListTitle());
        item.setDescription(param.getDescription());
        item.setLastEdited(param.getLastEdited());
        item.setDeadLine(param.getDeadLine());
        item.setAssignee(param.getAssignee());
        item.setState(ItemState.OPEN.toString());

        this.entityManager.persist(item);

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

    //TODO
    @DeleteMapping(params = {"listTitle","itemTitle"},
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DBTodoItem> deleteItem(@RequestParam final String listTitle,
    @RequestParam final String itemTitle) {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        //TODO...implement

        //... kann jeder eine Item löschen ?
        List <DBTodoItem >itemlist = this.entityManager.createQuery("SELECT u from DBTodoItem u WHERE  u.title =: itemTitle",DBTodoItem.class )
                .setParameter("itemTitle",itemTitle).getResultList();
        for (int i=0 ; i< itemlist.size();i++) {
            if (itemlist.get(i).getListTitle().equals(listTitle)) {
                DBTodoItemList listitems = this.entityManager.createQuery("SELECT u from DBTodoItemList u WHERE  u.title =: listTitle", DBTodoItemList.class).
                        setParameter("listTitle", listTitle).getSingleResult();
                Set<DBTodoItem> list = listitems.getDBTodoItems();
                list.remove(itemlist);
                listitems.setDBTodoItems(list);
                this.entityManager.remove(itemlist.get(i));
                return new ResponseEntity<>(itemlist.get(i), HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        //TODO done
    }

    //create,get,delete itemlist path="/list":

    //TODO
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
        //TODO how to persist a list of DBTodoItem objects ?!
        /*TODO persist param*/
        //...
        // cheching in the db if a Itemlist with the same Title
        String listTitle = param.getTitle();
        List <DBTodoItemList> listitems = this.entityManager.createQuery("SELECT u from DBTodoItemList u WHERE  u.title =: listTitle",DBTodoItemList.class)
                .setParameter("listTitle",listTitle).getResultList();
        if(listitems.size()>0){
            return new ResponseEntity<>(param,HttpStatus.CONFLICT);
        }
        DBTodoItemList result = new DBTodoItemList();
        result.setTitle(param.getTitle());
        result.setDescription(param.getDescription());
        Set<DBTodoItem> Itemlist =  new HashSet<>(param.getDBTodoItems()) ;
        result.setDBTodoItems(Itemlist);
        result.setDeadLine(param.getDeadLine());
        result.setLastEdited(param.getLastEdited());
        result.setCreator(userId);
        this.entityManager.persist(result);
        return new ResponseEntity<>(HttpStatus.CREATED);
        //TODO done
    }

    //TODO fix? maybe will not work because listTitle != id, id can be send from client so just change param to id
    @GetMapping(path = "list",
    params = { "listTitle" }, 
    produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DBTodoItemList> readList(@RequestParam final String listTitle) {
        final Subject subject = SecurityUtils.getSubject();
        if (subject == null || !subject.isAuthenticated()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        //DBTodoItemList list = this.entityManager.find(DBTodoItemList.class, listTitle);
        //TODO: better use ids instead of listTitles, but they should be unique anyway
        // yous: read Itemlist with the listTitle = listTitle(param) from the db
        DBTodoItemList list =  this.entityManager.createQuery("SELECT u from DBTodoItemList u WHERE  u.title =: listTitle",DBTodoItemList.class)
                .setParameter("listTitle", listTitle).getSingleResult();
        if (list == null) { 
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(list);
        //TODO done
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
        //TODO...implement
        //...
        // select the Itemlist with the listTitle=listTitle(param) then remove it
        DBTodoItemList liste =  this.entityManager.createQuery("SELECT u from DBTodoItemList u WHERE  u.title =: listTitle",DBTodoItemList.class).
                setParameter("listTitle", listTitle).getSingleResult();
        if (liste == null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        // alle items in this List loeschen ?
        Set <DBTodoItem> itemlist = liste.getDBTodoItems();
        Iterator it = itemlist.iterator();
        while(it.hasNext()) {
                this.entityManager.remove(it.next());
        }
        // remove the list
        this.entityManager.remove(liste);
        return new ResponseEntity<>(liste,HttpStatus.OK);
        //TODO done
    }

    //TODO fix
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

        final Order order = builder.desc(from.get(DBTodoItemList_.lastEdited));

        query.select(from).orderBy(order);

        final List<DBTodoItemList> result = this.entityManager.createQuery(query).getResultList();
        return ResponseEntity.ok(result);
    }
}
