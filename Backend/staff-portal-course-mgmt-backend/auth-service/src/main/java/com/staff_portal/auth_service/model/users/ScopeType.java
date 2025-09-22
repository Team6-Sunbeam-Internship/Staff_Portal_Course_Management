package com.staff_portal.auth_service.model.users;

import lombok.Getter;
@Getter
public enum ScopeType {
    STAFF_READ("Read staff information"),
    STAFF_WRITE("Create or update staff information"),

    STUDENT_READ("Read student information"),
    STUDENT_WRITE( "Create or update student information"),

    MENUITEM_READ( "Read menu items"),
    MENUITEM_WRITE("Create or update menu items"),

    PREMISE_READ( "Read premise information"),
    PREMISE_WRITE("Create or update premise information"),

    BATCHCYCLE_READ("Read batch cycle details"),
    BATCHCYCLE_WRITE("Create or update batch cycle details"),

    INFRASTRUCTURE_READ( "Read infrastructure details"),
    INFRASTRUCTURE_WRITE("Create or update infrastructure details"),

    COURSE_READ( "Read course information"),
    COURSE_WRITE( "Create or update courses"),

    COURSE_GROUP_READ("Read course group information"),
    COURSE_GROUP_WRITE("Create or update course groups"),

    MODULE_READ("Read module information"),
    MODULE_WRITE("Create or update modules"),

    SUBJECT_READ("Read subject information"),
    SUBJECT_WRITE( "Create or update subjects"),

    TOPIC_READ("Read topic information"),
    TOPIC_WRITE("Create or update topics"),

    SECTION_READ("Read section information"),
    SECTION_WRITE("Create or update sections"),

    CERTIFICATE_READ("Read certificate information"),
    CERTIFICATE_WRITE("Create or update certificates"),

    VIDEO_READ("Read video information"),
    VIDEO_WRITE("Create or update videos"),

    SCHEDULE_READ( "Read schedule information"),
    SCHEDULE_WRITE( "Create or update schedules"),

    SESSION_READ("Read session information"),
    SESSION_WRITE( "Create or update sessions"),

    TIMESHEET_READ("Read timesheet information"),
    TIMESHEET_WRITE("Create or update timesheets"),

    PROFILE_READ("Read profile information"),
    PROFILE_WRITE("Update profile information"),

    PASSWORD_READ("Read password policies"),
    PASSWORD_WRITE("Update user passwords");


    private final String description;

    ScopeType(String description) {
        this.description = description;
    }
}
