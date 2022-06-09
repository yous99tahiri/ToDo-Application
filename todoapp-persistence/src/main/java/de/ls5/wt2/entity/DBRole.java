package de.ls5.wt2.entity;
import javax.persistence.*;




    @Entity
    @Table(name = "roles")
    public class DBRole extends DBIdentified{


        @Column(nullable = false, length = 45)
        private String name;

        public DBRole(Long id, String name) {
            this.setId(id);
            this.name = name;
        }

        public DBRole() {
        }

        public DBRole(Long id) {
            this.setId(id);
        }

        public DBRole(String name) {
            this.name = name;
        }


        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }


    }


