package de.ls5.wt2.entity;

public enum UserRole 
{
    REGULAR("REGULAR"), 
    ADMIN("ADMIN");
 
    private String userRole;
 
    UserRole(String userRole) {
        this.userRole = userRole;
    }
 
    public String toString() {
        return this.userRole;
    }
}
