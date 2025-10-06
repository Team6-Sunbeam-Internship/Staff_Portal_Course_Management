package com.staff_portal.academic_service.model;

import java.util.List;
import java.util.UUID;


import com.staff_portal.academic_service.enums.Status;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;


@Entity
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"course_id", "module_code"})})
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Module {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "module_id", unique = true, nullable = false, updatable = false)
    private UUID moduleId;

    @Column(name = "module_code", unique = true, nullable = false)
    private String moduleCode;

    @Column(name = "module_name", nullable = false)
    private String moduleName;   // Title in UI

    @ManyToOne
    @JoinColumn(name = "course_type_id", nullable = false)
    private CourseType courseType;   // Type in UI

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;   // Course in UI

    @Column(name = "theory_hours", nullable = false)
    private int theoryHours;

    @Column(name = "practical_hours", nullable = false)
    private int practicalHours;

    @Enumerated(EnumType.STRING)  // Store as string (ACTIVE, INACTIVE, etc.)
    @Column(nullable = false)
    private Status status;   // Enum instead of String
    
    @Column(nullable = false)
    private boolean deleted = false;

    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Subject> subjects;
}

