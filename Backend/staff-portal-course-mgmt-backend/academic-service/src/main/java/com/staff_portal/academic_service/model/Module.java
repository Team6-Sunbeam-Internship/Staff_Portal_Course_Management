package com.staff_portal.academic_service.model;

import java.util.List;

import com.staff_portal.academic_service.enums.ModuleStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;


@Setter
@Getter
@Entity
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"course_id", "module_name"})})
public class Module {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int moduleId;

    @Column(nullable = false)
    private String moduleName;   // Title in UI

    @ManyToOne
    @JoinColumn(name = "courseTypeId", nullable = false)
    private CourseType courseType;   // Type in UI

    @ManyToOne
    @JoinColumn(name = "batchCycleId", nullable = false)
    private BatchCycle batchCycle;   // Batch in UI

    @ManyToOne
    @JoinColumn(name = "courseId", nullable = false)
    private Course course;   // Course in UI

    @Column(nullable = false)
    private int staffId;

    @Column(nullable = false)
    private int theoryHours;

    @Column(nullable = false)
    private int practicalHours;

    @Enumerated(EnumType.STRING)  // Store as string (ACTIVE, INACTIVE, etc.)
    @Column(nullable = false)
    private ModuleStatus status;   // Enum instead of String

    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Subject> subjects;
}

