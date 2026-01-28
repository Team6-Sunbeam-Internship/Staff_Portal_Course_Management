package com.staff_portal.academic_service.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"sectionId", "topicName"})})
@Builder
public class Topic {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "topic_id", unique = true, nullable = false, updatable = false)
    private UUID topicId;

    @ManyToOne(cascade =  CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", nullable = false)
    private Section section;

    @Column(name = "topic_code", nullable = false, unique = true)
    private String topicCode;

    @Column(name = "topic_name", nullable = false)
    private String topicName;

    @Column(nullable = false)
    private boolean deleted = false;
}
