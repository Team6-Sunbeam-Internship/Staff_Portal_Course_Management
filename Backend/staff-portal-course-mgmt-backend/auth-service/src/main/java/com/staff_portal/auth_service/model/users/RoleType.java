package com.staff_portal.auth_service.model.users;

import lombok.Getter;

@Getter
public enum RoleType {
    ADMIN("Administrator with full system access"),
    COURSE_COORDINATOR("Course coordinator with academic management access"),
    GENERAL_USER("General user with basic access");
    
    private final String description;
    
    RoleType(String description) {
        this.description = description;
    }

}