package de.ls5.wt2.rest;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Order;
import javax.persistence.criteria.Root;

import de.ls5.wt2.Exception.ResourceAlreadyExistsException;
import de.ls5.wt2.conf.auth.permission.ViewFirstFiveNewsItemsPermission;
import de.ls5.wt2.entity.DBTodoItem;
import de.ls5.wt2.entity.DBTodoItemList;
//import de.ls5.wt2.entity.DBTodoItemList_;
//import de.ls5.wt2.entity.DBTodoItem_;
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



        //TODO: check if in db an item with param.getTitle() in the SAME LIST (param.getListTitle() !) already exists, 
        //=>return ALREADY_EXISTS
        // yous : select all the items from db with param.getTitel , then checking if one of this  items the same listTitle like param.listTitle has
        String title = param.getTitle();
        List <DBTodoItem> list = this.entityManager.createQuery("SELECT u from DBTodoItem u WHERE  u.title=: title",DBTodoItem.class ).setParameter("title", title).getResultList();
        if(list.size()>0 ){
            for (int i=0; i< list.size();i++){
                if(list.get(i).getListTitle().equals(param.getListTitle())){
                    return  new ResponseEntity<>(param,HttpStatus.CONFLICT) ;
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
        item.setState(ItemState.OPEN);

        this.entityManager.persist(item);

        return new ResponseEntity<>(item, HttpStatus.CREATED);
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
        //... get the TodoItem with the itemTitle = itemTitle(param) , then check if one of this Items the same listTitle have if yes then remove it
        // then remove the item from the Itemlist


        List <DBTodoItem >itemlist = this.entityManager.createQuery("SELECT u from DBTodoItem u WHERE  u.title =: itemTitle",DBTodoItem.class )
                .setParameter("itemTitle",itemTitle).getResultList();
        System.out.println("ssssssss");
        for (int i=0 ; i< itemlist.size();i++) {
            if (itemlist.get(i).getListTitle().equals(listTitle)) {
                DBTodoItemList listitems = this.entityManager.createQuery("SELECT u from DBTodoItemList u WHERE  u.title =: listTitle", DBTodoItemList.class).
                        setParameter("listTitle", listTitle).getSingleResult();
                List<DBTodoItem> list = listitems.getDBTodoItems();
                list.remove(itemlist);
                listitems.setDBTodoItems(list);
                this.entityManager.remove(itemlist.get(i));
                System.out.println("11111111111");
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
        result.setDBTodoItems(param.getDBTodoItems());

        List<DBTodoItem> Itemlist =  new ArrayList<DBTodoItem>();
        for (int i=0 ; i< param.getDBTodoItems().size();i++){
            Itemlist.add(param.getDBTodoItems().get(i));
        }
        result.setDBTodoItems(Itemlist);




        result.setDeadLine(param.getDeadLine());
        result.setLastEdited(param.getLastEdited());
        result.setCreator(param.getCreator());
        this.entityManager.persist(result);
        //TODO...implement, see AuthNewsREST.java in example06
        //TODO how to persist a list of DBTodoItem objects ?!
        /*TODO persist param*/
        //...
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


       // DBTodoItemList list = this.entityManager.find(DBTodoItemList.class, listTitle);
        //TODO: better use ids instead of listTitles, but they should be unique anyway

        // yous: read Itemlist with the listTitle = listTitle(param) from the db
          DBTodoItemList liste =  this.entityManager.createQuery("SELECT u from DBTodoItemList u WHERE  u.title =: listTitle",DBTodoItemList.class)
                  .setParameter("listTitle", listTitle).getSingleResult();
        if (liste == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return  new ResponseEntity<>(liste,HttpStatus.ACCEPTED);
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
        List <DBTodoItem> itemlist = liste.getDBTodoItems();
        for (int i=0;i<itemlist.size();i++){
            this.entityManager.remove(itemlist.get(i));
        }

        this.entityManager.remove(liste);
        return new ResponseEntity<>(liste,HttpStatus.OK);
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

       // kommantar : Order nicht benutzt weil das metamodell bzw DBTodoItemList_ bei mir  nicht erkannt wird
       // final Order order = builder.desc(from.get(DBTodoItemList_.lastEdited));

       // query.select(from).orderBy(order);

        final List<DBTodoItemList> result = this.entityManager.createQuery(query).getResultList();
        return ResponseEntity.ok(result);
    }
}
