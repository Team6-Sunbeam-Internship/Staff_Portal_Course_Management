package com.staff_portal.academic_service.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;   // Course in UI

    @Column(name = "theory_hours", nullable = false)
    private int theoryHours;

    @Column(name = "practical_hours", nullable = false)
    private int practicalHours;

    @Column(name = "module_router_id", nullable = true)
    private UUID moduleRouterId;

    @Column(nullable = false)
    private boolean deleted = false;

    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Subject> subjects = new ArrayList<>();
}

