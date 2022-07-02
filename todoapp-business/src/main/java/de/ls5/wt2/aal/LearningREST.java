package de.ls5.wt2.aal;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import de.ls5.wt2.entity.DBTodoItem;
import de.ls5.wt2.entity.DBTodoItemList;
import de.ls5.wt2.entity.DBUserAccount;
import de.ls5.wt2.entity.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@Transactional
@RestController
@RequestMapping(path = "rest")
public class LearningREST {

    @Autowired
    private EntityManager entityManager;

    @GetMapping(path = "reset",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public void reset() {
        resetDBToDoItem();
        resetDBToDoItemList();
        resetDBUserAccount();
    }

    public void resetDBToDoItem() {
        final CriteriaBuilder builder = this.entityManager.getCriteriaBuilder();
        final CriteriaQuery<DBTodoItem> query = builder.createQuery(DBTodoItem.class);
        final Root<DBTodoItem> from = query.from(DBTodoItem.class);
        query.select(from);

        final List<DBTodoItem> result = this.entityManager.createQuery(query).getResultList();
        for (DBTodoItem res : result) {
            entityManager.remove(res);
        }
    }
    public void resetDBToDoItemList() {
        final CriteriaBuilder builder = this.entityManager.getCriteriaBuilder();
        final CriteriaQuery<DBTodoItemList> query = builder.createQuery(DBTodoItemList.class);
        final Root<DBTodoItemList> from = query.from(DBTodoItemList.class);
        query.select(from);

        final List<DBTodoItemList> result = this.entityManager.createQuery(query).getResultList();
        for (DBTodoItemList res : result) {
            entityManager.remove(res);
        }
    }
    public void resetDBUserAccount() {
        final CriteriaBuilder builder = this.entityManager.getCriteriaBuilder();
        final CriteriaQuery<DBUserAccount> query = builder.createQuery(DBUserAccount.class);
        final Root<DBUserAccount> from = query.from(DBUserAccount.class);
        query.select(from);

        final List<DBUserAccount> result = this.entityManager.createQuery(query).getResultList();
        for (DBUserAccount res : result) {
            entityManager.remove(res);
        }


        final DBUserAccount admin = this.entityManager.find(DBUserAccount.class, 1L);
        if (admin == null) {
            final DBUserAccount _admin = new DBUserAccount();

            _admin.setUsername("admin123");
            _admin.setPassword("admin123");
            _admin.setRegistrationDate(new Date());
            _admin.setUserRole(UserRole.ADMIN);

            this.entityManager.persist(_admin);
        }
    }
}
