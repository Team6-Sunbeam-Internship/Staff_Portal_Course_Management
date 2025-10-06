package com.staff_portal.academic_service.model;

import java.util.List;
import java.util.UUID;

import com.staff_portal.academic_service.enums.Status;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Subject {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "subject_id", unique = true, nullable = false, updatable = false)
    private UUID subjectId;

    @Column(name = "subject_code", unique = true, nullable = false)
    private String subjectCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "moduleId", nullable = false)
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

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL)
    private List<Section> sections;
}

