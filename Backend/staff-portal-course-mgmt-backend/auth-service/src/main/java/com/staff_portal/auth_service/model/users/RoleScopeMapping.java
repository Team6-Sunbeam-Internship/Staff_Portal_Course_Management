package com.staff_portal.auth_service.model.users;

import lombok.Getter;

import java.util.EnumSet;
import java.util.Set;

@Getter
public enum RoleScopeMapping {
    ADMIN(EnumSet.allOf(ScopeType.class)),

    COURSE_COORDINATOR(EnumSet.of(
            // Full read/write access
            ScopeType.STAFF_READ, ScopeType.STAFF_WRITE,
            ScopeType.MODULE_READ, ScopeType.MODULE_WRITE,
            ScopeType.COURSE_GROUP_READ, ScopeType.COURSE_GROUP_WRITE,
            ScopeType.SCHEDULE_READ, ScopeType.SCHEDULE_WRITE,
            ScopeType.STUDENT_READ, ScopeType.STUDENT_WRITE,
            ScopeType.SESSION_READ, ScopeType.SESSION_WRITE,
            ScopeType.VIDEO_READ, ScopeType.VIDEO_WRITE,
            ScopeType.TIMESHEET_READ, // only read
            ScopeType.PASSWORD_READ, ScopeType.PASSWORD_WRITE,
            ScopeType.PROFILE_READ, ScopeType.PROFILE_WRITE,
            ScopeType.CERTIFICATE_READ, ScopeType.CERTIFICATE_WRITE,

            // Rest of scopes: read-only
            ScopeType.MENUITEM_READ,
            ScopeType.PREMISE_READ,
            ScopeType.BATCHCYCLE_READ,
            ScopeType.INFRASTRUCTURE_READ,
            ScopeType.COURSE_READ,
            ScopeType.SUBJECT_READ,
            ScopeType.TOPIC_READ,
            ScopeType.SECTION_READ
    )),

    GENERAL_USER(EnumSet.of(
            ScopeType.STAFF_READ, ScopeType.STAFF_WRITE,
            ScopeType.SESSION_READ, ScopeType.SESSION_WRITE,
            ScopeType.VIDEO_READ, ScopeType.VIDEO_WRITE,
            ScopeType.TIMESHEET_READ, ScopeType.TIMESHEET_WRITE,
            ScopeType.PROFILE_READ, ScopeType.PROFILE_WRITE,
            ScopeType.PASSWORD_READ, ScopeType.PASSWORD_WRITE
    ));

    private final Set<ScopeType> scopes;

    RoleScopeMapping(Set<ScopeType> scopes) {
        this.scopes = scopes;
    }

}
