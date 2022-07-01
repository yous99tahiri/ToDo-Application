package de.ls5.wt2.aal;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import de.ls5.wt2.entity.DBTodoItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// ToDo: Reset everything

@Transactional
@RestController
@RequestMapping(path = "rest")
public class LearningREST {

    @Autowired
    private EntityManager entityManager;

    @GetMapping(path = "reset",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public void reset() {
        final CriteriaBuilder builder = this.entityManager.getCriteriaBuilder();
        final CriteriaQuery<DBTodoItem> query = builder.createQuery(DBTodoItem.class);
        final Root<DBTodoItem> from = query.from(DBTodoItem.class);
        query.select(from);

        final List<DBTodoItem> result = this.entityManager.createQuery(query).getResultList();
        for (DBTodoItem res : result) {
            entityManager.remove(res);
        }
    }
}
