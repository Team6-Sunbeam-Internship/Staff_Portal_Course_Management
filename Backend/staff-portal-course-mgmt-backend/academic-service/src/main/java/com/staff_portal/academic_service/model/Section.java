package com.staff_portal.academic_service.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"subjectId", "sectionName"})})
@Builder
public class Section {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "section_id", unique = true, nullable = false, updatable = false)
    private UUID sectionId;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @Column(name = "section_code", nullable = false, unique = true)
    private String sectionCode;

    @Column(nullable = false)
    private String sectionName;

    @Column(nullable = false)
    private boolean deleted = false;

    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Topic> topics = new ArrayList<>();
}

