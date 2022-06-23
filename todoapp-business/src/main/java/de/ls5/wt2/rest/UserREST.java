package de.ls5.wt2.rest;

<<<<<<< HEAD

import de.ls5.wt2.Exception.ResourceNotFoundException;
import de.ls5.wt2.entity.DBToDo;
import de.ls5.wt2.entity.DBUserAccount;
import org.springframework.beans.factory.annotation.Autowired;
=======
import de.ls5.wt2.entity.DBUserAccount;
import de.ls5.wt2.entity.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
>>>>>>> master
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityManager;
<<<<<<< HEAD
=======
import java.util.Date;
>>>>>>> master
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Transactional
@RestController
@RequestMapping(path = "rest/user")
public class UserREST {
<<<<<<< HEAD

    @Autowired
    private EntityManager entityManager;

    @GetMapping("{username}")
    public ResponseEntity<DBUserAccount> getUserByName ( @PathVariable String username) {


        DBUserAccount User = this.entityManager.createQuery(
                        "SELECT u from DBUserAccount u WHERE u.username = :username", DBUserAccount.class).
                setParameter("username", username).getSingleResult();
        if (User == null) {
            throw new ResourceNotFoundException("User with name :  " + username + " could not be found");
        }
        return ResponseEntity.ok(User);
    }

    @DeleteMapping("{username}")
    public ResponseEntity<Map<String, Boolean>> delete(@PathVariable final String username){

        DBUserAccount User = this.entityManager.createQuery(
                        "SELECT u from DBUserAccount u WHERE u.username = :username", DBUserAccount.class).
                setParameter("username", username).getSingleResult();
        if (User == null){
            throw new ResourceNotFoundException("User with the name :  " + username + " could not be delete");
        }
        this.entityManager.remove(User);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }

    @GetMapping(path = "/items" )
    public ResponseEntity<List<DBToDo>> read_user_assigned_items (@RequestBody final String name){

        List <DBToDo> Items = this.entityManager.createQuery(
                        "SELECT u from DBToDo u WHERE u.assignee = :username", DBToDo.class).
                setParameter("username", name).getResultList();

        if (Items.size()==0){
            throw new ResourceNotFoundException(" user with name "+ name + " has no Items ");
        }

        return ResponseEntity.ok(Items);
    }

    @GetMapping(path = "all" )
    public  List <String> read_all_user_names (){

        List <String> Usernames  =this.entityManager.createQuery(
                        "SELECT u.username from DBUserAccount u " ).
                getResultList();
        return Usernames ;

    }


=======
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
>>>>>>> master
}
