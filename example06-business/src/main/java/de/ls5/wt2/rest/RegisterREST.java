package de.ls5.wt2.rest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import de.ls5.wt2.entity.DBUserAccount;

import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Date;

import javax.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Transactional
@RestController
@RequestMapping(path = "rest/register")
//if above does not work try this:
//@RequestMapping(path = {"rest/auth/session/register", "rest/auth/basic/register", "rest/auth/jwt/register"})
public class RegisterREST {
    @Autowired
    private EntityManager entityManager;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE,
                 produces = MediaType.APPLICATION_JSON_VALUE)
    public DBUserAccount create(@RequestBody final DBUserAccount param) {

        final DBUserAccount news = new DBUserAccount();

        news.setUsername(param.getUsername());
        news.setPassword(param.getPassword());
        news.setCreated(new Date());

        this.entityManager.persist(news);

        return news;
    }

    @GetMapping(path = "{id}",
                consumes = MediaType.TEXT_PLAIN_VALUE,
                produces = MediaType.APPLICATION_JSON_VALUE)
    public DBUserAccount readAsJSON(@PathVariable("id") final long id) {
        return this.entityManager.find(DBUserAccount.class, id);
    }
}
