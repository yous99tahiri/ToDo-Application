package de.ls5.wt2.rest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RestController;

import de.ls5.wt2.entity.DBUserAccount;

import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Transactional
@RestController
@RequestMapping(path = "rest/user")
public class UserREST {
    @Autowired
    private EntityManager entityManager;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE,
                 produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map> create(@RequestBody final DBUserAccount param) {


        String username = param.getUsername();


           List<DBUserAccount> Users = this.entityManager.createQuery(
                            "SELECT u from DBUserAccount u WHERE u.username = :username", DBUserAccount.class).
                    setParameter("username", username).getResultList();
        if (Users.size() != 0) {
            return new ResponseEntity<>(new HashMap(), HttpStatus.CONFLICT);
        }

        final DBUserAccount account = new DBUserAccount();

        account.setUsername(param.getUsername());
        account.setPassword(param.getPassword());
        account.setRegistrationDate(new Date());

        this.entityManager.persist(account);

        HashMap response = new HashMap();
        response.put("id", account.getId());
        response.put("username", account.getUsername());

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping(path = "{id}",
                consumes = MediaType.TEXT_PLAIN_VALUE,
                produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<HashMap> readAsJSON(@PathVariable("id") final long id) {
        // ToDo: Do not return the password here
        DBUserAccount account = this.entityManager.find(DBUserAccount.class, id);

        HashMap response = new HashMap();
        response.put("id", account.getId());
        response.put("username", account.getUsername());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
