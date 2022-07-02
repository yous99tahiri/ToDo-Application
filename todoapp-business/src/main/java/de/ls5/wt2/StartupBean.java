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

        final DBUserAccount dummy1 = this.entityManager.find(DBUserAccount.class, 2L);
        if (dummy1 == null) {
            final DBUserAccount _dummy1 = new DBUserAccount();

            _dummy1.setUsername("dummy1");
            _dummy1.setPassword("dummy1");
            _dummy1.setRegistrationDate(new Date());
            _dummy1.setUserRole(UserRole.REGULAR);

            this.entityManager.persist(_dummy1);
        }

        final DBUserAccount dummy2 = this.entityManager.find(DBUserAccount.class, 3L);
        if (dummy2 == null) {
            final DBUserAccount _dummy2 = new DBUserAccount();

            _dummy2.setUsername("dummy2");
            _dummy2.setPassword("dummy2");
            _dummy2.setRegistrationDate(new Date());
            _dummy2.setUserRole(UserRole.REGULAR);

            this.entityManager.persist(_dummy2);
        }
    }

}
