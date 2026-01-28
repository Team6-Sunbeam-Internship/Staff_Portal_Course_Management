package com.staff_portal.scheduling_service.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;
import java.util.ArrayList;
import java.util.List;

@Getter
@ToString
@Setter
@NoArgsConstructor
@Entity
@Table(name = "timesheet_course_modules")
public class TimeSheetCourseModule {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(nullable = false)
    private UUID id;

    @Column(name = "course_name", nullable = false)
    private String courseName;

    @Column(name = "module_Name", nullable = false)
    private String moduleName;

    @OneToMany(mappedBy = "courseModule", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TimeSheet> timeSheets = new ArrayList<>();

}
