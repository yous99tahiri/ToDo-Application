package de.ls5.wt2.rest;

import de.ls5.wt2.entity.DBToDo;
import de.ls5.wt2.entity.DBUserAccount;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import java.util.Date;

@Transactional
@RestController
@RequestMapping(path = "rest/todo")
public class ToDoREST {
    @Autowired
    private EntityManager entityManager;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE,
                 produces = MediaType.APPLICATION_JSON_VALUE)
    public DBToDo create(@RequestBody final DBToDo param) {

        final DBToDo newTodo = new DBToDo();

        newTodo.setHeadline(param.getHeadline());
        newTodo.setContent(param.getContent());
        newTodo.setCompleted(false);
        newTodo.setCreatedOn(new Date());

        this.entityManager.persist(newTodo);

        return newTodo;
    }

    @GetMapping(path = "{id}",
                consumes = MediaType.TEXT_PLAIN_VALUE,
                produces = MediaType.APPLICATION_JSON_VALUE)
    public DBToDo readAsJSON(@PathVariable("id") final long id) {
        return this.entityManager.find(DBToDo.class, id);
    }

    @DeleteMapping(path = "{id}",
            consumes = MediaType.TEXT_PLAIN_VALUE,
            produces = MediaType.TEXT_PLAIN_VALUE)
    public void deleteToDo(@PathVariable("id") final long id) {
        this.entityManager.remove(this.entityManager.find(DBToDo.class, id));
    }

    @PutMapping(path = "{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public DBToDo readAsJSON(@PathVariable("id") final long id, @RequestBody final DBToDo param) {
        final DBToDo elem = this.entityManager.find(DBToDo.class, id);

        elem.setHeadline(param.getHeadline());
        elem.setContent(param.getContent());
        elem.setCompleted(param.getCompleted());

        this.entityManager.persist(elem);
        return elem;
    }
}
