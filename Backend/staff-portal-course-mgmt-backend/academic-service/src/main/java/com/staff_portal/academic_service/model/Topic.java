package com.staff_portal.academic_service.model;

import com.staff_portal.academic_service.enums.Status;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"sectionId", "topicName"})})
public class Topic {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "topic_id", unique = true, nullable = false, updatable = false)
    private UUID topicId;

    @ManyToOne
    @JoinColumn(name = "section_id", nullable = false)
    private Section section;

    @Column(name = "topic_name", nullable = false)
    private String topicName;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(nullable = false)
    private boolean deleted = false;
}
