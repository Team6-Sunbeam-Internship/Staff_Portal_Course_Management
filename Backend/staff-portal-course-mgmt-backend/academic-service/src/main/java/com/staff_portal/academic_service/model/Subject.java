package com.staff_portal.academic_service.model;

import com.staff_portal.academic_service.enums.Status;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
public class Subject {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "subject_id", unique = true, nullable = false, updatable = false)
    private UUID subjectId;

    @Column(name = "subject_code", unique = true, nullable = false)
    private String subjectCode;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id", nullable = false)
    private Module module;   // Each subject belongs to one module

    @Column(name = "subject_name", nullable = false)
    private String subjectName;   // Title in UI

    @Column(name = "theory_hours", nullable = false)
    private int theoryHours;

    @Column(name = "practical_hours", nullable = false)
    private int practicalHours;

    @Enumerated(EnumType.STRING)
    private Status status;   // ACTIVE / INACTIVE

    @Column(nullable = false)
    private boolean deleted = false;

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Section> sections = new ArrayList<>();
}

