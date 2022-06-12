package de.ls5.wt2.rest;
import de.ls5.wt2.Exception.ResourceAlreadyExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import de.ls5.wt2.entity.DBUserAccount;

import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Date;
import java.util.List;

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
public class RegisterREST {
    @Autowired
    private EntityManager entityManager;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE,
                 produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DBUserAccount> create(@RequestBody final DBUserAccount param) {


        String username = param.getUsername();


           List<DBUserAccount> Users = this.entityManager.createQuery(
                            "SELECT u from DBUserAccount u WHERE u.username = :username", DBUserAccount.class).
                    setParameter("username", username).getResultList();
        if (Users.size() != 0) {
            return  new ResponseEntity<>(param, HttpStatus.CONFLICT);
        }

        final DBUserAccount account = new DBUserAccount();

        account.setUsername(param.getUsername());
        account.setPassword(param.getPassword());
        account.setRegistrationDate(new Date());

        this.entityManager.persist(account);

        return  new ResponseEntity<>(account, HttpStatus.CREATED);

    }

    @GetMapping(path = "{id}",
                consumes = MediaType.TEXT_PLAIN_VALUE,
                produces = MediaType.APPLICATION_JSON_VALUE)
    public DBUserAccount readAsJSON(@PathVariable("id") final long id) {
        return this.entityManager.find(DBUserAccount.class, id);
    }
}
