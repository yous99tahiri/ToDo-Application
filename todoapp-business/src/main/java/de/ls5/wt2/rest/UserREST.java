package de.ls5.wt2.rest;

import de.ls5.wt2.entity.DBUserAccount;
import de.ls5.wt2.entity.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Transactional
@RestController
@RequestMapping(path = "rest/user2")
public class UserREST {
    @Autowired
    private EntityManager entityManager;

    @PostMapping(
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Map> create(@RequestBody final DBUserAccount param) {
        String username = param.getUsername();

        List<DBUserAccount> Users = this.entityManager
            .createQuery(
            "SELECT u from DBUserAccount u WHERE u.username = :username",
                DBUserAccount.class
            )
            .setParameter("username", username)
            .getResultList();

        if (Users.size() != 0) {
            return new ResponseEntity<>(new HashMap(), HttpStatus.CONFLICT);
        }

        final DBUserAccount account = new DBUserAccount();

        account.setUsername(param.getUsername());
        account.setPassword(param.getPassword());
        account.setRegistrationDate(new Date());
        account.setUserRole(UserRole.REGULAR);

        this.entityManager.persist(account);

        HashMap response = new HashMap();
        response.put("id", account.getId());
        response.put("username", account.getUsername());

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping(
        path = "{id}",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<HashMap> readAsJSON(@PathVariable("id") final long id) {
        DBUserAccount account = this.entityManager.find(DBUserAccount.class, id);

        HashMap response = new HashMap();
        response.put("id", account.getId());
        response.put("username", account.getUsername());
        response.put("userRole", account.getUserRole());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
