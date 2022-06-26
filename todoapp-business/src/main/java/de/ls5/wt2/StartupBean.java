package de.ls5.wt2;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;

import de.ls5.wt2.entity.DBTodoItem;
import de.ls5.wt2.entity.DBTodoItemList;
import de.ls5.wt2.entity.DBUserAccount;
import de.ls5.wt2.entity.ItemState;
import de.ls5.wt2.entity.UserRole;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

@Component
@Transactional
public class StartupBean implements ApplicationListener<ContextRefreshedEvent> {

    @Autowired
    private EntityManager entityManager;

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        
        final DBUserAccount addmin = this.entityManager.find(DBUserAccount.class, 1L);
        if (addmin == null) {
            final DBUserAccount _addmin = new DBUserAccount();

            _addmin.setUsername("admin123");
            _addmin.setPassword("admin123");
            _addmin.setRegistrationDate(new Date());
            _addmin.setUserRole(UserRole.ADMIN.toString());

            this.entityManager.persist(_addmin);
        }

        final DBUserAccount deleteMe = this.entityManager.find(DBUserAccount.class, 2L);
        if (deleteMe == null) {
            final DBUserAccount _deleteMe = new DBUserAccount();

            _deleteMe.setUsername("tuDominator");
            _deleteMe.setPassword("tuDominator");
            _deleteMe.setRegistrationDate(new Date());
            _deleteMe.setUserRole(UserRole.REGULAR.toString());

            this.entityManager.persist(_deleteMe);
        }


        final DBTodoItemList exampleList = this.entityManager.find(DBTodoItemList.class, 1L);
        if (exampleList == null) {
            final DBTodoItemList _exampleList = new DBTodoItemList();

            _exampleList.setTitle("I am an example list Title");
            _exampleList.setDescription("My Description");
            _exampleList.setDeadLine(new Date());
            _exampleList.setLastEdited(new Date());
            _exampleList.setCreator("tuDominator");
            _exampleList.setDBTodoItems(new HashSet<DBTodoItem>());
            this.entityManager.persist(_exampleList);

        }
        final DBTodoItemList exampleList2 = this.entityManager.find(DBTodoItemList.class, 2L);

        if (exampleList2 == null) {
            final DBTodoItemList _exampleList2 = new DBTodoItemList();

            _exampleList2.setTitle("I am an example list Title 2");
            _exampleList2.setDescription("My Description 2");
            _exampleList2.setDeadLine(new Date());
            _exampleList2.setLastEdited(new Date());
            _exampleList2.setCreator("tuDominator2");
            _exampleList2.setDBTodoItems(new HashSet<DBTodoItem>());
            this.entityManager.persist(_exampleList2);
        }
        /*
            final DBTodoItem _item1 = new DBTodoItem();
            _item1.setTitle("Item 1 example");
            _item1.setDescription("Item 1 Description");
            _item1.setDeadLine(new Date());
            _item1.setLastEdited(new Date());
            _item1.setCreator("tuDominator");
            _item1.setAssignee("tuDominator");
            _item1.setListTitle("I am an example list Title");
            _item1.setState(ItemState.OPEN.toString());

            this.entityManager.persist(_item1);

        */
    }

}
