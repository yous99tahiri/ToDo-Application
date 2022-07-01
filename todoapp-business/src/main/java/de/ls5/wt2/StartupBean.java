package de.ls5.wt2;

import java.util.Date;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;

import de.ls5.wt2.entity.DBUserAccount;
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
